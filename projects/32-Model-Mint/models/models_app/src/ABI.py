import json
import requests

def get_contractAbi(contract_address):
    contract_url = 'https://www.oklink.com/api/explorer/v1/okexchain/addresses/' + contract_address + '/contract'
    headers = {
        'apikey': 'f83524db-f6cd-4932-9eb7-3decbc890b0f',
    }
    contract_json = requests.get(contract_url, headers=headers)
    contract_json_data = json.loads(contract_json.text)
    contract_json_data = contract_json_data['data']
    abiCode = contract_json_data['contractAbi']
    abiCode = json.loads(abiCode)
    return abiCode

print(get_contractAbi('0xda0d7f342b9c0f7f5f456e0c0a3ec6fe925eaef3'))