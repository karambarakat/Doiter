// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use sqlite::State;

lazy_static::lazy_static! {
    // static ref CONNECTION : sqlite::Connection = sqlite::open(":memory:").unwrap();
    static ref CON: Mutex<sqlite::Connection> = Mutex::new(sqlite::open(":memory:").unwrap());

}

fn main() {
    CON.lock()
        .unwrap()
        .execute(
            "
            CREATE TABLE IF NOT EXISTS titles (
                id          INTEGER PRIMARY KEY,
                title       TEXT NOT NULL
            );

            INSERT INTO titles (title) VALUES ('ent1');
            INSERT INTO titles (title) VALUES ('ent2');
        ",
        )
        .unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add, get_all])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_all() -> String {
    let query = "SELECT * FROM titles;";
    let con = CON.lock().unwrap();
    let mut statement = con.prepare(query).unwrap();

    let mut res: Vec<String> = Vec::new();

    while let Ok(State::Row) = statement.next() {
        // res.push_str(&statement.read::<String, _>("title").unwrap());
        res.push(statement.read::<String, _>("title").unwrap());
    }

    format!("Hello, {}!", res.join(", "))
}

#[tauri::command]
fn add(title: &str) -> String {
    let query = "INSERT INTO titles (title) VALUES (:title);";
    let con = CON.lock().unwrap();
    let mut statement = con.prepare(query).unwrap();

    statement.bind(&[(":title", title)][..]).unwrap();

    let _ = statement.next();

    format!("added, {}!", title)
}
