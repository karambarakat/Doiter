#![allow(dead_code)]
pub mod axum;
mod helper;

use crate::types::*;

// in the future, this should derive ContentType trait
// content type should provide
//      - axum Router factory implementation
//      - generate OpenAPI schema
//      - generate SQL statements
//      - generate SQL migrations
//      - generate typescript types/client
#[derive(Debug)]
pub struct Todo {
    id: Id,
    title: VarChar,
    completed: Bool,
}

pub struct Owner {
    id: Id,
    name: VarChar,
}

pub trait Relation {
    fn run();
    fn migrate_sql() -> String;
    fn transform_sql() -> String;
    fn transform_api() -> String;
}

pub struct OneToMany<From, To>(From, To);

impl<F, T> Relation for OneToMany<F, T> {
    fn run() {
        println!("run");
    }
    fn migrate_sql() -> String {
        return "".to_string();
    }
    fn transform_sql() -> String {
        return "".to_string();
    }
    fn transform_api() -> String {
        return "".to_string();
    }
}

pub fn client() {
    OneToMany::<Todo, Owner>::run();
}

pub fn plugin_internal_funtion<TO>(trait_object: &mut TO)
where
    TO: Relation,
{
}

pub mod service {}
