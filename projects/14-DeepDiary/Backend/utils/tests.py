# # Create your tests here.
import os

import django

# Create your tests here.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deep_diary.settings')
django.setup()

from mcs import McsAPI

from deep_diary.config import wallet_info
from deep_diary.settings import FACE_ROOT
from library.models import Img
from utils.mcs_storage import upload_file_pay, approve_usdc

filefold = FACE_ROOT
filename = 'face_pceCE.jpg'
api = McsAPI()
# upload file to mcs
filepath = os.path.join(filefold, filename )
wallet_address = wallet_info['wallet_address']

# img=Img.objects.get(pk=269)
w3_api = approve_usdc(wallet_info) # Usdc approve needs to be performed one step before payment.
# data = upload_file_pay(wallet_info, img.src.path)
print(w3_api)



