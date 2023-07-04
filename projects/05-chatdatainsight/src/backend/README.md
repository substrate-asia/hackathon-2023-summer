
# ChatdataInsight APP

Application built with FastAPI, React, and MongoDB. 

You need a mongodb account. 

## Setup MongoDB connection

``` 
    -> Create a .env file and add the following lines: 

    DB_URL = "mongodb+srv://<name>:<password>@..."
    DB_NAME = "PolarDashApp"
    COLLECTION_NAME = "polardash"

```

## Setup backend

In the backend folder
```
    -> Create a new env. with python3 -m venv polardash-backend-env
    -> Activate the virtual env. with source polardash-backend-env/bin/activate 
    -> Install dependencies with <b>pip install -r requirements.txt</b>
    -> Activate the backend with python main.py

```

## run with docker
```
docker build --tag chatdatainsight .

docker-compose up -d
```

## API Test Examples

### 1 Query on-chain information

```
1.1 Can you check how many kinds of tokens the address 0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B has?

1.2 Check the recent transfer records of this account 0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B.

1.3 Please check what is the ENS associated with the account 0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B

1.4 Can you help me examine the details of this contract: 0xf2A22B900dde3ba18Ec2AeF67D4c8C1a0DAB6aAC?

1.5 What tokens and NFTs does 'vitalik.eth' have and what they are?
```
```
```

### 2 Query cex data

```
What's the recent price trend of BTC over the last few hours?
```

### 3 Query dex

```
3.1 Could you please check the trading volume of decentralized exchanges?
3.2 Can you help me check the trading volumes of exchanges on various blockchains?
3.3 What is the daily trading volume of dex?

```
### 4 Query Stablecoin info

```
4.1 Can you help me check the market share of stablecoin?

```

### 5 Query certain project info

```

5.1 Which stablecoins are available on Moonbeam?

```

