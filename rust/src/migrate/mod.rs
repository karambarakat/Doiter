use rusqlite::Connection;

pub fn migrate(connection: &Connection) {
    connection
        .execute(
            "
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
        ;",
            (),
        )
        .unwrap();

    connection
        .execute(
            "
    CREATE TABLE Todos (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL,
        owner INTEGER,

        FOREIGN KEY(owner) REFERENCES Users(id)
    )
    ;",
            (),
        )
        .unwrap();

    connection
        .execute(
            "
    INSERT INTO Users 
        (name) 
    VALUES
        ('me')
    ;",
            (),
        )
        .unwrap();

    connection
        .execute(
            "
    INSERT INTO Todos 
        (title, completed, owner) 
    VALUES
        ('Buy milk', false, 1),
        ('Buy eggs', false, 1),
        ('Buy cheese', false, 1)
    ;",
            (),
        )
        .unwrap();
}
