use std::future::{ready, Ready};
use actix_web::body::EitherBody;
use actix_web::dev::{self, ServiceRequest, ServiceResponse};
use actix_web::dev::{Service, Transform};
use actix_web::{web, Error, HttpResponse};
use futures_util::future::LocalBoxFuture;

pub struct VerifyToken;

use crate::endpoint::auth_token;
use crate::endpoint::service::*;

impl<S, B> Transform<S, ServiceRequest> for VerifyToken
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = VerifyTokenMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(VerifyTokenMiddleware { service }))
    }
}

pub struct VerifyTokenMiddleware<S> {
    service: S,
}

/// Middleware runs for every request, 
/// for images and js file, bypass middleware check
/// for requests before authenticate, bypass middleware check
/// for everything else, if request doesn't include a valid Authorization header,
/// reject it.
impl<S, B> Service<ServiceRequest> for VerifyTokenMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    dev::forward_ready!(service);

    fn call(&self, request: ServiceRequest) -> Self::Future {
        println!("middleware is verifying token.");
        println!("getting path {}", request.path());

        if !request.path().starts_with("/ks/") ||
            request.path() == "/ks/auth" || 
            request.path() == "/ks/oauth" ||
            request.path() == "/ks/auth_confirm" {
            println!("path that doesn't require token");
            let res = self.service.call(request);
            return Box::pin(async move {
                // forwarded responses map to "left" body
                res.await.map(ServiceResponse::map_into_left_body)
            });
        }
        let endex = request.app_data::<web::Data<AppState>>().unwrap();
        let secret = "ehllo";
        if auth_token::verify_token(request.headers().get("Authorization"), secret) {
            println!("path that requires token and verifying.");
            let res = self.service.call(request);
            return Box::pin(async move {
                // forwarded responses map to "left" body
                res.await.map(ServiceResponse::map_into_left_body)
            });
        }
        println!("path that requires token but not verified.");
        let (request, _pl) = request.into_parts();
        let response = HttpResponse::Unauthorized()
            .finish()
            // constructed responses map to "right" body
            .map_into_right_body();
        Box::pin(async { Ok(ServiceResponse::new(request, response)) })
    }
}


