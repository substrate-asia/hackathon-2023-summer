import threading
import time
from azure.cosmos import CosmosClient, exceptions, PartitionKey
from azure.storage.blob import BlobServiceClient
import torch
import uuid
import os 
import pynvml

class LoggingCallback:
    def __init__(self, db_url, db_key, connection_string, container_name):

        ## Init the cosmos db client
        self.client = CosmosClient(db_url, credential=db_key)
        self.create_db_resources(container_name)

        ## Init the blob storage client
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = container_name

        ## Initialize DCGM or GPU metrics collection tool here
        self.total_collect_metrics_flag = True
        pynvml.nvmlInit()
        self.device_count = pynvml.nvmlDeviceGetCount()
        self.metric_collection_thread = threading.Thread(target=self.collect_metrics)
        self.metric_collection_thread.daemon = True
        self.collect_metrics_flag = False

    def create_db_resources(self, db_name):
        ## Create the database if it doesn't exist
        try:
            self.database = self.client.create_database(db_name)
        except exceptions.CosmosResourceExistsError:
            self.database = self.client.get_database_client(db_name)

        ## Create the GPU container if it doesn't exist
        try:
            self.gpu_container = self.database.create_container(id='gpu_metrics', partition_key=PartitionKey(path="/id"))
        except exceptions.CosmosResourceExistsError:
            self.gpu_container = self.database.get_container_client('gpu_metrics')
        except exceptions.CosmosHttpResponseError:
            raise

        ## Create the loss container if it doesn't exist
        try:
            self.loss_container = self.database.create_container(id='loss_metrics', partition_key=PartitionKey(path="/id"))
        except exceptions.CosmosResourceExistsError:
            self.loss_container = self.database.get_container_client('loss_metrics')
        except exceptions.CosmosHttpResponseError:
            raise

        ## Create the checkpoint container if it doesn't exist
        try:
            self.ckpt_container = self.database.create_container(id='ckpt_metrics', partition_key=PartitionKey(path="/id"))
        except exceptions.CosmosResourceExistsError:
            self.ckpt_container = self.database.get_container_client('ckpt_metrics')
        except exceptions.CosmosHttpResponseError:
            raise

    def collect_metrics(self):
            while self.collect_metrics_flag:
                for i in range(self.device_count):
                    handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                    info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                    utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)

                    metrics = {
                        "id": str(uuid.uuid4()),
                        "device_id": i,
                        "memory_used": info.used,
                        "memory_total": info.total,
                        "gpu_utilization": utilization.gpu,
                        "timestamp": time.time()
                    }

                    # Log the GPU metrics to gpu_container in cosmos db
                    self.gpu_container.upsert_item(metrics)
                    
                time.sleep(2)

    def start_logging(self):
        ## Start collecting GPU metrics
        self.collect_metrics_flag = True
        if self.total_collect_metrics_flag:
            if not self.metric_collection_thread.is_alive():
                self.metric_collection_thread.start()

    def stop_logging(self):
        ## Stop collecting GPU metrics
        self.collect_metrics_flag = False

    def log_loss(self, loss, epoch, batch_idx, total_epochs, total_iters):
        ## Construct the log message
        log_message = {
            "id": str(uuid.uuid4()),
            "epoch": epoch,
            "batch_idx": batch_idx,
            "loss": loss,
            "timestamp": time.time(),
            'total_epochs': total_epochs,
            'total_iters': total_iters,
        }
        ## Log loss to loss_container in cosmos db
        self.loss_container.upsert_item(log_message)

    def save_and_upload_model(self, model, model_path):
        ## Log the model checkpoint info to ckpt_container in cosmos db
        model_save_path = f'trained_result_model/{model_path}'
        log_message = {
            "id": str(uuid.uuid4()),
            "model_path": model_save_path,
            "timestamp": time.time()
        }
        self.ckpt_container.upsert_item(log_message)

        ## Save the model checkpoint
        os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
        torch.save(model.state_dict(), model_save_path)

        ## Create a blob client
        blob_client = self.blob_service_client.get_blob_client(self.container_name, model_save_path)

        ## Upload the model checkpoint to Azure Blob Storage
        with open(model_save_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)