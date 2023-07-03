use crate::utils;
use anyhow::{anyhow, bail};
use eightfish::{
    EightFishModel, HandlerCRUD, Info, Module, Request, Response, Result, Router, Status,
};
use eightfish_derive::EightFishModel;
use serde::{Deserialize, Serialize};
use spin_sdk::pg::{self, ParameterValue};
use sql_builder::SqlBuilder;
const REDIS_URL_ENV: &str = "REDIS_URL";
const DB_URL_ENV: &str = "DB_URL";
const PAGESIZE: u64 = 25;

use gutp_types::GutpPost;

enum GutpPostStatus {
    Normal = 0,
    Frozen = 1,
    Forbidden = 2,
    Deleted = 3,
}

enum GutpPostWeight {
    Normal = 0,
    Low = -1,
    VeryLow = -2,
    SuperLow = -3,
    High = 1,
    VeryHigh = 2,
    SuperHigh = 3,
}

pub struct GutpPostModule;

impl GutpPostModule {
    fn get_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;
        let post_id = params.get("id").ok_or(anyhow!("id is required"))?;

        let (sql, sql_params) = GutpPost::build_get_by_id(post_id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;

        let results = if let Some(row) = rowset.rows.into_iter().next() {
            vec![GutpPost::from_row(row)]
        } else {
            return bail!("no this item".to_string());
        };

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::GetOne,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn get_list(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpPost::model_name())
            .fields(&GutpPost::fields())
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let rowset = pg::query(&pg_addr, &sql, &[])?;

        let mut results: Vec<GutpPost> = vec![];
        for row in rowset.rows {
            let sp = GutpPost::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_subspace(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let subspace_id = params
            .get("subspace_id")
            .ok_or(anyhow!("subspace_id is required"))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpPost::model_name())
            .fields(&GutpPost::fields())
            .and_where_eq("subspace_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(subspace_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPost> = vec![];
        for row in rowset.rows {
            let sp = GutpPost::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPost::model_name(),
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
            .ok_or(anyhow!("author_id is required"))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpPost::model_name())
            .fields(&GutpPost::fields())
            .and_where_eq("author_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(author_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPost> = vec![];
        for row in rowset.rows {
            let sp = GutpPost::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_profession(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let profession = params
            .get("profession")
            .ok_or(anyhow!("profession is required"))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpPost::model_name())
            .fields(&GutpPost::fields())
            .and_where_eq("profession", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(profession);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPost> = vec![];
        for row in rowset.rows {
            let sp = GutpPost::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_appid(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let appid = params.get("appid").ok_or(anyhow!("appid is required"))?;
        let (limit, offset) = utils::build_page_info(&params)?;

        let sql = SqlBuilder::select_from(&GutpPost::model_name())
            .fields(&GutpPost::fields())
            .and_where_eq("appid", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(appid);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPost> = vec![];
        for row in rowset.rows {
            let sp = GutpPost::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn new_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let title = params
            .get("title")
            .ok_or(anyhow!("title is required"))?
            .to_owned();
        let content = params
            .get("content")
            .ok_or(anyhow!("content is required"))?
            .to_owned();
        let author_id = params
            .get("author_id")
            .ok_or(anyhow!("author_id is required"))?
            .to_owned();
        let subspace_id = params
            .get("subspace_id")
            .ok_or(anyhow!("subspace_id is required"))?
            .to_owned();
        let extlink = params
            .get("extlink")
            .ok_or(anyhow!("extlink is required"))?
            .to_owned();
        let profession = params
            .get("profession")
            .ok_or(anyhow!("profession is required"))?
            .to_owned();
        let appid = params
            .get("appid")
            .ok_or(anyhow!("appid is required"))?
            .to_owned();
        let is_public = params
            .get("is_public")
            .ok_or(anyhow!("is_public is required"))?
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

        let post = GutpPost {
            id,
            title,
            content,
            author_id,
            subspace_id,
            extlink,
            profession,
            appid,
            is_public,
            status: GutpPostStatus::Normal as i16,
            weight: GutpPostWeight::Normal as i16,
            created_time: time,
            updated_time: time,
        };

        let (sql_statement, sql_params) = post.build_insert();
        _ = pg::execute(&pg_addr, &sql_statement, &sql_params)?;

        let results: Vec<GutpPost> = vec![post];

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::Create,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn update(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required"))?;
        let title = params
            .get("title")
            .ok_or(anyhow!("title is required"))?
            .to_owned();
        let content = params
            .get("content")
            .ok_or(anyhow!("contnet is required"))?
            .to_owned();
        let author_id = params
            .get("author_id")
            .ok_or(anyhow!("author_id is required"))?
            .to_owned();
        let subspace_id = params
            .get("subspace_id")
            .ok_or(anyhow!("subspace_id is required"))?
            .to_owned();
        let extlink = params
            .get("extlink")
            .ok_or(anyhow!("extlink is required"))?
            .to_owned();
        let profession = params
            .get("profession")
            .ok_or(anyhow!("profession is required"))?
            .to_owned();
        let appid = params
            .get("appid")
            .ok_or(anyhow!("appid is required"))?
            .to_owned();
        let is_public = params
            .get("is_public")
            .ok_or(anyhow!("is_public is required"))?
            .parse::<bool>()?;

        // get the item from db, check whether obj in db
        let (sql, sql_params) = GutpPost::build_get_by_id(id.as_str());
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;
        match rowset.rows.into_iter().next() {
            Some(row) => {
                let old_post = GutpPost::from_row(row);

                let post = GutpPost {
                    title,
                    content,
                    author_id,
                    subspace_id,
                    extlink,
                    profession,
                    appid,
                    is_public,
                    ..old_post
                };

                let (sql, sql_params) = post.build_update();
                _ = pg::execute(&pg_addr, &sql, &sql_params)?;

                let results: Vec<GutpPost> = vec![post];

                let info = Info {
                    model_name: GutpPost::model_name(),
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

        let id = params.get("id").ok_or(anyhow!("id is required"))?;

        let (sql, sql_params) = GutpPost::build_delete(id.as_str());
        _ = pg::execute(&pg_addr, &sql, &sql_params)?;

        let info = Info {
            model_name: GutpPost::model_name(),
            action: HandlerCRUD::Delete,
            extra: "".to_string(),
        };
        let results: Vec<GutpPost> = vec![];

        Ok(Response::new(Status::Successful, info, results))
    }
}

impl Module for GutpPostModule {
    fn router(&self, router: &mut Router) -> Result<()> {
        router.get("/v1/post", Self::get_one);
        router.get("/v1/post/list", Self::get_list);
        router.get("/v1/post/list_by_subspace", Self::list_by_subspace);
        router.get("/v1/post/list_by_author", Self::list_by_author);
        router.get("/v1/post/list_by_profession", Self::list_by_profession);
        router.get("/v1/post/list_by_appid", Self::list_by_appid);
        router.post("/v1/post/create", Self::new_one);
        router.post("/v1/post/update", Self::update);
        router.post("/v1/post/delete", Self::delete);

        Ok(())
    }
}
