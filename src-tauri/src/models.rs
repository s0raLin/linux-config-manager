use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

/// 配置文件的数据模型
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConfigFile {
    pub id: String,
    pub name: String,
    pub path: String,
    pub category: String,
    pub description: String,
    #[serde(rename = "lastModified")]
    pub last_modified: DateTime<Utc>,
    pub size: i64,
    #[serde(rename = "isSymlink")]
    pub is_symlink: bool,
    #[serde(rename = "backupExists")]
    pub backup_exists: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,
}

/// 配置文件分类的数据模型
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConfigCategory {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub color: String,
    pub description: String,
}

/// 系统信息的数据模型
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub kernel: String,
    pub shell: String,
    #[serde(rename = "homeDir")]
    pub home_dir: String,
    pub user: String,
}

/// 更新文件的请求数据
#[derive(Debug, Deserialize)]
pub struct UpdateFileRequest {
    pub content: String,
}

/// 备份文件的响应数据
#[derive(Debug, Serialize)]
pub struct BackupFileResponse {
    pub message: String,
    #[serde(rename = "backupPath")]
    pub backup_path: String,
}

/// API响应的通用结构
#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: Option<String>,
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            message: None,
            data: Some(data),
        }
    }

    pub fn success_with_message(data: T, message: String) -> Self {
        Self {
            success: true,
            message: Some(message),
            data: Some(data),
        }
    }

    pub fn error(message: String) -> Self {
        Self {
            success: false,
            message: Some(message),
            data: None,
        }
    }
}