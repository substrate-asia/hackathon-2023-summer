use crate::constants::PAGESIZE_STR;
use anyhow::{anyhow, Result};
use std::collections::HashMap;

pub fn build_page_info(params: &HashMap<String, String>) -> Result<(u64, u64)> {
    let page = params
        .get("page")
        .unwrap_or(&"0".to_string())
        .parse::<u64>()?;
    let limit = params
        .get("pagesize")
        .unwrap_or(&PAGESIZE_STR.to_string())
        .parse::<u64>()?;
    let offset = page * limit;
    Ok((limit, offset))
}

pub fn get_required_param(params: &HashMap<String, String>, param_name: &str) -> Result<String> {
    let value = params
        .get(param_name)
        .ok_or(anyhow!(format!("{param_name} is required.")))?;
    Ok(value.to_string())
}
