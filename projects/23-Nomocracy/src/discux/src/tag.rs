use askama::Template;
use axum::{
    extract::{RawQuery, State, Form, Query,},
    response::{Html, IntoResponse},
};

use crate::HtmlTemplate;

#[derive(Template)]
#[template(path = "tag_create.html")]
struct TagCreateTemplate {
    subspace_id: String,
}

struct ViewTagCreateParams {
    subspace_id: String,
}

pub async fn view_tag_create(
    State(client): State<Client>,
    Query(params): Query<ViewTagCreateParams>
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the subspace_id
    let subspace_id = params.subspace_id;

    // render the page
    HtmlTemplate(TagCreateTemplate {
        subspace_id,
    })
}

struct PostTagCreateParams {
    subspace_id: String,
}

pub async fn post_tag_create(
    State(client): State<Client>,
    Form(params): Form<PostTagCreateParams>,
    body: String,
) -> impl IntoResponse {
    // check the user login status

    // TODO: parse form params

    // forward post form body to gutp
    let res_bytes = make_post(client, "/v1/tag/create", body).await;
    let tags: Vec<GutpTag> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    let tag = tags[0].clone();

    // redirect to the article list by tag page
    let redirect_uri = format!("/article/list_by_tag?tag_id={}", tag.id);
    Redirect::to(&redirect_uri)
}

#[derive(Template)]
#[template(path = "tag_edit.html")]
struct TagEditTemplate {
    tag: GutpTag,
}

struct ViewTagEditParams {
    id: String,
}

pub async fn view_tag_edit(
    State(client): State<Client>,
    Query(params): Query<ViewTagEditParams>
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the tag_id, We can do it in the params type definition
    // let tag_id = params.id;

    // get the old tag by request to gutp
    let res_bytes = make_get(client, "/v1/tag", query).await;
    let tags: Vec<GutpTag> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    let tag = tags[0].clone();

    // render the page
    HtmlTemplate(TagEditTemplate {
        tag: tag,
    })
}

struct PostTagEditParams {
    id: String,
}

pub async fn post_tag_edit(
    State(client): State<Client>,
    Form(params): Form<PostTagEditParams>
    body: String,
) -> Redirect {
    // check the user login status

    // We must precheck the tag_id, we can do it in the params type definition
    // let tag_id = params.id;

    // post to gutp
    let res_bytes = make_post(client, "/v1/tag/edit", body).await;
    let tags: Vec<GutpTag> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    let tag = tags[0].clone();

    // redirect to the article list by tag page
    let redirect_uri = format!("/article/list_by_tag?tag_id={}", tag.id);
    Redirect::to(&redirect_uri)
}

#[derive(Template)]
#[template(path = "tag_delete.html")]
struct TagDeleteTemplate {
    tag: GutpTag,
}


struct ViewTagDeleteParams {
    id: String,
}

pub async fn view_tag_delete(
    State(client): State<Client>,
    Query(params): Query<ViewTagDeleteParams>
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the tag_id, We can do it in the params type definition
    // let tag_id = params.tag_id;

    // get the old tag by request to gutp
    let res_bytes = make_get(client, "/v1/tag", query).await;
    let tags: Vec<GutpTag> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    let tag = tags[0].clone();

    // render the page
    HtmlTemplate(TagDeleteTemplate {
        tag: tag,
    })
}

struct PostTagDeleteParams {
    id: String,
}

pub async fn post_tag_delete(
    State(client): State<Client>,
    Form(params): Form<PostTagDeleteParams>
    body: String,
) -> Redirect {
    // check the user login status

    // We must precheck the tag_id, we can do it in the params type definition
    let tag_id = params.id;

    // check whether some articles attaching to this tag
    let res_bytes = make_get(client, "/v1/post/list_by_tag", body).await;
    let posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if !posts.is_empty() {
        // if this tag has attached articles, couldn't be deleted
        // redirect to the error info page
        let action = format!("Delete Tag: {}", tag_id);
        let err_info = "This tag is holding attached articles, couldn't be deleted!";
        let redirect_uri = format!("/error/info?action={}&err_info={}", action, err_info);
        Redirect::to(&redirect_uri)
    } else {
        // post to gutp
        let res_bytes = make_post(client, "/v1/tag/delete", body).await;
        let _posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

        // redirect to the article list by tag page
        Redirect::to("/")
    }
}

