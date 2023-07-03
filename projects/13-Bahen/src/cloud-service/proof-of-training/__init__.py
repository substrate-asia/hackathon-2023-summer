import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import os

import json
import azure.functions as func
from azure.cosmos import CosmosClient
from azure.storage.blob import BlobServiceClient
from web3 import Web3
from eth_account import Account

def main(req: func.HttpRequest) -> func.HttpResponse:

    ## Init the cosmos db client and containers
    db_url = 'https://labapex.documents.azure.com:443/'
    db_key = 'ZLrVux84ipkVbA9OTMyQ1YswiarrBIswBB7ILAiyLxJkRYoUW3e7M2IjPHjdqbd4AdfPjQ3XPjkSACDbYVf8uw=='
    db_client = CosmosClient(db_url, credential=db_key)
    
    connection_string = "DefaultEndpointsProtocol=https;AccountName=kejie1;AccountKey=wKggITwQijuI4m+7nNyH9XC1JuYsaY8O3ftrhdgDNXVLKYtgV0mvgdPhN3fw/0slGFUTuGVdnKw9+AStVkOoEw==;EndpointSuffix=core.windows.net"
    container_name = req.params.get('container')
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)   

    ## Get the task id
    task_id = int(req.params.get('task_id'))

    database = db_client.get_database_client(container_name)
    gpu_container = database.get_container_client('gpu_metrics')
    loss_container = database.get_container_client('loss_metrics')
    ckpt_container = database.get_container_client('ckpt_metrics')

    ## Get the data from the containers
    try:
        gpu_metrics = list(gpu_container.read_all_items())
        gpu_metrics = pd.DataFrame(gpu_metrics)
        gpu_metrics = gpu_metrics[['id', 'device_id', 'memory_used', 'memory_total', 'gpu_utilization', 'timestamp']]

        loss_metrics = list(loss_container.read_all_items())
        loss_metrics = pd.DataFrame(loss_metrics)
        loss_metrics = loss_metrics[['id', 'epoch', 'batch_idx', 'loss', 'timestamp', 'total_epochs', 'total_iters']]

        ckpt_metrics = list(ckpt_container.read_all_items())
        ckpt_metrics = pd.DataFrame(ckpt_metrics)
        ckpt_metrics = ckpt_metrics[['id', 'model_path', 'timestamp']]    
    except:
        print('No data in the containers')
    
    ## Generate the visulizations and upload to azure blob
    generate_visulizations(gpu_metrics, loss_metrics, ckpt_metrics, blob_service_client, container_name)

    ## Return the result
    training_result = validate_training(gpu_metrics, loss_metrics, ckpt_metrics)
    
    ## Complete the task by sending transaction to the blockchain
    if training_result == True:
        complete_task(task_id)
    return func.HttpResponse(f"{training_result}", status_code=200)


def validate_training(gpu_metrics, loss_metrics, ckpt_metrics):
    ## Check if the data is valid
    VALID_TRAINING = True

    ## If no data for any of the containers, then the training is not valid
    if len(gpu_metrics) == 0 or len(loss_metrics) == 0 or len(ckpt_metrics) == 0:
        VALID_TRAINING = False

    ## If the difference between the highest GPU memory usage and the lowest GPU memory usage is less than 10%, then the training is not valid
    gpu_memory_usage = gpu_metrics.memory_used.values
    gpu_total_memory = gpu_metrics.memory_total.values[0]
    if np.percentile(gpu_memory_usage, 20) < 0.05*gpu_total_memory:
        VALID_TRAINING = False

    ## If the difference between the highest GPU utilization and the lowest GPU utilization is less than 10%, then the training is not valid
    gpu_util_usage = gpu_metrics.gpu_utilization.values
    if (np.max(gpu_util_usage) - np.min(gpu_util_usage)) / (np.min(gpu_util_usage)+0.1) < 0.1:
        VALID_TRAINING = False

    ## Check the total number of running epochs == total_epochs
    total_epochs = loss_metrics.total_epochs.values[0]
    if len(np.unique(loss_metrics.epoch.values)) != total_epochs:
        VALID_TRAINING = False

    ## Check the total number of generated model ckpts == total_epochs
    if len(ckpt_metrics) != total_epochs:
        VALID_TRAINING = False

    ## For each epoch, check the number of logs == number of batches, otherwise the training is not valid
    total_iters = loss_metrics.total_iters.values[0]
    for epoch in range(total_epochs):
        if len(loss_metrics[loss_metrics['epoch'] == epoch]) != total_iters:
            VALID_TRAINING = False
            break
    
    ## GPU Utilization check: over 30% of the training time, the GPU utilization should be more than the average GPU utilization
    gpu_util_usage = gpu_metrics.gpu_utilization.values
    average_gpu_util = np.mean(gpu_util_usage)
    if len(gpu_util_usage[gpu_util_usage > average_gpu_util]) < 0.3*len(gpu_util_usage):
        VALID_TRAINING = False

    return VALID_TRAINING


