# -*- coding:utf-8 -*-
from models.model import App, AppModelConfig, Site
from extensions.ext_database import db
from flask_restful import Resource, reqparse, fields, marshal_with, inputs
from libs.helper import TimestampField
import logging
from flask_restful import marshal_with, fields
from extensions.ext_kafka import publish_chat_app_start_message

from controllers.web import api
from controllers.web.wraps import WebApiResource


class AppParameterApi(WebApiResource):
    """Resource for app variables."""
    variable_fields = {
        'key': fields.String,
        'name': fields.String,
        'description': fields.String,
        'type': fields.String,
        'default': fields.String,
        'max_length': fields.Integer,
        'options': fields.List(fields.String)
    }

    parameters_fields = {
        'opening_statement': fields.String,
        'suggested_questions': fields.Raw,
        'suggested_questions_after_answer': fields.Raw,
        'more_like_this': fields.Raw,
        'user_input_form': fields.Raw,
    }

    @marshal_with(parameters_fields)
    def get(self, app_model, end_user):
        """Retrieve app parameters."""
        app_model_config = app_model.app_model_config

        return {
            'opening_statement': app_model_config.opening_statement,
            'suggested_questions': app_model_config.suggested_questions_list,
            'suggested_questions_after_answer': app_model_config.suggested_questions_after_answer_dict,
            'more_like_this': app_model_config.more_like_this_dict,
            'user_input_form': app_model_config.user_input_form_list
        }


class ChatAppStartApi(WebApiResource):
    def post(self, app_model, end_user):

        logging.info('chat app start for %s %s', end_user.app_id,
                     end_user.external_user_id)

        publish_chat_app_start_message(
            end_user.external_user_id, end_user.app_id)

        return {"result": "success",
                "app_id": end_user.app_id,
                "external_user_id": end_user.external_user_id}, 200


class AppListApi(Resource):
    site_partial_fields = {
        'id': fields.String,
        'code': fields.String,
        'title': fields.String,
        'icon': fields.String,
        'icon_background': fields.String,
        'description': fields.String, 
        "default_language":  fields.String,
        "customize_domain":  fields.String,
        "copyright":  fields.String,
        "privacy_policy":  fields.String,
        "customize_token_strategy":  fields.String,
        "prompt_public":  fields.Boolean,
        "app_base_url":  fields.String, 
        "brief_description":  fields.String, 
        "public_for_lumi":  fields.Boolean,
    }

    app_partial_fields = {
        'id': fields.String,
        'name': fields.String,
        'mode': fields.String,
        'icon': fields.String,
        'icon_background': fields.String,
        'enable_site': fields.Boolean,
        'enable_api': fields.Boolean,
        'created_at': TimestampField,
        'site_id': fields.String,
        'site_code': fields.String,
        'site_description': fields.String,
        "api_base_url": fields.String,
        'site': fields.Raw(site_partial_fields),
    }

    app_pagination_fields = {
        'page': fields.Integer,
        'limit': fields.Integer,
        'total': fields.Integer,
        'has_more': fields.Boolean,
        'data': fields.List(fields.Nested(app_partial_fields))
    }

    @marshal_with(app_pagination_fields)
    def get(self):
        """Get app list"""
        logging.debug("Get app list")
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=inputs.int_range(
            1, 99999), required=False, default=1, location='args')
        parser.add_argument('limit', type=inputs.int_range(
            1, 100), required=False, default=20, location='args')
        args = parser.parse_args()

        app_models = db.paginate(
            db.select(App).where(App.enable_site == True)
            .order_by(
                App.created_at.desc()),
            page=args['page'],
            per_page=args['limit'],
            error_out=False)
        logging.debug("app_models %d", app_models.total)
        app_sites = {
            'page': app_models.page,
            'limit': app_models.per_page,
            'total': app_models.total,
            'has_more': app_models.has_next,
            'data':  []
        }
        data_list: list = app_sites["data"]
        if app_models.total > 0:
            apps: list[App] = app_models.items
            logging.debug(app_models)
            for app in apps:
                site: Site = app.site
                
                # filter  by check site.public_for_lumi
                # logging.debug(site.public_for_lumi)
                if site.public_for_lumi is not True :
                   logging.debug('app site is not public for lumi, app.id=%s, site.code=%s, site.title:%s',app.id,site.code,site.title)
                   continue

                site_fields = {
                    'id': site.id,
                    'code': site.code,
                    'title': site.title,
                    'icon': site.icon,
                    'icon_background': site.icon_background,
                    'description': site.description,
                    "default_language":  site.default_language,
                    "customize_domain":  site.customize_domain,
                    "copyright":  site.copyright,
                    "privacy_policy":  site.privacy_policy,
                    "customize_token_strategy":  site.customize_token_strategy,
                    "prompt_public": site.prompt_public,
                    "app_base_url":  site.app_base_url,
                    "brief_description":  site.brief_description, 
                    "public_for_lumi":  site.public_for_lumi
                }
                data_list.append(
                    {
                        'id': app.id,
                        'name': app.name,
                        'mode': app.mode,
                        'icon': app.icon,
                        'icon_background': app.icon_background,
                        'enable_site': app.enable_site,
                        'enable_api': app.enable_api,
                        'created_at': app.created_at,
                        'site_id': site.id,
                        'site_code': site.code,
                        'site_description': site.description,
                        'api_base_url': app.api_base_url,
                        'site': site_fields
                    })

        return app_sites


api.add_resource(AppParameterApi, '/parameters')
api.add_resource(ChatAppStartApi, '/chatapp-start')
api.add_resource(AppListApi, '/apps')
