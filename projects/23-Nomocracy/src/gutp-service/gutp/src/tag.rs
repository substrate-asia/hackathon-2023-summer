use std::any;

use anyhow::{anyhow, bail};
use eightfish::{
    EightFishModel, HandlerCRUD, Info, Module, Request, Response, Result, Router, Status,
};
use eightfish_derive::EightFishModel;
use serde::{Deserialize, Serialize};
use spin_sdk::pg::{self, ParameterValue};
use sql_builder::SqlBuilder;

use crate::constants::DB_URL_ENV;
use crate::utils;
use gutp_types::GutpTag;
const GUTP_TAG_WEIGHT_DEFAULT: i16 = 0;

pub struct GutpTagModule;

impl GutpTagModule {
    fn get_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;
        let tag_id = params.get("id").ok_or(anyhow!("id is required"))?;

        let (sql, sql_params) = GutpTag::build_get_by_id(tag_id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;

        let results = if let Some(row) = rowset.rows.into_iter().next() {
            vec![GutpTag::from_row(row)]
        } else {
            return bail!("no this item".to_string());
        };

        let info = Info {
            model_name: GutpTag::model_name(),
            action: HandlerCRUD::GetOne,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn get_list(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let (limit, offset) = utils::build_page_info(&params)?;
        let sql = SqlBuilder::select_from(&GutpTag::model_name())
            .fields(&GutpTag::fields())
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let rowset = pg::query(&pg_addr, &sql, &[])?;

        let mut results: Vec<GutpTag> = vec![];
        for row in rowset.rows {
            let sp = GutpTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpTag::model_name(),
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
        let sql = SqlBuilder::select_from(&GutpTag::model_name())
            .fields(&GutpTag::fields())
            .and_where_eq("subspace_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(subspace_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpTag> = vec![];
        for row in rowset.rows {
            let sp = GutpTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpTag::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn list_by_creator(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let creator_id = params
            .get("creator_id")
            .ok_or(anyhow!("creator_id is required"))?;

        let (limit, offset) = utils::build_page_info(&params)?;
        let sql = SqlBuilder::select_from(&GutpTag::model_name())
            .fields(&GutpTag::fields())
            .and_where_eq("creator_id", "$1")
            .order_desc("created_time")
            .limit(limit)
            .offset(offset)
            .sql()?;
        let sql_param = ParameterValue::Str(creator_id);
        let rowset = pg::query(&pg_addr, &sql, &[sql_param])?;

        let mut results: Vec<GutpTag> = vec![];
        for row in rowset.rows {
            let sp = GutpTag::from_row(row);
            results.push(sp);
        }

        let info = Info {
            model_name: GutpTag::model_name(),
            action: HandlerCRUD::List,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn new_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let caption = params
            .get("caption")
            .ok_or(anyhow!("caption is required"))?
            .to_owned();
        let subspace_id = params
            .get("subspace_id")
            .ok_or(anyhow!("subspace_id is required"))?
            .to_owned();
        let creator_id = params
            .get("creator_id")
            .ok_or(anyhow!("creator_id is required"))?
            .to_owned();
        let is_subspace_tag = params
            .get("is_subspace_tag")
            .ok_or(anyhow!("is_subspace_tag is required"))?
            .parse::<bool>()?;
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
            .ok_or(anyhow!("get time failed"))?
            .parse::<i64>()?;

        let tag = GutpTag {
            id,
            caption,
            subspace_id,
            creator_id,
            is_subspace_tag,
            is_public,
            weight: GUTP_TAG_WEIGHT_DEFAULT,
            created_time: time,
        };

        let (sql, sql_params) = tag.build_insert();
        _ = pg::execute(&pg_addr, &sql, &sql_params)?;

        let results: Vec<GutpTag> = vec![tag];

        let info = Info {
            model_name: GutpTag::model_name(),
            action: HandlerCRUD::Create,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn update(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id not found"))?.to_owned();
        let caption = params
            .get("caption")
            .ok_or(anyhow!("caption not found"))?
            .to_owned();
        let subspace_id = params
            .get("subspace_id")
            .ok_or(anyhow!("subspace_id not found"))?
            .to_owned();
        let creator_id = params
            .get("creator_id")
            .ok_or(anyhow!("creator_id not found"))?
            .to_owned();
        let is_public = params
            .get("is_public")
            .ok_or(anyhow!("is_public not found"))?
            .parse::<bool>()?;

        // get the item from db, check whether obj in db
        let (sql, sql_params) = GutpTag::build_get_by_id(&id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;
        match rowset.rows.into_iter().next() {
            Some(row) => {
                let old_tag = GutpTag::from_row(row);

                let tag = GutpTag {
                    caption,
                    subspace_id,
                    creator_id,
                    is_public,
                    ..old_tag
                };

                let (sql, sql_params) = tag.build_update();
                _ = pg::execute(&pg_addr, &sql, &sql_params)?;

                let results: Vec<GutpTag> = vec![tag];

                let info = Info {
                    model_name: GutpTag::model_name(),
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

        let (sql, sql_params) = GutpTag::build_delete(id);
        _ = pg::execute(&pg_addr, &sql, &sql_params)?;

        let info = Info {
            model_name: GutpTag::model_name(),
            action: HandlerCRUD::Delete,
            extra: "".to_string(),
        };
        let results: Vec<GutpTag> = vec![];

        Ok(Response::new(Status::Successful, info, results))
    }
}

impl Module for GutpTagModule {
    fn router(&self, router: &mut Router) -> Result<()> {
        router.get("/v1/tag", Self::get_one);
        router.get("/v1/tag/list", Self::get_list);
        router.get("/v1/tag/list_by_subspace", Self::list_by_subspace);
        router.get("/v1/tag/list_by_creator", Self::list_by_creator);
        router.post("/v1/tag/create", Self::new_one);
        router.post("/v1/tag/update", Self::update);
        router.post("/v1/tag/delete", Self::delete);

        Ok(())
    }
}
