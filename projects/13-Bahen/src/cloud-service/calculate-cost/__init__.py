import os
import logging
import azure.functions as func
import os
import sys
import tempfile
import importlib
import json
import shutil
from sys import executable as se
from subprocess import check_call
import uuid

from azure.storage.blob import BlobServiceClient
from torch.profiler import profile, record_function, ProfilerActivity
    
def download_modules(container_name):
    connection_string = 'DefaultEndpointsProtocol=https;AccountName=kejie1;AccountKey=wKggITwQijuI4m+7nNyH9XC1JuYsaY8O3ftrhdgDNXVLKYtgV0mvgdPhN3fw/0slGFUTuGVdnKw9+AStVkOoEw==;EndpointSuffix=core.windows.net'
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)

    temp_dir = tempfile.mkdtemp()
    sys.path.append(temp_dir)

    logging.info('Downloading data...')
    for blob in container_client.list_blobs():

        if blob.size == 0:
            print(f"Skipping directory {blob.name}")
            continue

        #blob_client = container_client.get_blob_client(blob)
        download_path = os.path.join(temp_dir, blob.name)

        # Create the local directory if it doesn't exist
        local_directory = os.path.dirname(download_path)
        os.makedirs(local_directory, exist_ok=True)

        with open(download_path, "wb") as local_file:
            blob_client = container_client.get_blob_client(blob.name)
            download_stream = blob_client.download_blob()
            local_file.write(download_stream.readall())
    logging.info('Download finished')
    sys.path = sys.path[:-1]
    return temp_dir

def get_flops(temp_dir):
    # Import the modules and variables
    sys.path.append(f'{temp_dir}/script')
    logging.info('sys.path: %s', sys.path)
    train = importlib.import_module('train')
    importlib.reload(train)

    model = train.model
    dataloader = train.train_dataloader
    epoches = train.epochs
    
    # Calculate the FLOPs by one forward-pass
    num_batches = len(dataloader)
    inputs, _ = next(iter(dataloader))

    with profile(activities=[ProfilerActivity.CPU], profile_memory=True, with_flops=True) as prof:
        with record_function("model_inference"):
            model(inputs)

    events = prof.events()
    forward_flops = sum([int(evt.flops) for evt in events]) 
    total_flops = forward_flops * num_batches * 3 * epoches

    RTX3090_FLOPs = 71 * 10**12
    sys.path = sys.path[:-1]
    return {'result_unit': round(total_flops / RTX3090_FLOPs)}
    
def main(req: func.HttpRequest) -> func.HttpResponse:
    
    logging.info('Python HTTP trigger function processed a request.')

    container_name = req.params.get('container')

    if not container_name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            container_name = req_body.get('container')
            
    if container_name:
        # Download data and scripts
        temp_dir = download_modules(container_name)

        # Calculate the FLOPs
        result_unit = get_flops(temp_dir)

        # Delete the downloaded data
        shutil.rmtree(temp_dir)
        
        # Return the result
        return func.HttpResponse(json.dumps(result_unit), status_code=200, mimetype="application/json")
        
    else:
        return func.HttpResponse(
             "Please send the container name in the query string",
             status_code=400
        )