def complete_task(task_id):
    ## Connect to the blockchain
    url = 'https://rpc.api.moonbase.moonbeam.network'
    web3 = Web3(Web3.HTTPProvider(url))

    contract_address = '0xc6d1Fce91f96480AfF34bfCfFAd57C427C954010'
    account_address = '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0'
    private_key = '8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b'
    chain_id = 1287
    gas = 6721970
    gasPrice = 1
    gasPrice_wei = web3.to_wei(str(gasPrice), 'gwei')

    with open(os.path.join('HttpTrigger1', 'Marketplace.json')) as f:
        abi = json.load(f)
    
    ## Send a transaction to the blockchain
    marketplace_contract = web3.eth.contract(address=contract_address, abi=abi)
    nonce = web3.eth.get_transaction_count(account_address)
    txn = marketplace_contract.functions.CompleteTask(account_address, task_id).build_transaction({
        'chainId': chain_id,
        'gas': gas,
        'gasPrice': gasPrice_wei,
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
    web3.eth.send_raw_transaction(signed_txn.rawTransaction)

def generate_visulizations(loss_metrics, gpu_metrics, blob_service_client, container_name):
     ## Generate training loss metrics visulizations and upload it to azure blob
    try:
        loss_metric_arr = loss_metrics.loss.values
    except:
        loss_metric_arr = []
    plt.figure(dpi=100)
    plt.plot(loss_metric_arr)
    plt.title('Training loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.grid(True)
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100)  # Save the figure to the buffer at 300 DPI
    buf.seek(0)
    blob_name = 'training_result_visulization/training_loss.png'
    blob_client = blob_service_client.get_blob_client(container_name, blob_name)
    blob_client.upload_blob(buf.read(), overwrite=True)
    buf.close()

    ## Generate training gpu metrics visulizations and upload them to azure blob
    try:
        timestamp = gpu_metrics.timestamp.values
        timestamp = timestamp - timestamp[0]
        gpu_memory_arr = gpu_metrics.memory_used.values
        gpu_memory_arr = gpu_memory_arr*100 / (gpu_metrics.memory_total.values[0])
    except:
        timestamp = []
        gpu_memory_arr = []
    plt.figure(dpi=100)
    plt.plot(timestamp, gpu_memory_arr)
    plt.title('GPU memory')
    plt.xlabel('Time (seconds)')
    plt.ylabel('GPU Memory Usage (%)')
    plt.grid(True)
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100)  # Save the figure to the buffer at 300 DPI
    buf.seek(0)
    blob_name = 'training_result_visulization/gpu_memory.png'
    blob_client = blob_service_client.get_blob_client(container_name, blob_name)
    blob_client.upload_blob(buf.read(), overwrite=True)
    buf.close()

    ## Generate training gpu metrics visulizations and upload them to azure blob
    try:
        gpu_util_arr = gpu_metrics.gpu_utilization.values
    except:
        gpu_util_arr = []
    plt.figure(dpi=100)
    plt.plot(timestamp, gpu_util_arr)
    plt.title('GPU utilization')
    plt.xlabel('Time (seconds)')
    plt.ylabel('GPU Utilization Usage (%)')
    plt.grid(True)
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100)  # Save the figure to the buffer at 300 DPI
    buf.seek(0)
    blob_name = 'training_result_visulization/gpu_utilization.png'
    blob_client = blob_service_client.get_blob_client(container_name, blob_name)
    blob_client.upload_blob(buf.read(), overwrite=True)
    buf.close()
    
    
    




