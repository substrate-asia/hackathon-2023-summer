//! Run with
//!
//! ```not_rust
//! cargo run -p example-stream-to-file
//! ```

use axum::{
    body::Bytes,
    extract::{Multipart, Path, Request},
    http::StatusCode,
    response::{Html, Redirect},
    routing::{get, post},
    BoxError, Router,
};
use futures::{Stream, TryStreamExt};
use std::io;
use tokio::{fs::File, io::BufWriter};
use tokio_util::io::StreamReader;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use deoss::deoss::DeOssClient;
mod constants;
use constants::{ACCESS_TOKEN, ACCOUNT};
const UPLOADS_DIRECTORY: &str = "uploads";
const DEOSS_BUCKET: &str = "blog-images";
#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "deoss-app=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // save files to a separate directory to not override files in the current directory
    tokio::fs::create_dir(UPLOADS_DIRECTORY)
        .await;
        //.expect("failed to create `uploads` directory");

    let app = Router::new()
        .route("/", get(show_form).post(accept_form))
        .route("/file/:file_name", post(save_request_body))
        .route("/images/:fid", get(get_image));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

// Handler that streams the request body to a file.
//
// POST'ing to `/file/foo.txt` will create a file called `foo.txt`.
async fn save_request_body(
    Path(file_name): Path<String>,
    request: Request,
) -> Result<(), (StatusCode, String)> {
    stream_to_file(&file_name, request.into_body()).await
}

async fn get_image(Path(fid): Path<String>, request: Request) -> Result<Bytes, (StatusCode, String)> {
    tracing::info!("get_image on {}", fid);
    println!("get_image on {}", fid);
    let deoss = DeOssClient::new(DEOSS_BUCKET.to_string(), ACCESS_TOKEN.to_string(), ACCOUNT.to_string());
    //let path = std::path::Path::new(UPLOADS_DIRECTORY).join(fid);
    //let path_str = path.to_str().unwrap();
    let image_content = deoss.get(fid.to_owned()).await;
    Ok(image_content.unwrap())
}
// Handler that returns HTML for a multipart form.
async fn show_form() -> Html<&'static str> {
    Html(
        r#"
        <!doctype html>
        <html>
            <head>
                <title>Upload something!</title>
            </head>
            <body>
                <form action="/" method="post" enctype="multipart/form-data">
                    <div>
                        <label>
                            Upload file:
                            <input type="file" name="file" multiple>
                        </label>
                    </div>

                    <div>
                        <input type="submit" value="Upload files">
                    </div>
                    <img src="/images/5952cbefa9cfddbcb6beeda3b4f469099bb2e2d4f87b3bbf5dc947dd2f87b66f">
                </form>
            </body>
        </html>
        "#,
    )
}

// Handler that accepts a multipart form upload and streams each field to a file.
async fn accept_form(mut multipart: Multipart) -> Result<Redirect, (StatusCode, String)> {
    let mut full_file_name: String = "".to_string();
    while let Ok(Some(field)) = multipart.next_field().await {
        let file_name = if let Some(file_name) = field.file_name() {
            file_name.to_owned()
        } else {
            continue;
        };
        full_file_name = file_name.to_string();
        stream_to_file(&file_name, field).await?;
    }
    // upload to cess deoss
    let deoss = DeOssClient::new(DEOSS_BUCKET.to_string(), ACCESS_TOKEN.to_string(), ACCOUNT.to_string());
    let path = std::path::Path::new(UPLOADS_DIRECTORY).join(full_file_name.clone());
    let path_str = path.to_str().unwrap();
    deoss.put(path_str.to_string(), full_file_name.clone().to_string()).await;
    Ok(Redirect::to("/"))
}

// Save a `Stream` to a file
async fn stream_to_file<S, E>(path: &str, stream: S) -> Result<(), (StatusCode, String)>
where
    S: Stream<Item = Result<Bytes, E>>,
    E: Into<BoxError>,
{
    if !path_is_valid(path) {
        return Err((StatusCode::BAD_REQUEST, "Invalid path".to_owned()));
    }

    async {
        // Convert the stream into an `AsyncRead`.
        let body_with_io_error = stream.map_err(|err| io::Error::new(io::ErrorKind::Other, err));
        let body_reader = StreamReader::new(body_with_io_error);
        futures::pin_mut!(body_reader);

        // Create the file. `File` implements `AsyncWrite`.
        let path = std::path::Path::new(UPLOADS_DIRECTORY).join(path);
        let mut file = BufWriter::new(File::create(path).await?);

        // Copy the body into the file.
        tokio::io::copy(&mut body_reader, &mut file).await?;

        Ok::<_, io::Error>(())
    }
    .await
    .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))
}

// to prevent directory traversal attacks we ensure the path consists of exactly one normal
// component
fn path_is_valid(path: &str) -> bool {
    let path = std::path::Path::new(path);
    let mut components = path.components().peekable();

    if let Some(first) = components.peek() {
        if !matches!(first, std::path::Component::Normal(_)) {
            return false;
        }
    }

    components.count() == 1
}
