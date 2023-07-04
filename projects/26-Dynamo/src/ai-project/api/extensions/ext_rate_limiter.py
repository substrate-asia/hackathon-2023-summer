
import logging
from flask import Request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


def get_key_for_chat_messages_api() -> str:
    return 'chat-messages'


def get_key_for_completion_messages_api() -> str:
    return 'completion-messages'


# Global rate limit for each route for each remote_address
GLOBAL_RATE_LIMITS = "6000/minute,100/second"

# rate limit for chat, shared by whole application, so we need to define the key_func
GLOBAL_RATE_LIMITS_CHAT = "3000/minute,50/second"
# GLOBAL_RATE_LIMITS_CHAT = "1/minute,1/second"
GLOBAL_RATE_LIMITS_CHAT_ERROR_MESSGAE = "Too many requests, please retry after one minute"


api_rate_limiter = Limiter(
    key_func=get_remote_address,
    default_limits=GLOBAL_RATE_LIMITS.split(','),
    strategy="fixed-window",
    storage_uri="memory://",
)


def init_app(app):
    api_rate_limiter.init_app(app)
    app.extensions['api_rate_limiter'] = api_rate_limiter
    logging.info('api_rate_limiter is ready')
