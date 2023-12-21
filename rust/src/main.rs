mod app_state;
mod manual;
mod migrate;
mod module;
mod types;

use app_state::{AppInfo, AppState};
use axum::Router;
use rusqlite::Connection;
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    let connection = Connection::open_in_memory().unwrap();

    crate::migrate::migrate(&connection);

    let app = Router::new();

    let state = AppState {
        name: AppInfo("hi from main fn!".to_string()),
        connection: Arc::new(Mutex::new(connection)),
    };

    let state = state.connection;

    let app = app.nest("/todos", module::Todo::create_axum_router(state));

    axum::Server::bind(&"0.0.0.0:3003".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
