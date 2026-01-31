mod commands;
mod models;
mod services;

use commands::*;
use services::{ConfigService, SystemService};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .manage(ConfigService::new())
        .manage(SystemService::new())
        .invoke_handler(tauri::generate_handler![
            get_categories,
            get_files,
            get_file,
            update_file,
            backup_file,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
