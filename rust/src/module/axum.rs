use std::sync::{Arc, Mutex};

use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Extension, Router};
use rusqlite::Connection;

use crate::app_state::{self, AppInfo, AppState};

type ModState = Arc<Mutex<Connection>>;

impl super::Todo {
    pub fn create_axum_router(state: ModState) -> Router {
        Router::new()
            .route("/", get(Self::get).post(Self::post))
            .layer(Extension(state))
    }

    async fn get(Extension(db): Extension<ModState>) -> impl IntoResponse {
        let res = db.lock().unwrap();

        let mut res = res
            .prepare("SELECT todos.id, todos.title, todos.completed, todos.owner FROM todos;")
            .unwrap();

        // let res = res
        //     .query_map([], |row| {
        //         let rows = super::Todo {
        //             id: row.get::<&str, u64>("id").unwrap(),
        //             title: row.get::<&str, String>("title").unwrap(),
        //             completed: row.get::<&str, bool>("completed").unwrap(),
        //             owner: row.get::<&str, String>("owner").unwrap(),
        //         };

        //         let res_ = format!("raw: {:?}", rows);
        //         return Ok(res_);
        //     })
        //     .unwrap();

        // for person in res {
        //     println!("Found person {:?}", person.unwrap());
        // }

        (StatusCode::OK, format!("hello"))
    }

    async fn post(Extension(db): Extension<ModState>) -> impl IntoResponse {
        let res = db.lock().unwrap();

        // let input = super::Todo {
        //     id: 0, // generated by db
        //     title: "Inserted by Axum".to_string(),
        //     completed: false,
        //     owner: "me".to_string(),
        // };

        // let mut res = res
        //         .prepare(
        //             "INSERT INTO todos (title, completed, owner) VALUES ('Inserted by Axum', false, 'me') returning *;",
        //         )
        //         .unwrap();

        // let res = res
        //     .query_map([], |row| {
        //         let rows = super::Todo {
        //             id: row.get::<&str, u64>("id").unwrap(), //row.get::<&str, usize>("id").unwrap(),
        //             title: row.get::<&str, String>("title").unwrap(),
        //             completed: row.get::<&str, bool>("completed").unwrap(),
        //             owner: row.get::<&str, String>("owner").unwrap(),
        //         };

        //         let res_ = format!("raw: {:?}", rows);
        //         return Ok(res_);
        //     })
        //     .unwrap();

        // for person in res {
        //     println!("Found person {:?}", person.unwrap());
        // }

        let res = "hi from stateful_get!";

        (StatusCode::CREATED, format!("hello"))
    }
}
