# Create your tests here.
import os

import django

from deep_diary.config import api_key, api_secret

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deep_diary.settings')
django.setup()

import requests
from requests.auth import HTTPBasicAuth

###
# API Credentials
API_KEY = api_key  # Set API key here
API_SECRET = api_secret  # Set API secret here
###
ENDPOINT = 'https://api.imagga.com/v2'
FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif']


class ArgumentException(Exception):
    pass


if API_KEY == 'YOUR_API_KEY' or \
        API_SECRET == 'YOUR_API_SECRET':
    raise ArgumentException('You haven\'t set your API credentials. '
                            'Edit the script and set them.')

auth = HTTPBasicAuth(API_KEY, API_SECRET)


# def tag_image_post(img_path, upload_id=False, verbose=False, language='en'):
#     # Using the local img through post mathod to get the tags,
#
#     tagging_query = {
#         'verbose': verbose,
#         'language': language,
#         'threshold': 25.0,
#     }
#     tagging_response = requests.post(
#         '%s/tags' % ENDPOINT,
#         auth=(api_key, api_secret),
#         auth=(api_key, api_secret),
#         files={'image': open(img_path, 'rb')},
#         params=tagging_query)
#
#     return tagging_response.json()


def imagga_post(img_path, endpoint, query=None): # using the loca img

    if query is None:
        query = {}
    query = query.update(query)
    response = requests.post(
        '%s/%s' % (ENDPOINT, endpoint),
        auth=(api_key, api_secret),
        files={'image': open(img_path, 'rb')},
        params=query)

    return response.json()


def imagga_get(image_url, endpoint, query_add=None, upload_id=False): # query must include the 'image_url'
    if query_add is None:
        query_add = {}
    query = {
        'image_upload_id' if upload_id else 'image_url': image_url,
    }
    query = query.update(query_add)

    response = requests.get(
        '%s/%s' % (ENDPOINT, endpoint),
        auth=(api_key, api_secret),
        files={'image': open(image_url, 'rb')},
        params=query)

    return response.json()

#
#
# def imagga_post_tags(img_path):
#     tag_list = []
#     endpoint = 'tags'
#     tagging_query = {
#         'verbose': False,
#         'language': False,
#         'threshold': 25.0,
#     }
#     response = imagga_post(img_path, endpoint, tagging_query)
#
#     if response['status']['type'] != 'success':
#         return []
#
#     if 'result' in response:
#         tags = response['result'][endpoint]
#
#         for tag in tags:
#             tag_list.append(tag['tag']['en'])
#
#     return tag_list
