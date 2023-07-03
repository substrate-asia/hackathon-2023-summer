use std::any;

use crate::constants::DB_URL_ENV;
use crate::utils;
use anyhow::{anyhow, bail};
use eightfish::{
    EightFishModel, HandlerCRUD, Info, Module, Request, Response, Result, Router, Status,
};
use eightfish_derive::EightFishModel;
use serde::{Deserialize, Serialize};
use spin_sdk::pg::{self, ParameterValue};
use sql_builder::SqlBuilder;

const PAGESIZE: u64 = 25;

use gutp_types::GutpComment;

enum GutpCommentStatus {
    Normal = 0,
    Frozen = 1,
    Forbidden = 2,
    Deleted = 3,
}

enum GutpCommentWeight {
    Normal = 0,
}

pub struct GutpCommentModule;

impl GutpCommentModule {
    fn get_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;
        let comment_id = params.get("id").ok_or(anyhow!("id required."))?;
        //let comment_id = utils::get_required_param(&params, "id")?;
        let (sql_statement, sql_params) = GutpComment::build_get_by_id(comment_id);
        let rowset = pg::query(&pg_addr, &sql_statement, &sql_params)?;

        let results = if let Some(row) = rowset.rows.into_iter().next() {
            vec![GutpComment::from_row(row)]
        } else {
            return bail!("no this item".to_string());
        };

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::GetOne,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn get_list(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpComment::model_name())
            .fields(&GutpComment::fields())
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let rowset = pg::query(&pg_addr, &sql, &[])?;

        let mut results: Vec<GutpComment> = vec![];
        for row in rowset.rows {
            let sp = GutpComment::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_post(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let post_id = params
            .get("post_id")
            .ok_or(anyhow!("post_id is required."))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpComment::model_name())
            .fields(&GutpComment::fields())
            .and_where_eq("post_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(post_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpComment> = vec![];
        for row in rowset.rows {
            let sp = GutpComment::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_author(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let author_id = params
            .get("author_id")
            .ok_or(anyhow!("author_id is required."))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpComment::model_name())
            .fields(&GutpComment::fields())
            .and_where_eq("author_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(author_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpComment> = vec![];
        for row in rowset.rows {
            let sp = GutpComment::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn new_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let content = params
            .get("content")
            .ok_or(anyhow!("content is required."))?
            .to_owned();
        let author_id = params
            .get("author_id")
            .ok_or(anyhow!("author_id is required."))?
            .to_owned();
        let post_id = params
            .get("post_id")
            .ok_or(anyhow!("post_id required."))?
            .to_owned();
        let parent_comment_id = params
            .get("parent_comment_id")
            .ok_or(anyhow!("parent_comment_id is required."))?
            .to_owned();
        let is_public = params
            .get("is_public")
            .ok_or(anyhow!("is_public is required."))?
            .parse::<bool>()?;

        let id = req
            .ext()
            .get("random_str")
            .ok_or(anyhow!("generate id failed"))?
            .to_owned();
        let time = req
            .ext()
            .get("time")
            .ok_or(anyhow!("generate time failed"))?
            .parse::<i64>()?;

        let comment = GutpComment {
            id,
            content,
            author_id,
            post_id,
            parent_comment_id,
            is_public,
            status: GutpCommentStatus::Normal as i16,
            weight: GutpCommentWeight::Normal as i32,
            created_time: time,
        };

        // construct a sql statement and param
        let (sql, sql_params) = comment.build_insert();
        _ = pg::execute(&pg_addr, &sql, &sql_params)?;

        let results: Vec<GutpComment> = vec![comment];

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::Create,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn update(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required."))?;
        let content = params
            .get("content")
            .ok_or(anyhow!("content is required."))?
            .to_owned();
        let author_id = params
            .get("author_id")
            .ok_or(anyhow!("author_id is required."))?
            .to_owned();
        let post_id = params
            .get("post_id")
            .ok_or(anyhow!("post_id is required."))?
            .to_owned();
        let parent_comment_id = params
            .get("parent_comment_id")
            .ok_or(anyhow!("parent_comment_id is required."))?
            .to_owned();
        let is_public = params
            .get("is_public")
            .ok_or(anyhow!("is_public is required."))?
            .parse::<bool>()?;

        // get the item from db, check whether obj in db
        let (sql, sql_params) = GutpComment::build_get_by_id(id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;
        match rowset.rows.into_iter().next() {
            Some(row) => {
                let old_comment = GutpComment::from_row(row);

                let comment = GutpComment {
                    content,
                    author_id,
                    post_id,
                    parent_comment_id,
                    is_public,
                    ..old_comment
                };

                let (sql, sql_params) = comment.build_update();
                _ = pg::execute(&pg_addr, &sql, &sql_params)?;

                let results: Vec<GutpComment> = vec![comment];

                let info = Info {
                    model_name: GutpComment::model_name(),
                    action: HandlerCRUD::Update,
                    extra: "".to_string(),
                };

                Ok(Response::new(Status::Successful, info, results))
            }
            None => {
                bail!("update action: no item in db");
            }
        }
    }

    fn delete(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required."))?;

        let (sql, sql_params) = GutpComment::build_delete(id);
        let _er = pg::execute(&pg_addr, &sql, &sql_params)?;

        let info = Info {
            model_name: GutpComment::model_name(),
            action: HandlerCRUD::Delete,
            extra: "".to_string(),
        };
        let results: Vec<GutpComment> = vec![];

        Ok(Response::new(Status::Successful, info, results))
    }
}

impl Module for GutpCommentModule {
    fn router(&self, router: &mut Router) -> Result<()> {
        router.get("/v1/comment", Self::get_one);
        router.get("/v1/comment/list", Self::get_list);
        router.get("/v1/comment/list_by_post", Self::list_by_post);
        router.get("/v1/comment/list_by_author", Self::list_by_author);
        router.post("/v1/comment/create", Self::new_one);
        router.post("/v1/comment/update", Self::update);
        router.post("/v1/comment/delete", Self::delete);

        Ok(())
    }
}
