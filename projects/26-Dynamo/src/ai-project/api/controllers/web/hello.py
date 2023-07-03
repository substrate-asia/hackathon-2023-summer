# -*- coding:utf-8 -*-
from controllers.web.wraps import WebApiResource, validate_token
from flask_restful import Resource
from controllers.web import api
from extensions.ext_rate_limiter import api_rate_limiter
from flask import request


class HelloWorld(Resource):
    def get(self):
        return {'result': 'hello world'}, 200


class TestWebApi_decorators(WebApiResource):
    def get(self,app_model, end_user):
        return {'result': 'testWebApi_decorators'}, 200


class T_RateLimiter(HelloWorld):
    # print('T_RateLimiter', api_rate_limiter)
    decorators = [api_rate_limiter.limit("1/second, 5/minute")]
     
    
class T_RateLimiter2(TestWebApi_decorators):     
    decorators = [api_rate_limiter.limit("1/second, 5/minute")]
  
 
api.add_resource(HelloWorld, '/helloworld')
api.add_resource(TestWebApi_decorators, '/testWebApi_decorators')
api.add_resource(T_RateLimiter, '/rate_limiter')
api.add_resource(T_RateLimiter2, '/rate_limiter2')