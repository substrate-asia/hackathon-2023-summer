import json
import logging
import time
from flask import current_app
import redis
from redis.connection import SSLConnection, Connection

REDIS_HASH_KEY = 'EXTERNAL_QUOTA'

ext_quota_redis = redis.Redis()


def init_app(app):

    check_enable = (app.config.get(
        'EXTERNAL_QUOTA_REDIS_ENABLE', False))
    if check_enable == False:
        logging.warning('EXTERNAL_QUOTA_REDIS_ENABLE %s',
                        check_enable)
        return

    logging.info('EXTERNAL_QUOTA_REDIS_ENABLE %s', check_enable)
    connection_class = Connection
    if app.config.get('QUOTA_REDIS_USE_SSL', False):
        connection_class = SSLConnection

    # EXTERNAL_QUOTA_REDIS_ENABLE=True
    # EXTERNAL_QUOTA_REDIS_USE_SSL=False
    # EXTERNAL_QUOTA_REDIS_HOST=
    # EXTERNAL_QUOTA_REDIS_PORT=
    # EXTERNAL_QUOTA_REDIS_PASSWORD=
    # EXTERNAL_QUOTA_REDIS_USERNAME
    # EXTERNAL_QUOTA_REDIS_DB
    ext_quota_redis.connection_pool = redis.ConnectionPool(**{
        'host': app.config.get('EXTERNAL_QUOTA_REDIS_HOST', 'localhost'),
        'port': app.config.get('EXTERNAL_QUOTA_REDIS_PORT', 6379),
        'username': app.config.get('EXTERNAL_QUOTA_REDIS_USERNAME', None),
        'password': app.config.get('EXTERNAL_QUOTA_REDIS_PASSWORD', None),
        'db': app.config.get('EXTERNAL_QUOTA_REDIS_DB', 0),
        'encoding': 'utf-8',
        'encoding_errors': 'strict',
        'decode_responses': False
    }, connection_class=connection_class)

    app.extensions['ext_quota_redis'] = ext_quota_redis
    logging.info('redis connection ready for EXTERNAL_QUOTA_REDIS_HOST')

    # mock_quato_data(ext_quota_redis)


def get_external_quota_from_redis(key: str) -> dict:
    if key.startswith(REDIS_HASH_KEY) == False:
        key = REDIS_HASH_KEY+':'+key
    value = ext_quota_redis.get(key)
    return value


def get_external_quota_avaliable(key: str) -> int:
    value = get_external_quota_from_redis(key)
    if value is None:
        return 0
    quota = json.loads(value)
    logging.debug('get quota %s', quota)

    return int(quota['daily'])+int(quota['extra'])


def check_quota_avaliable(key: str) -> bool:
    check_enable = current_app.config.get(
        'EXTERNAL_QUOTA_REDIS_ENABLE', False)
    if check_enable == False:
        logging.debug('EXTERNAL_QUOTA_REDIS_ENABLE %s', check_enable)
        return True

    quota = get_external_quota_avaliable(key)
    logging.debug("check_quota_avaliable key:%s, quota:%d", key, quota)
    return quota > 0


def mock_quato_data(redis):
    logging.debug('mock_quato_data')
    # redis data structure:

    # - wallet_address:   key
    # - daily_quota_avaliable: quota for everyday ； auto refreshed per day
    # - daily_quota_max: max quota for every day
    # - extra_quota_avaliable: extra quota, maybe paid by the user
    # - last_quota_change_time: time update when quota changed:     **fresh/reduce/buy...**
    # - last_sync_time: time update when the Dapp tries to sync the data from Redis to database.
    key_prefix = REDIS_HASH_KEY+':'

    wallet_address_list = ['0x071d63b945cfdaec3b063be9096f42799b7e54d3',
                           '0xab2394C5635a28C5c1349ba22B8E08B78b1fe67f']
    for wa in wallet_address_list:
        quota_data = {}
        quota_data['wallet_address'] = wa
        quota_data['daily_quota_avaliable'] = 10
        quota_data['daily_quota_max'] = 10
        quota_data['extra_quota_avaliable'] = 0
        quota_data['last_quota_change_time'] = time.time()*1000
        quota_data['last_sync_time'] = time.time()*1000

        value = json.dumps(dict(quota_data))
        if value is not None:
            redis.set(
                name=key_prefix + quota_data['wallet_address'],
                value=value)
