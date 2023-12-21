trait SqlStrings {
    fn sql_type() -> String;
}

impl SqlStrings for super::Id {
    fn sql_type() -> String {
        "INTEGER PRIMARY KEY".to_string()
    }
}
