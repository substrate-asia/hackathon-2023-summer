use std::any;

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

use crate::utils;
use gutp_types::GutpPostTag;
pub struct GutpPostTagModule;

impl GutpPostTagModule {
    fn get_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;
        let posttag_id = params.get("id").ok_or(anyhow!("posttag_id is required"))?;

        let (sql, sql_params) = GutpPostTag::build_get_by_id(posttag_id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;

        let results = if let Some(row) = rowset.rows.into_iter().next() {
            vec![GutpPostTag::from_row(row)]
        } else {
            bail!("no this item".to_string())
        };

        let info = Info {
            model_name: GutpPostTag::model_name(),
            action: HandlerCRUD::GetOne,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn get_list(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;
        let (limit, offset) = utils::build_page_info(&params)?;
        let sql = SqlBuilder::select_from(&GutpPostTag::model_name())
            .fields(&GutpPostTag::fields())
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let rowset = pg::query(&pg_addr, &sql, &[])?;

        let mut results: Vec<GutpPostTag> = vec![];
        for row in rowset.rows {
            let sp = GutpPostTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPostTag::model_name(),
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
            .ok_or(anyhow!("post_id is required"))?;

        let (limit, offset) = utils::build_page_info(&params)?;
        let sql = SqlBuilder::select_from(&GutpPostTag::model_name())
            .fields(&GutpPostTag::fields())
            .and_where_eq("post_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(post_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPostTag> = vec![];
        for row in rowset.rows {
            let sp = GutpPostTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPostTag::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_tag(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let tag_id = params.get("tag_id").ok_or(anyhow!("tag_id is required"))?;
        let (limit, offset) = utils::build_page_info(&params)?;
        let sql = SqlBuilder::select_from(&GutpPostTag::model_name())
            .fields(&GutpPostTag::fields())
            .and_where_eq("tag_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(tag_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpPostTag> = vec![];
        for row in rowset.rows {
            let sp = GutpPostTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpPostTag::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn new_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let post_id = params
            .get("post_id")
            .ok_or(anyhow!("post_id is required"))?
            .to_owned();
        let tag_id = params
            .get("tag_id")
            .ok_or(anyhow!("tag_id is required"))?
            .to_owned();

        let id = req
            .ext()
            .get("random_str")
            .ok_or(anyhow!("failed get id"))?
            .to_owned();
        let time = req
            .ext()
            .get("time")
            .ok_or(anyhow!("failed get time"))?
            .parse::<i64>()?;

        let posttag = GutpPostTag {
            id,
            post_id,
            tag_id,
            created_time: time,
        };

        // construct a sql statement and param
        let (sql, sql_params) = posttag.build_insert();
        _ = pg::execute(&pg_addr, &sql, &sql_params)?;

        let results: Vec<GutpPostTag> = vec![posttag];

        let info = Info {
            model_name: GutpPostTag::model_name(),
            action: HandlerCRUD::Create,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn update(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required"))?;
        let post_id = params
            .get("post_id")
            .ok_or(anyhow!("post_id is required"))?
            .to_owned();
        let tag_id = params
            .get("tag_id")
            .ok_or(anyhow!("tag_id is required"))?
            .to_owned();

        // get the item from db, check whether obj in db
        let (sql, sql_params) = GutpPostTag::build_get_by_id(id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;
        match rowset.rows.into_iter().next() {
            Some(row) => {
                let old_posttag = GutpPostTag::from_row(row);

                let posttag = GutpPostTag {
                    post_id,
                    tag_id,
                    ..old_posttag
                };

                let (sql, sql_params) = posttag.build_update();
                _ = pg::execute(&pg_addr, &sql, &sql_params)?;

                let results: Vec<GutpPostTag> = vec![posttag];

                let info = Info {
                    model_name: GutpPostTag::model_name(),
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

        let id = params.get("id").ok_or(anyhow!("delete action: no id"))?;

        let (sql, sql_params) = GutpPostTag::build_delete(id.as_str());
        let _er = pg::execute(&pg_addr, &sql, &sql_params)?;

        let info = Info {
            model_name: GutpPostTag::model_name(),
            action: HandlerCRUD::Delete,
            extra: "".to_string(),
        };
        let results: Vec<GutpPostTag> = vec![];

        Ok(Response::new(Status::Successful, info, results))
    }
}

impl Module for GutpPostTagModule {
    fn router(&self, router: &mut Router) -> Result<()> {
        router.get("/v1/posttag", Self::get_one);
        router.get("/v1/posttag/list", Self::get_list);
        router.get("/v1/posttag/list_by_post", Self::list_by_post);
        router.get("/v1/posttag/list_by_tag", Self::list_by_tag);
        router.post("/v1/posttag/create", Self::new_one);
        router.post("/v1/posttag/update", Self::update);
        router.post("/v1/posttag/delete", Self::delete);

        Ok(())
    }
}
