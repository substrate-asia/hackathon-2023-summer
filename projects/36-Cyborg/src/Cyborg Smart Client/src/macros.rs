//! Macros involving spawning processes and http requests

macro_rules! command {
    ($error:expr) => {
        pub async fn run(
            data: ::serde_json::Value,
        ) -> ::anyhow::Result<::serde_json::Value, ::serde_json::Value> {
            Output::create(data).await.map_err(|e| {
                ::log::error!("{:#}", e);
                let mut error = $error;
                error
                    .as_object_mut()
                    .expect("Failed to get default error message as map")
                    .insert(
                        "error_details".to_string(),
                        ::serde_json::Value::String(format!("{:#}", e)),
                    );
                error
            })
        }
    };
}
pub(crate) use command;

/// macro used in [output] for creating a new command and awaiting its output.
macro_rules! create_command {
    ( $error_name: expr, $command: expr, $args: expr ) => {
        ::tokio::process::Command::new($command)
            .args($args)
            .output()
            .await
            .with_context(|| ::std::format!("Failed to get {} output", $error_name))?
    };
}
pub(crate) use create_command;

/// macro for removing boilerplate for spawning a command, attaching context, and returning the result with whitespace trimmed
macro_rules! output {
    ( $error_name: expr, $command: expr, $args: expr ) => {
        ::std::string::String::from_utf8(
            crate::macros::create_command!($error_name, $command, $args).stdout,
        )
        .with_context(|| ::std::format!("Failed to parse {} output as utf8", $error_name))?
        .trim()
        .to_string()
    };
}
pub(crate) use output;

// /// macro for removing boilerplate for spawning a command and returning its status
// macro_rules! status {
//     ( $error_name: expr, $command: expr, $args: expr ) => {
//         crate::macros::create_command!($error_name, $command, $args).status
//     };
// }
// pub(crate) use status;

/// macro for creating a http [get](::reqwest::get) request. returns on error, with the error_name provided
macro_rules! make_request {
    ( $error_name: expr, $url: expr ) => {
        ::reqwest::get({
            let url: &str = $url.as_ref();
            url
        })
        .await
        .with_context(|| format!("Failed to get {} from {}", $error_name, $url))?
    };
}
pub(crate) use make_request;
