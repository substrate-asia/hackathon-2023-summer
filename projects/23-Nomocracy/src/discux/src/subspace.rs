use askama::Template;
use axum::{
    extract::{Form, Query, RawQuery, State},
    response::{Html, IntoResponse, Redirect},
};
use gutp_types::{GutpComment, GutpPost, GutpSubspace};

use crate::redirect_to_error_page;
use crate::Client;
use crate::HtmlTemplate;
use crate::{make_get, make_post};

#[derive(Template)]
#[template(path = "subspace_create.html")]
struct SubspaceCreateTemplate {}

struct ViewSubspaceCreateParams {}

pub async fn view_subspace_create(
    State(client): State<Client>,
    Query(params): Query<ViewSubspaceCreateParams>,
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status
    // TODO: who can create a new subspace?
    // For forum case, only admin has the permission to create a new subspace
    // for blog case, every on can create their own blog subspace

    HtmlTemplate(SubspaceCreateTemplate {})
}

struct PostSubspaceCreateParams {}

pub async fn post_subspace_create(
    State(client): State<Client>,
    Form(params): Form<PostSubspaceCreateParams>,
    body: String,
) -> impl IntoResponse {
    // check the user login status

    // TODO: check the existence of subspace by query

    // forward post form body to gutp
    let res_bytes = make_post(client, "/v1/subspace/create", body).await;
    let subspaces: Vec<GutpSubspace> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(sp) = subspaces.into_iter().next() {
        let redirect_uri = format!("/subspace?id={}", sp.id);
        Redirect::to(&redirect_uri)
    } else {
        // redirect to the error page
        let action = format!("Create subspace");
        let err_info = "Unknown";
        redirect_to_error_page(&action, err_info)
    }
}

#[derive(Template)]
#[template(path = "subspace_edit.html")]
struct SubspaceEditTemplate {
    subspace: GutpSubspace,
}

struct ViewSubspaceEditParams {
    id: String,
}

pub async fn view_subspace_edit(
    State(client): State<Client>,
    Query(params): Query<ViewSubspaceEditParams>,
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the tag_id, We can do it in the params type definition
    let sp_id = params.id;

    let res_bytes = make_get(client, "/v1/subspace", query).await;
    let sps: Vec<GutpSubspace> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(sp) = sps.into_iter().next() {
        HtmlTemplate(SubspaceEditTemplate { subspace: sp })
    } else {
        let action = format!("Query subspace: {}", sp_id);
        let err_info = "Subspace doesn't exist!";
        redirect_to_error_page(&action, err_info)
    }
}

struct PostSubspaceEditParams {
    id: String,
}

pub async fn post_subspace_edit(
    State(client): State<Client>,
    Form(params): Form<PostSubspaceEditParams>,
    body: String,
) -> Redirect {
    // check the user login status

    // We must precheck the tag_id, we can do it in the params type definition
    let id = params.id;

    // post to gutp
    let res_bytes = make_post(client, "/v1/subspace/edit", body).await;
    let sps: Vec<GutpSubspace> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if let Some(sp) = sps.into_iter().next() {
        let redirect_uri = format!("/subspace?id={}", id);
        Redirect::to(&redirect_uri)
    } else {
        // redirect to the error page
        let action = format!("Edit subspace: {}", id);
        let err_info = "Unknown";
        redirect_to_error_page(&action, err_info)
    }
}

#[derive(Template)]
#[template(path = "subspace_delete.html")]
struct SubspaceDeleteTemplate {
    id: String,
    title: String,
}

struct ViewSubspaceDeleteParams {
    id: String,
    title: String,
}

pub async fn view_subspace_delete(
    State(client): State<Client>,
    Query(params): Query<ViewSubspaceDeleteParams>,
    RawQuery(query): RawQuery,
) -> impl IntoResponse {
    // check the user login status

    // We must specify the id, We can do it in the params type definition
    let id = params.id;
    let title = params.title;

    let query = format!("id={}", id);
    let res_bytes = make_get(client, "/v1/article/list_by_subspace_id", Some(query)).await;
    let posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if posts.is_empty() {
        // can be deleted
        HtmlTemplate(SubspaceDeleteTemplate { id, title })
    } else {
        // error
        let action = format!("Intend to delete subspace: {}", id);
        let err_info = "This subspace has article attached, could not be deleted!";
        redirect_to_error_page(&action, err_info)
    }
}

struct PostSubspaceDeleteParams {
    id: String,
}

pub async fn post_subspace_delete(
    State(client): State<Client>,
    Form(params): Form<PostSubspaceDeleteParams>,
    body: String,
) -> Redirect {
    // check the user login status

    // check the user's permission to delete a subspace

    // We must precheck the id, we can do it in the params type definition
    let id = params.id;

    let query = format!("subspace_id={}", id);
    let res_bytes = make_get(client, "/v1/article/list_by_subspace_id", Some(query)).await;
    let posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);
    if posts.is_empty() {
        // can be deleted
        let res_bytes = make_post(client, "/v1/subspace/delete", body).await;
        let _sps: Vec<GutpSubspace> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

        // TODO: process the error branch of deleting

        // TODO: redirect to an article list page with a tag
        // redirect to index page
        let redirect_uri = format!("/");
        Redirect::to(&redirect_uri)
    } else {
        // error
        let action = format!("Intend to delete subspace: {}", id);
        let err_info = "This subspace has article attached, could not be deleted!";
        redirect_to_error_page(&action, err_info)
    }
}
