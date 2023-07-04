import argparse
import logging as l
from pathlib import Path
import numbers
import json
from substrateinterface import SubstrateInterface, Keypair
from substrateinterface.exceptions import SubstrateRequestException

substrate = SubstrateInterface('wss://rpc.polkadot.io')

import logging
# Create a custom logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


JUDGEMENT_PROMPT = '''
show my address balance, my address is 1xxxxx.
'''

from core.config import Config
os.environ["OPENAI_API_KEY"] = Config.OPENAI_API_KEY
MODEL_NAME = Config.MODEL_NAME
LLM = OpenAI(model_name=MODEL_NAME, temperature=0)  

import logging
# Create a custom logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def query_balances(account):
    # print("query balances args",args)
    # account = args.account
    # print(account)
    
    result = substrate.query(
        module='System',
        storage_function='Account',
        params=[account]
    )
    # print('System Account: ', result)
    amount = (result.value["data"]["free"] + result.value["data"]["reserved"])
    # amount = format(amount / 10**substrate.properties.get('tokenDecimals', 0), ".18g")
    print(f'''account: {account}\nbalances:\n- amount: {amount}\n  denom: {substrate.properties.get('tokenSymbol', 'UNIT')}''')