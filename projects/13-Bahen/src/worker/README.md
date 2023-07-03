# Worker Client for Web3 DApps Project

This repository contains the worker client for our Web3 DApps project. The client is responsible for registering workers, listening for task allocation requests from the smart contracts, training the model with local CPU/GPU, and sending the logs and the trained model to the C# server for verification.

## Setup and Run

Follow the steps below to set up and run the worker client:

1. ***Install docker**
docker build -t workerclient2 -f docker.dockerfile .
docker pull linjiu/workerclient 

2. **Configure the Client**: Open the `config.json` file and fill in the correct Ethereum node URL, the address and ABI of the smart contract, and the worker's information.

3. **Run the Client**: In the Command Prompt, run the command `python src/client.py` to start the client. The client will automatically connect to the Ethereum network, listen to the events of the smart contract, receive new tasks, and assign them to the worker.

4. **Register the Worker**: Before running the client, users need to fill in the worker's information, such as the name and computational power, in the `config.json` file. When the client is started, it will send the worker's information to the smart contract for registration.

Please note that these steps might need to be adjusted based on your specific requirements and environment. For example, if your client needs to interact with other services, you might need to configure network connections and authentication information. If your client needs to process a large amount of data, you might need to configure database connections and storage space.
