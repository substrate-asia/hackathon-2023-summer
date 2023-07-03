use crate::constants::DB_URL_ENV;
use anyhow::{anyhow, bail};
use eightfish::{
    EightFishModel, HandlerCRUD, Info, Module, Request, Response, Result, Router, Status,
};
use eightfish_derive::EightFishModel;
use gutp_types::GutpUser;
use serde::{Deserialize, Serialize};
use spin_sdk::pg::{self, DbValue, Decode, ParameterValue};
use sql_builder::SqlBuilder;
use std::any;

enum GutpUserStatus {
    Normal = 0,
    Frozen = 1,
    Forbidden = 2,
    Deleted = 3,
}

enum GutpUserRole {
    Normal = 0,
}

pub struct GutpUserModule;

impl GutpUserModule {
    fn get_one(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let entity_id = params.get("id").ok_or(anyhow!("id is required"))?;

        let (sql, sql_params) = GutpUser::build_get_by_id(entity_id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;

        let mut results: Vec<GutpUser> = vec![];
        for row in rowset.rows {
            let article = GutpUser::from_row(row);
            results.push(article);
        }

        let info = Info {
            model_name: GutpUser::model_name(),
            action: HandlerCRUD::GetOne,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn new_user(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let account = params
            .get("account")
            .ok_or(anyhow!("account is required"))?
            .to_owned();
        let nickname = params
            .get("nickname")
            .ok_or(anyhow!("nickname is required"))?
            .to_owned();
        let avatar = params
            .get("avatar")
            .ok_or(anyhow!("avatar is required"))?
            .to_owned();
        let pub_settings = params
            .get("pub_settings")
            .ok_or(anyhow!("pub_settings is required"))?
            .to_owned();
        let ext = params
            .get("ext")
            .ok_or(anyhow!("ext is required"))?
            .to_owned();

        let id = req
            .ext()
            .get("random_str")
            .ok_or(anyhow!("random_str is required"))?
            .to_owned();
        let time = req
            .ext()
            .get("time")
            .ok_or(anyhow!("time is required"))?
            .parse::<i64>()?;

        let article = GutpUser {
            id,
            account,
            nickname,
            avatar,
            role: GutpUserRole::Normal as i16,
            status: GutpUserStatus::Normal as i16,
            signup_time: time,
            pub_settings,
            ext,
        };

        let (sql, sql_params) = article.build_insert();
        _ = pg::execute(&pg_addr, &sql, &sql_params);

        let results: Vec<GutpUser> = vec![article];

        let info = Info {
            model_name: GutpUser::model_name(),
            action: HandlerCRUD::Create,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }

    fn update(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV).unwrap();

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required"))?;
        let account = params
            .get("account")
            .ok_or(anyhow!("account is required"))?
            .to_owned();
        let nickname = params
            .get("nickname")
            .ok_or(anyhow!("nickname is required"))?
            .to_owned();
        let avatar = params
            .get("avatar")
            .ok_or(anyhow!("avatar is required"))?
            .to_owned();
        let pub_settings = params
            .get("pub_settings")
            .ok_or(anyhow!("pub_settings is required"))?
            .to_owned();
        let ext = params
            .get("ext")
            .ok_or(anyhow!("ext is required"))?
            .to_owned();

        // get the item from db, check whether obj in db
        let (sql, sql_params) = GutpUser::build_get_by_id(id);
        let rowset = pg::query(&pg_addr, &sql, &sql_params)?;
        match rowset.rows.into_iter().next() {
            Some(row) => {
                let old_user = GutpUser::from_row(row);

                let user = GutpUser {
                    account,
                    nickname,
                    avatar,
                    pub_settings,
                    ext,
                    ..old_user
                };

                let (sql, sql_params) = user.build_update();
                _ = pg::execute(&pg_addr, &sql, &sql_params)?;

                let results: Vec<GutpUser> = vec![user];

                let info = Info {
                    model_name: GutpUser::model_name(),
                    action: HandlerCRUD::Update,
                    extra: "".to_string(),
                };

                Ok(Response::new(Status::Successful, info, results))
            }
            None => {
                bail!("update action: no item in db")
            }
        }
    }

    fn delete(req: &mut Request) -> Result<Response> {
        let pg_addr = std::env::var(DB_URL_ENV)?;

        let params = req.parse_urlencoded()?;

        let id = params.get("id").ok_or(anyhow!("id is required"))?;

        let (sql, sql_params) = GutpUser::build_delete(id);
        _ = pg::execute(&pg_addr, &sql, &sql_params);

        let results: Vec<GutpUser> = vec![];

        let info = Info {
            model_name: GutpUser::model_name(),
            action: HandlerCRUD::Delete,
            extra: "".to_string(),
        };

        Ok(Response::new(Status::Successful, info, results))
    }
}

impl Module for GutpUserModule {
    fn router(&self, router: &mut Router) -> Result<()> {
        router.get("/v1/user", Self::get_one);
        router.post("/v1/user/create", Self::new_user);
        router.post("/v1/user/update", Self::update);
        router.post("/v1/user/delete", Self::delete);

        Ok(())
    }
}
