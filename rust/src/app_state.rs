use axum::extract::FromRef;
use rusqlite::Connection;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppInfo(pub String);

pub struct AppState {
    pub name: AppInfo,
    pub connection: Arc<Mutex<Connection>>,
}

impl FromRef<AppState> for AppInfo {
    fn from_ref(app_state: &AppState) -> AppInfo {
        app_state.name.clone()
    }
}
