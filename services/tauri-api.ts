import { invoke } from '@tauri-apps/api/core';
import { ConfigFile, ConfigCategory, SystemInfo, BackupFileResponse } from '../types';

// API响应的通用结构
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export class TauriApiService {
  /**
   * 获取所有配置分类
   */
  static async getCategories(): Promise<ConfigCategory[]> {
    try {
      const response: ApiResponse<ConfigCategory[]> = await invoke('get_categories');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取分类失败');
    } catch (error) {
      console.error('获取分类失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有配置文件列表
   */
  static async getFiles(): Promise<ConfigFile[]> {
    try {
      const response: ApiResponse<ConfigFile[]> = await invoke('get_files');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取文件列表失败');
    } catch (error) {
      console.error('获取文件列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取配置文件详情
   */
  static async getFile(fileId: string): Promise<ConfigFile> {
    try {
      const response: ApiResponse<ConfigFile> = await invoke('get_file', { fileId });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取文件详情失败');
    } catch (error) {
      console.error('获取文件详情失败:', error);
      throw error;
    }
  }

  /**
   * 更新配置文件内容
   */
  static async updateFile(fileId: string, content: string): Promise<void> {
    try {
      const response: ApiResponse<void> = await invoke('update_file', { fileId, content });
      if (!response.success) {
        throw new Error(response.message || '更新文件失败');
      }
    } catch (error) {
      console.error('更新文件失败:', error);
      throw error;
    }
  }

  /**
   * 创建配置文件备份
   */
  static async backupFile(fileId: string): Promise<BackupFileResponse> {
    try {
      const response: ApiResponse<BackupFileResponse> = await invoke('backup_file', { fileId });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '创建备份失败');
    } catch (error) {
      console.error('创建备份失败:', error);
      throw error;
    }
  }

  /**
   * 获取系统信息
   */
  static async getSystemInfo(): Promise<SystemInfo> {
    try {
      const response: ApiResponse<SystemInfo> = await invoke('get_system_info');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取系统信息失败');
    } catch (error) {
      console.error('获取系统信息失败:', error);
      throw error;
    }
  }
}