#![allow(dead_code)]
pub trait TableInfo {
    fn names(&self) -> Vec<String>;
    fn table_name(&self) -> String;
}

impl TableInfo for super::Todo {
    fn names(&self) -> Vec<String> {
        vec![
            "id".to_string(),
            "title".to_string(),
            "completed".to_string(),
        ]
    }
    fn table_name(&self) -> String {
        "todos".to_string()
    }
}
