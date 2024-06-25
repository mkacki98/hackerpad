use sqlite::{Connection, State};
use tauri::command;
use serde::{Serialize, Deserialize};

use tauri::api::path::data_dir; // Make sure to import data_dir
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: i64,
    name: String,
}


#[command]
pub fn initialize_db() -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/app.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    connection
        .execute(
            "
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );
            ",
        )
        .map_err(|e| e.to_string())?;
    Ok("Database initialized successfully".to_string())
}

#[command]
pub fn add_user(name: String) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/app.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut statement = connection
        .prepare("INSERT INTO users (name) VALUES (?)")
        .map_err(|e| e.to_string())?;
    statement.bind(1, name.as_str()).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;
    Ok("User added successfully".to_string())
}

#[command]
pub fn remove_user(id: i64) -> Result<String, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/app.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare("DELETE FROM users WHERE id = ?")
        .map_err(|e| e.to_string())?;
    statement.bind(1, id).map_err(|e| e.to_string())?;
    statement.next().map_err(|e| e.to_string())?;
    Ok("User removed successfully".to_string())
}

#[command]
pub fn get_users() -> Result<Vec<User>, String> {
    let db_path: PathBuf = data_dir().unwrap_or_else(|| PathBuf::from(".")).join("com.hackerpad-dev.dev/app.db");
    let connection = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare("SELECT id, name FROM users")
        .map_err(|e| e.to_string())?;
    
    let mut users = Vec::new();
    while let State::Row = statement.next().map_err(|e| e.to_string())? {
        let id = statement.read::<i64>(0).map_err(|e| e.to_string())?;
        let name = statement.read::<String>(1).map_err(|e| e.to_string())?;
        users.push(User { id, name });
    }
    Ok(users)
}

