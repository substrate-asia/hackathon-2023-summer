use eightfish::EightFishModel;
use eightfish_derive::EightFishModel;
use serde::{Deserialize, Serialize};
use spin_sdk::pg::{DbValue, Decode, ParameterValue};

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpUser {
    pub id: String,
    pub account: String,
    pub nickname: String,
    pub avatar: String,
    pub role: i16,
    pub status: i16,
    pub signup_time: i64,
    pub pub_settings: String,
    pub ext: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpSubspace {
    pub id: String,
    pub title: String,
    pub description: String,
    pub banner: String,
    pub owner_id: String,
    pub profession: String,
    pub appid: String,
    pub is_public: bool,
    pub status: i16,
    pub weight: i16,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpPost {
    pub id: String,
    pub title: String,
    pub content: String,
    pub author_id: String,
    pub subspace_id: String,
    pub extlink: String,
    pub profession: String,
    pub appid: String,
    pub is_public: bool,
    pub status: i16,
    pub weight: i16,
    pub created_time: i64,
    pub updated_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpComment {
    pub id: String,
    pub content: String,
    pub author_id: String,
    pub post_id: String,
    pub parent_comment_id: String,
    pub is_public: bool,
    pub status: i16,
    pub weight: i32,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpTag {
    pub id: String,
    pub caption: String,
    pub subspace_id: String,
    pub creator_id: String,
    pub is_subspace_tag: bool,
    pub is_public: bool,
    pub weight: i16,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpPostTag {
    pub id: String,
    pub post_id: String,
    pub tag_id: String,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpPostDiff {
    pub id: String,
    pub post_id: String,
    pub diff: String,
    pub version_num: i32,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpModerator {
    pub id: String,
    pub user_id: String,
    pub is_subspace_moderator: bool,
    pub subspace_id: String,
    pub tag_id: String,
    pub permission_level: i16,
    pub created_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, EightFishModel)]
pub struct GutpExtobj {
    pub id: String,
    pub caption: String,
    pub content: String,
    pub subspace_id: String,
    pub tag_id: String,
    pub creator_id: String,
    pub is_subspace_ext: bool,
    pub weight: i16,
    pub created_time: i64,
}
