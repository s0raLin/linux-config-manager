use crate::models::*;
use anyhow::{anyhow, Result};
use chrono::{DateTime, Utc};
use std::fs;
use std::path::Path;

/// 配置服务，处理配置文件相关的业务逻辑
pub struct ConfigService;

impl ConfigService {
    pub fn new() -> Self {
        Self
    }

    /// 获取所有配置分类
    pub fn get_categories(&self) -> Vec<ConfigCategory> {
        vec![
            ConfigCategory {
                id: "shell".to_string(),
                name: "Shell 配置".to_string(),
                icon: "Terminal".to_string(),
                color: "bg-green-500".to_string(),
                description: "Shell 环境配置文件".to_string(),
            },
            ConfigCategory {
                id: "editor".to_string(),
                name: "编辑器配置".to_string(),
                icon: "FileText".to_string(),
                color: "bg-blue-500".to_string(),
                description: "文本编辑器配置".to_string(),
            },
            ConfigCategory {
                id: "git".to_string(),
                name: "Git 配置".to_string(),
                icon: "GitBranch".to_string(),
                color: "bg-orange-500".to_string(),
                description: "Git 版本控制配置".to_string(),
            },
            ConfigCategory {
                id: "ssh".to_string(),
                name: "SSH 配置".to_string(),
                icon: "Key".to_string(),
                color: "bg-purple-500".to_string(),
                description: "SSH 客户端配置".to_string(),
            },
            ConfigCategory {
                id: "system".to_string(),
                name: "系统配置".to_string(),
                icon: "Settings".to_string(),
                color: "bg-red-500".to_string(),
                description: "系统级配置文件".to_string(),
            },
            ConfigCategory {
                id: "app".to_string(),
                name: "应用配置".to_string(),
                icon: "Package".to_string(),
                color: "bg-indigo-500".to_string(),
                description: "应用程序配置".to_string(),
            },
        ]
    }

