use askama::Template;
use axum::{
    extract::{Form, Query, RawQuery, State},
    response::{Html, IntoResponse, Redirect},
};
use gutp_types::{GutpComment, GutpPost};

use crate::Client;
use crate::HtmlTemplate;
use crate::{make_get, make_post};

#[derive(Template)]
#[template(path = "comment_create.html")]
struct CommentCreateTemplate {
    post: GutpPost,
}

struct ViewCommentCreateParams {
    post_id: String,
}

pub async fn view_comment_create(
    State(client): State<Client>,
    Query(params): Query<ViewCommentCreateParams>,
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the subspace_id
    let post_id = params.post_id;

    // get the post object from the gutp service, to check the exsistence of that post
    let query = format!("id={}", post_id);
    let res_bytes = make_get(client, "/v1/post", Some(query)).await;
    let posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(post) = posts.into_iter().next() {
        // render the page
        HtmlTemplate(CommentCreateTemplate { post })
    } else {
        let action = format!("Query Article: {}", post_id);
        let err_info = "Article doesn't exist, comment couldn't be added to it!";
        let redirect_uri = format!("/error/info?action={}&err_info={}", action, err_info);
        Redirect::to(&redirect_uri)
    }
}

struct PostCommentCreateParams {
    post_id: String,
}

pub async fn post_comment_create(
    State(client): State<Client>,
    Form(params): Form<PostCommentCreateParams>,
    body: String,
) -> impl IntoResponse {
    // check the user login status

    // TODO: parse form params
    let post_id = params.post_id;

    // TODO: check the existence of article by query

    // forward post form body to gutp
    let res_bytes = make_post(client, "/v1/comment/create", body).await;
    let comments: Vec<GutpComment> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(comment) = comments.into_iter().next() {
        // redirect to the article page
        let redirect_uri = format!("/article?id={}", comment.post_id);
        Redirect::to(&redirect_uri)
    } else {
        // redirect to the error page
        let action = format!("Create comment for article: {}", post_id);
        let err_info = "Unknown";
        let redirect_uri = format!("/error/info?action={}&err_info={}", action, err_info);
        Redirect::to(&redirect_uri)
    }
}

#[derive(Template)]
#[template(path = "comment_delete.html")]
struct CommentDeleteTemplate {
    comment: GutpComment,
}

struct ViewCommentDeleteParams {
    id: String,
}

pub async fn view_comment_delete(
    State(client): State<Client>,
    Query(params): Query<ViewCommentDeleteParams>,
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the tag_id, We can do it in the params type definition
    let id = params.id;

    // get the old tag by request to gutp
    let res_bytes = make_get(client, "/v1/comment", query).await;
    let comments: Vec<GutpComment> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(comment) = comments.into_iter().next() {
        HtmlTemplate(CommentDeleteTemplate { comment })
    } else {
        // redirect to the error page
        let action = format!("Query comment: {}", id);
        let err_info = "This comment doesn't exist!";
        let redirect_uri = format!("/error/info?action={}&err_info={}", action, err_info);
        Redirect::to(&redirect_uri)
    }
}

struct PostCommentDeleteParams {
    id: String,
    post_id: String,
}

pub async fn post_comment_delete(
    State(client): State<Client>,
    Form(params): Form<PostCommentDeleteParams>,
    body: String,
) -> Redirect {
    // check the user login status

    // We must precheck the tag_id, we can do it in the params type definition
    let comment_id = params.id;
    let post_id = params.post_id;

    // check whether some articles attaching to this tag
    let res_bytes = make_post(client, "/v1/comment/delete", body).await;
    let _comments: Vec<GutpComment> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

    // TODO: process the error branch of deleting

    let redirect_uri = format!("/article?id={}", post_id);
    Redirect::to(&redirect_uri)
}
