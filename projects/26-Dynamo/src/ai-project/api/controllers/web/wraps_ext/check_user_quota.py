# -*- coding:utf-8 -*-

from functools import wraps
import logging
from werkzeug.exceptions import HTTPException, Unauthorized
from controllers.web.wraps_ext.validate_web3_token import check_is_public_api_access
from extensions.ext_quota_redis import check_quota_avaliable

from models.model import App, EndUser


class NoEnoughQuota(HTTPException):
    """*400* `No Enough Quota` 
    """
    code = 400
    description = (
        "you don't have enough quota to interact with AI bot, each chat consumes 1 quota."
    )


def check_user_quota(view=None):
    def decorator(view):
        @wraps(view)
        def decorated(app_model: App, end_user: EndUser, *args, **kwargs):

            is_public_api_access: bool = check_is_public_api_access()
            if is_public_api_access == True:
                logging.debug(
                    "check_user_quota will be ignored since is_public_api_access as True")
                return view(app_model, end_user, *args, **kwargs)

            logging.warning("check_user_quota for end_user external_user_id:%s",
                            end_user.external_user_id)
            key = end_user.external_user_id
            if not key:
                raise Unauthorized()

            checked = check_quota_avaliable(key)
            if checked == False:
                raise NoEnoughQuota()

            return view(app_model, end_user, *args, **kwargs)

        return decorated

    if view:
        return decorator(view)
    return decorator
