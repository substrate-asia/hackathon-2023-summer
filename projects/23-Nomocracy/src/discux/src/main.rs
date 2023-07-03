#![allow(unused)]
use askama::Template;
use axum::{
    extract::{Query, RawQuery, State},
    http::{response, uri::Uri, Request, Response},
    response::{Html, IntoResponse, Redirect},
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
// use tower_http::services::{ServeDir, ServeFile};

use hyper::{
    client::HttpConnector, Body, Client as RawHyperClient, Method, Request as HyperRequest,
};
pub type HyperClient = hyper::client::Client<HttpConnector, Body>;

mod article;
mod comment;
mod index;
mod tag;
mod user;

#[derive(Clone)]
pub struct AppState {
    hclient: HyperClient,
    rclient: redis::Client,
    redis_conn: redis::aio::Connection,
}

#[tokio::main]
async fn main() {
    let hyper_client = HyperClient::new();
    let redis_client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut redis_conn = redis_client.get_async_connection().await?;

    let app_state = AppState {
        hclient: hyper_client,
        rclient: redis_client,
        redis_conn,
    };

    let app = Router::new()
        .route("/", get(index::index))
        .route("/subspace", get(handler))
        .route("/subspace/create", get(handler).post(handler))
        .route("/subspace/edit", get(handler).post(handler))
        .route("/article", get(article::article))
        .route("/article/list", get(article::latest_articles))
        .route("/article/list_replied", get(handler))
        .route("/article/list_by_tag", get(handler))
        .route("/article/list_replied_by_tag", get(handler))
        .route("/article/create", get(handler).post(handler))
        .route("/article/edit", get(handler).post(handler))
        .route("/article/delete", get(handler).post(handler))
        .route("/comment/create", get(handler).post(handler))
        .route("/comment/edit", get(handler).post(handler))
        .route("/comment/delete", get(handler).post(handler))
        .route("/tag/create", get(handler).post(handler))
        .route("/tag/edit", get(handler).post(handler))
        .route("/tag/delete", get(handler).post(handler))
        // .route("/manage/my_articles", get(handler))
        // .route("/manage/my_tags", get(handler))
        // .route("/manage/pubprofile", get(handler).post(handler))
        .route("/user/account", get(handler))
        .route("/user/signout", get(handler))
        .route("/user/register", post(handler))
        .route("/user/login", post(handler))
        .route("/user/login_with3rd", get(handler))
        .route("/user/login_with_github", get(handler))
        .route("/error/info", get(view_error_info))
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("reverse proxy listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handler(State(client): State<AppState>, mut req: Request<Body>) -> Response<Body> {
    let path = req.uri().path();
    let path_query = req
        .uri()
        .path_and_query()
        .map(|v| v.as_str())
        .unwrap_or(path);

    let uri = format!("http://127.0.0.1:4000{}", path_query);

    *req.uri_mut() = Uri::try_from(uri).unwrap();

    client.request(req).await.unwrap()
}

/// helper function
pub async fn make_get(
    client: Client,
    path: &str,
    query: Option<String>,
) -> anyhow::Result<hyper::body::Bytes> {
    let uri = if let Some(query) = query {
        format!("http://127.0.0.1:4000{}?{}", path, query)
    } else {
        format!("http://127.0.0.1:4000{}", path)
    };

    let req = HyperRequest::builder()
        .method(Method::GET)
        .uri(&uri)
        .expect("request builder");

    let response = client.request(req).await.unwrap();
    let body_bytes = hyper::body::to_bytes(response.into_body()).await?;
    println!("body: {:?}", body_bytes);
    Ok(body_bytes)
}

pub async fn make_post(
    client: Client,
    path: &str,
    body: String,
) -> anyhow::Result<hyper::body::Bytes> {
    let uri = format!("http://127.0.0.1:4000{}", path);

    let req = HyperRequest::builder()
        .method(Method::POST)
        .uri(&uri)
        .body(body)
        .expect("request builder");

    let response = client.request(req).await.unwrap();
    let body_bytes = hyper::body::to_bytes(response.into_body()).await?;
    println!("body: {:?}", body_bytes);
    Ok(body_bytes)
}

/// Define the template handler
pub struct HtmlTemplate<T>(T);

impl<T> IntoResponse for HtmlTemplate<T>
where
    T: Template,
{
    fn into_response(self) -> Response {
        match self.0.render() {
            Ok(html) => Html(html).into_response(),
            Err(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to render template. Error: {}", err),
            )
                .into_response(),
        }
    }
}

#[derive(Template)]
#[template(path = "action_error.html")]
struct ErrorInfoTemplate {
    action: String,
    err_info: String,
}

pub async fn view_error_info(Query(params): Query<ErrorInfoTemplate>) -> impl IntoResponse {
    // render the page
    HtmlTemplate(ErrorInfoTemplate {
        action: params.action,
        err_info: params.err_info,
    })
}

pub fn redirect_to_error_page(action: &str, err_info: &str) -> Redirect {
    let redirect_uri = format!("/error/info?action={}&err_info={}", action, err_info);
    Redirect::to(&redirect_uri)
}
