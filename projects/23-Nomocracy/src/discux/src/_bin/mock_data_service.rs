#![allow(unused)]

use axum::{
    extract::{Json, State},
    http::{uri::Uri, Request, Response},
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
// use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/v1/user", get(user_by_id))
        .route("/v1/user_by_account", get(user_by_account))
        .route("/v1/user/list", get(user_list))
        .route("/v1/user/create", post(user_create))
        .route("/v1/user/update", post(user_update))
        .route("/v1/user/delete", post(user_delete))
        .route("/v1/subspace", get(subspace_by_id))
        .route("/v1/subspace/list", get(subspace_list))
        .route("/v1/subspace/list_by_owner", get(subspace_list_by_owner))
        .route(
            "/v1/subspace/list_by_profession",
            get(subspace_list_by_profession),
        )
        .route("/v1/subspace/list_by_appid", get(subspace_list_by_appid))
        .route("/v1/subspace/create", post(subspace_create))
        .route("/v1/subspace/update", post(subspace_update))
        .route("/v1/subspace/delete", post(subspace_delete))
        .route("/v1/post", get(post_by_id))
        .route("/v1/post/list", get(post_list))
        .route("/v1/post/list_by_subspace", get(post_list_by_subspace))
        .route("/v1/post/list_by_author", get(post_list_by_author))
        .route("/v1/post/list_by_profession", get(post_list_by_profession))
        .route("/v1/post/list_by_appid", get(post_list_by_appid))
        .route("/v1/post/create", post(post_create))
        .route("/v1/post/update", post(post_update))
        .route("/v1/post/delete", post(post_delete))
        .route("/v1/comment", get(comment_by_id))
        .route("/v1/comment/list", get(comment_list))
        .route("/v1/comment/list_by_post", get(comment_list_by_post))
        .route("/v1/comment/list_by_author", get(comment_list_by_author))
        .route("/v1/comment/create", post(comment_create))
        .route("/v1/comment/update", post(comment_update))
        .route("/v1/comment/delete", post(comment_delete))
        .route("/v1/tag", get(tag_by_id))
        .route("/v1/tag/list", get(tag_list))
        .route("/v1/tag/list_by_subspace", get(tag_list_by_subspace))
        .route("/v1/tag/list_by_creator", get(tag_list_by_creator))
        .route("/v1/tag/list_by_post", get(tag_list_by_post))
        .route("/v1/tag/create", post(tag_create))
        .route("/v1/tag/update", post(tag_update))
        .route("/v1/tag/delete", post(tag_delete))
        .route("/v1/posttag", get(posttag_by_id))
        .route("/v1/posttag/list", get(posttag_list))
        .route("/v1/posttag/list_by_post", get(posttag_list_by_post))
        .route("/v1/posttag/list_by_tag", get(posttag_list_by_tag))
        .route("/v1/posttag/create", post(posttag_create))
        .route("/v1/posttag/update", post(posttag_update))
        .route("/v1/posttag/delete", post(posttag_delete))
        .route("/v1/postdiff", get(postdiff_by_id))
        .route("/v1/postdiff/list", get(postdiff_list))
        .route("/v1/postdiff/list_by_post", get(postdiff_list_by_post))
        .route("/v1/postdiff/create", post(postdiff_create))
        .route("/v1/postdiff/update", post(postdiff_update))
        .route("/v1/postdiff/delete", post(postdiff_delete))
        .route("/v1/moderator", get(moderator_by_id))
        .route("/v1/moderator/list", get(moderator_list))
        .route(
            "/v1/moderator/list_by_subspace",
            get(moderator_list_by_subspace),
        )
        .route("/v1/moderator/list_by_user", get(moderator_list_by_user))
        .route("/v1/moderator/list_by_tag", get(moderator_list_by_tag))
        .route("/v1/moderator/create", post(moderator_create))
        .route("/v1/moderator/update", post(moderator_update))
        .route("/v1/moderator/delete", post(moderator_delete));

    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    println!("mock server listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

/// user
async fn user_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn user_by_account() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn user_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn user_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn user_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn user_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_list_by_owner() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_list_by_profession() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_list_by_appid() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn subspace_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_list_by_subspace() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_list_by_author() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_list_by_profession() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_list_by_appid() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn post_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_list_by_post() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_list_by_author() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn comment_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_list_by_subspace() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_list_by_creator() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn tag_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_list_by_post() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_list_by_tag() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn posttag_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

/// postdiff
async fn postdiff_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn postdiff_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn postdiff_list_by_post() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn postdiff_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn postdiff_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn postdiff_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

/// moderator
async fn moderator_by_id() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_list() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_list_by_subspace() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_list_by_tag() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_list_by_user() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_create() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_update() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}

async fn moderator_delete() -> Json<String> {
    Json(String::from("{'a': 'hello'}"))
}
