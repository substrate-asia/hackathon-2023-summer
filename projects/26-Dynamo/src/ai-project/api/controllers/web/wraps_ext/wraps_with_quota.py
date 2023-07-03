# -*- coding:utf-8 -*-

from flask_restful import Resource

from controllers.web.wraps_ext.check_user_quota import check_user_quota
from controllers.web.wraps_ext.validate_web3_token import validate_web3_token


class WebApiWithQuotaResource(Resource):
    method_decorators = [check_user_quota, validate_web3_token]
