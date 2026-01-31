use crate::models::*;
use crate::services::{ConfigService, SystemService};
use tauri::State;

/// 获取所有配置分类
#[tauri::command]
pub async fn get_categories(
    config_service: State<'_, ConfigService>,
) -> Result<ApiResponse<Vec<ConfigCategory>>, String> {
    let categories = config_service.get_categories();
    Ok(ApiResponse::success(categories))
}

/// 获取所有配置文件列表
#[tauri::command]
pub async fn get_files(
    config_service: State<'_, ConfigService>,
) -> Result<ApiResponse<Vec<ConfigFile>>, String> {
    match config_service.get_files() {
        Ok(files) => Ok(ApiResponse::success(files)),
        Err(e) => Ok(ApiResponse::error(format!("获取文件列表失败: {}", e))),
    }
}

/// 根据ID获取配置文件详情
#[tauri::command]
pub async fn get_file(
    file_id: String,
    config_service: State<'_, ConfigService>,
) -> Result<ApiResponse<ConfigFile>, String> {
    if file_id.is_empty() {
        return Ok(ApiResponse::error("文件ID不能为空".to_string()));
    }

    match config_service.get_file_by_id(&file_id) {
        Ok(file) => Ok(ApiResponse::success(file)),
        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}

/// 更新配置文件内容
#[tauri::command]
pub async fn update_file(
    file_id: String,
    content: String,
    config_service: State<'_, ConfigService>,
) -> Result<ApiResponse<()>, String> {
    if file_id.is_empty() {
        return Ok(ApiResponse::error("文件ID不能为空".to_string()));
    }

    match config_service.update_file(&file_id, &content) {
        Ok(_) => Ok(ApiResponse::success_with_message(
            (),
            "文件保存成功".to_string(),
        )),
        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}

/// 创建配置文件备份
#[tauri::command]
pub async fn backup_file(
    file_id: String,
    config_service: State<'_, ConfigService>,
) -> Result<ApiResponse<BackupFileResponse>, String> {
    if file_id.is_empty() {
        return Ok(ApiResponse::error("文件ID不能为空".to_string()));
    }

    match config_service.backup_file(&file_id) {
        Ok(backup_response) => Ok(ApiResponse::success(backup_response)),
        Err(e) => Ok(ApiResponse::error(e.to_string())),
    }
}

/// 获取系统信息
#[tauri::command]
pub async fn get_system_info(
    system_service: State<'_, SystemService>,
) -> Result<ApiResponse<SystemInfo>, String> {
    match system_service.get_system_info() {
        Ok(info) => Ok(ApiResponse::success(info)),
        Err(e) => Ok(ApiResponse::error(format!("获取系统信息失败: {}", e))),
    }
}