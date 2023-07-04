#![allow(dead_code)]
use anyhow::Result;
use bytes::Bytes;
use spin_sdk::redis_component;

use eightfish::{App as EightFishApp, GlobalFilter, Request, Response, Result as EightFishResult};

mod comment;
mod constants;
mod moderator;
mod post;
mod postdiff;
mod posttag;
mod subspace;
mod tag;
mod user;
mod utils;

struct MyGlobalFilter;

impl GlobalFilter for MyGlobalFilter {
    fn before(&self, _req: &mut Request) -> EightFishResult<()> {
        Ok(())
    }

    fn after(&self, _req: &Request, _res: &mut Response) -> EightFishResult<()> {
        Ok(())
    }
}

pub fn build_app() -> EightFishApp {
    let mut sapp = EightFishApp::new();
    sapp.add_global_filter(Box::new(MyGlobalFilter))
        .add_module(Box::new(user::GutpUserModule))
        .add_module(Box::new(comment::GutpCommentModule))
        .add_module(Box::new(moderator::GutpModeratorModule))
        .add_module(Box::new(post::GutpPostModule))
        .add_module(Box::new(postdiff::GutpPostDiffModule))
        .add_module(Box::new(posttag::GutpPostTagModule))
        .add_module(Box::new(subspace::GutpSubspaceModule))
        .add_module(Box::new(tag::GutpTagModule));

    sapp
}

/// Main entry
#[redis_component]
fn on_message(message: Bytes) -> Result<()> {
    // later put this construtor to outer OnceCell
    let app = build_app();
    let aw = spin_worker::Worker::mount(app);

    aw.work(message).unwrap();

    Ok(())
}
