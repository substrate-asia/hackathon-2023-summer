# -*- coding:utf-8 -*-

from sqlalchemy.dialects.postgresql import insert
from functools import wraps
import hashlib
import logging
from flask import current_app, request, session
from werkzeug.exceptions import Unauthorized, BadRequest

from extensions.ext_database import db
from models.model import App, InstalledApp, Site, EndUser
import jwt
from jwt import exceptions


def validate_web3_token(view=None):
    def decorator(view):
        @wraps(view)
        def decorated(*args, **kwargs):

            is_public_api_access: bool = check_is_public_api_access()

            app_model, user_wallet_address = validate_and_get_app(is_public_api_access)

            if not app_model:
                raise BadRequest('app not found')

            if app_model.status != 'normal':
                raise BadRequest('app status is not normal')

            if not app_model.enable_site:
                raise BadRequest('app not enable site')

            if is_public_api_access:
                # won't check user_wallet_address
                pass
            else:
                if not user_wallet_address:
                    raise Unauthorized()

            end_user = create_or_update_end_user_for_session(
                app_model, user_wallet_address)

            return view(app_model, end_user, *args, **kwargs)
        return decorated

    if view:
        return decorator(view)
    return decorator


def check_is_public_api_access():

    x_header = request.headers.get('x-public-api')
    if x_header is None:
        return False

    if x_header.strip().lower() == 'public-api':
        return True

    return False


def validate_and_get_app(is_public_api_access:bool):
    """
    Validate and get user wallet address
    """
    auth_header = request.headers.get('Authorization')
    if auth_header is None:
        raise Unauthorized()

    tokens = auth_header.split(None)
    
    if is_public_api_access==False and len(tokens) < 3:
        raise Unauthorized()

    user_wallet_address=''
    app_id = ''
    
    #
    auth_scheme = tokens[0].strip().lower()
    if auth_scheme.lower() != 'bearer':
        raise Unauthorized()
    
    #
    code = tokens[1].strip()
    if len(code) > 25 and code.index('-') > 0:
        # this code is installed_apps.id
        installed_app = db.session.query(InstalledApp).filter(
            InstalledApp.id == code,

        ).first()
        if not installed_app:
            raise BadRequest('installed_app not found')
        app_id = installed_app.app_id
    else:
        # this code is sites.code
        site = db.session.query(Site).filter(
            Site.code == code,
            Site.status == 'normal'
        ).first()
        if not site:
            raise BadRequest('site not found')
        app_id = site.app_id

    app_model = db.session.get(App, app_id)
    
    #    
    if len(tokens)>=3:
        user_token = tokens[2].strip()
        user_wallet_address = decode_user_token(user_token)
        if is_public_api_access==False and not user_wallet_address:
            raise Unauthorized()
        
    return [app_model, user_wallet_address]


def decode_user_token(user_token: str) -> str:
    try:
        SECRET_KEY = current_app.config['JWT_SHARED_SECRET_KEY']
        payload = jwt.decode(user_token, SECRET_KEY, algorithms='HS256')
        if payload:
            user_wallet_address = payload['account']
            return user_wallet_address
    except exceptions.ExpiredSignatureError:
        logging.error('token ExpiredSignatureError')
    except jwt.DecodeError:
        logging.error('token DecodeError')
    except jwt.InvalidTokenError:
        logging.error('token InvalidTokenError')

    return ''


def create_or_update_end_user_for_session(app_model: App, user_wallet_address: str):
    """
    Create or update session terminal based on session ID.
    """
    if 'user_wallet_address' not in session:
        session['user_wallet_address'] = user_wallet_address

    need_generate_session_id = False
    session_id = ''
    if 'session_id' in session:
        session_id = session.get('session_id')
        logging.debug('session_id %s', session_id)

        if session_id.find(user_wallet_address) == -1:
            logging.error('session_id in session %s does not match user_wallet_address %s, need re-generate',
                          session_id, user_wallet_address)
            need_generate_session_id = True

    if 'session_id' not in session:
        logging.warning('session_id not in session')
        need_generate_session_id = True

    if need_generate_session_id:
        session_id = generate_session_id(
            app_model, user_wallet_address)
        session['session_id'] = session_id
        logging.info('new session_id %s', session_id)

    end_user_id = map_session_id_to_end_user_id(session_id)
    if 'end_user_id' not in session:
        session['end_user_id'] = end_user_id

    end_user = db.session.query(EndUser) .filter(
        EndUser.id == end_user_id).first()

    if end_user is None:
        end_user = EndUser(
            id=end_user_id,
            tenant_id=app_model.tenant_id,
            app_id=app_model.id,
            type='browser',
            is_anonymous=True,
            session_id=session_id,
            external_user_id=user_wallet_address
        )
        insert_stmt = insert(EndUser).values(
            id=end_user_id,
            tenant_id=app_model.tenant_id,
            app_id=app_model.id,
            type='browser',
            is_anonymous=True,
            session_id=session_id,
            external_user_id=user_wallet_address
        )
        on_duplicate_key_stmt = insert_stmt.on_conflict_do_nothing(
            index_elements=['id'])
        db.session.execute(on_duplicate_key_stmt)
        db.session.commit()

    return end_user


def map_session_id_to_end_user_id(session_id):
    return hashlib.new("md5", session_id.encode("utf-8")).hexdigest()


def generate_session_id(app_model: App, user_wallet_address: str):
    """
    Generate a unique session ID.
    """
    tenant_id = app_model.tenant_id
    app_id = app_model.id
    type = 'browser'
    session_id = tenant_id+'_'+app_id+'_'+type+'_'+user_wallet_address

    return session_id
