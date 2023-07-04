use std::boxed::Box;
use std::result::Result;

type GenericError = Box<dyn std::error::Error + Send + Sync + 'static>;
type GenericResult<T> = Result<T, GenericError>;

pub mod dauth;
pub mod dclient;