    /// 获取预定义的常用配置文件
    fn get_common_config_files(&self) -> Vec<ConfigFile> {
        let now = Utc::now();
        vec![
            ConfigFile {
                id: "bashrc".to_string(),
                name: ".bashrc".to_string(),
                path: "~/.bashrc".to_string(),
                category: "shell".to_string(),
                description: "Bash shell 配置".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
            ConfigFile {
                id: "zshrc".to_string(),
                name: ".zshrc".to_string(),
                path: "~/.zshrc".to_string(),
                category: "shell".to_string(),
                description: "Zsh shell 配置".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
            ConfigFile {
                id: "profile".to_string(),
                name: ".profile".to_string(),
                path: "~/.profile".to_string(),
                category: "shell".to_string(),
                description: "Shell 环境变量".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
            ConfigFile {
                id: "gitconfig".to_string(),
                name: ".gitconfig".to_string(),
                path: "~/.gitconfig".to_string(),
                category: "git".to_string(),
                description: "Git 全局配置".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
            ConfigFile {
                id: "vimrc".to_string(),
                name: ".vimrc".to_string(),
                path: "~/.vimrc".to_string(),
                category: "editor".to_string(),
                description: "Vim 编辑器配置".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
            ConfigFile {
                id: "sshconfig".to_string(),
                name: "config".to_string(),
                path: "~/.ssh/config".to_string(),
                category: "ssh".to_string(),
                description: "SSH 客户端配置".to_string(),
                last_modified: now,
                size: 0,
                is_symlink: false,
                backup_exists: false,
                content: None,
            },
        ]
    }

    /// 获取所有配置文件列表
    pub fn get_files(&self) -> Result<Vec<ConfigFile>> {
        let home_dir = dirs::home_dir()
            .ok_or_else(|| anyhow!("无法获取用户主目录"))?;

        let mut files = Vec::new();

        for mut file in self.get_common_config_files() {
            let real_path = file.path.replace("~", &home_dir.to_string_lossy());
            let path = Path::new(&real_path);

            if let Ok(metadata) = fs::symlink_metadata(path) {
                file.last_modified = DateTime::from(metadata.modified()?);
                file.size = metadata.len() as i64;
                file.is_symlink = metadata.file_type().is_symlink();

                // 检查备份是否存在
                let backup_path = format!("{}.backup", real_path);
                file.backup_exists = Path::new(&backup_path).exists();

                files.push(file);
            }
        }

        Ok(files)
    }

    /// 根据ID获取配置文件详情
    pub fn get_file_by_id(&self, file_id: &str) -> Result<ConfigFile> {
        let home_dir = dirs::home_dir()
            .ok_or_else(|| anyhow!("无法获取用户主目录"))?;

        let mut target_file = self
            .get_common_config_files()
            .into_iter()
            .find(|f| f.id == file_id)
            .ok_or_else(|| anyhow!("文件未找到: {}", file_id))?;

        let real_path = target_file.path.replace("~", &home_dir.to_string_lossy());
        let path = Path::new(&real_path);

        if !path.exists() {
            return Err(anyhow!("文件不存在: {}", real_path));
        }

        // 读取文件内容
        let content = fs::read_to_string(path)
            .map_err(|e| anyhow!("无法读取文件 {}: {}", real_path, e))?;

        target_file.content = Some(content);

        // 更新文件信息
        if let Ok(metadata) = fs::symlink_metadata(path) {
            target_file.last_modified = DateTime::from(metadata.modified()?);
            target_file.size = metadata.len() as i64;
            target_file.is_symlink = metadata.file_type().is_symlink();
        }

        Ok(target_file)
    }

    /// 更新配置文件内容
    pub fn update_file(&self, file_id: &str, content: &str) -> Result<()> {
        let home_dir = dirs::home_dir()
            .ok_or_else(|| anyhow!("无法获取用户主目录"))?;

        let target_file = self
            .get_common_config_files()
            .into_iter()
            .find(|f| f.id == file_id)
            .ok_or_else(|| anyhow!("文件未找到: {}", file_id))?;

        let real_path = target_file.path.replace("~", &home_dir.to_string_lossy());

        fs::write(&real_path, content)
            .map_err(|e| anyhow!("无法写入文件 {}: {}", real_path, e))?;

        Ok(())
    }

    /// 创建配置文件备份
    pub fn backup_file(&self, file_id: &str) -> Result<BackupFileResponse> {
        let home_dir = dirs::home_dir()
            .ok_or_else(|| anyhow!("无法获取用户主目录"))?;

        let target_file = self
            .get_common_config_files()
            .into_iter()
            .find(|f| f.id == file_id)
            .ok_or_else(|| anyhow!("文件未找到: {}", file_id))?;

        let real_path = target_file.path.replace("~", &home_dir.to_string_lossy());
        let path = Path::new(&real_path);

        if !path.exists() {
            return Err(anyhow!("文件不存在: {}", real_path));
        }

        let backup_path = format!(
            "{}.backup.{}",
            real_path,
            chrono::Utc::now().format("%Y%m%d-%H%M%S")
        );

        // 复制文件作为备份
        fs::copy(&real_path, &backup_path)
            .map_err(|e| anyhow!("无法创建备份文件 {}: {}", backup_path, e))?;

        Ok(BackupFileResponse {
            message: "备份创建成功".to_string(),
            backup_path,
        })
    }
}

/// 系统服务，处理系统信息相关的业务逻辑
pub struct SystemService;

impl SystemService {
    pub fn new() -> Self {
        Self
    }

    /// 获取系统信息
    pub fn get_system_info(&self) -> Result<SystemInfo> {
        let home_dir = dirs::home_dir()
            .ok_or_else(|| anyhow!("无法获取用户主目录"))?
            .to_string_lossy()
            .to_string();

        let user = std::env::var("USER").unwrap_or_else(|_| "unknown".to_string());
        let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string());

        // 获取操作系统信息
        let os = if cfg!(target_os = "linux") {
            "Linux".to_string()
        } else if cfg!(target_os = "macos") {
            "macOS".to_string()
        } else if cfg!(target_os = "windows") {
            "Windows".to_string()
        } else {
            "Unknown".to_string()
        };

        // 尝试获取内核版本
        let kernel = if cfg!(target_os = "linux") {
            std::process::Command::new("uname")
                .arg("-r")
                .output()
                .ok()
                .and_then(|output| String::from_utf8(output.stdout).ok())
                .map(|s| s.trim().to_string())
                .unwrap_or_else(|| "Unknown".to_string())
        } else {
            "Unknown".to_string()
        };

        Ok(SystemInfo {
            os,
            kernel,
            shell,
            home_dir,
            user,
        })
    }
}