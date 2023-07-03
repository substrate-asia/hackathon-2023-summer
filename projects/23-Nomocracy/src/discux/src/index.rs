#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    tags: Vec<GutpTag>,
    posts: Vec<GutpPost>,
    replied_posts: Vec<GutpPost>,
    extobjs: Vec<GutpExtobj>,
}

pub async fn index(State(client): State<Client>, RawQuery(query): RawQuery) -> impl IntoResponse {
    // check the user login status

    // get subspace tags
    let res_bytes = make_get(client, "/v1/tag/list_by_subspace", query).await;
    let tags: Vec<GutpTag> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

    // get the latest articles
    let res_bytes = make_get(client, "/v1/post/list_by_subspace", query).await;
    let posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

    // get the latest replied articles
    let res_bytes = make_get(client, "/v1/post/list_by_subspace_by_latest_replied", query).await;
    let replied_posts: Vec<GutpPost> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

    // get other extensive links (items)
    let res_bytes = make_get(client, "/v1/extobj/list_by_subspace", query).await;
    let extobjs: Vec<GutpExtobj> = serde_json::from_slice(res_bytes).unwrap_or(vec![]);

    // render the page

    let template = IndexTemplate {
        tags,
        posts,
        replied_posts,
        extobjs,
    };
    HtmlTemplate(template)
}
