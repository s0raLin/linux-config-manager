import React from 'react';
import { useTauriApp } from '../contexts/TauriAppContext';
import { 
  Monitor, 
  User, 
  Terminal, 
  HardDrive, 
  Clock,
  FileText,
  Save,
  AlertCircle
} from 'lucide-react';

const TauriStatusBar: React.FC = () => {
  const { state } = useTauriApp();
  const { 
    systemInfo, 
    files, 
    activeFileId, 
    activeFileContent, 
    isModified,
    fileEditStates
  } = state;

  const activeFile = files.find(f => f.id === activeFileId);
  
  // 计算统计信息
  const totalFiles = files.length;
  const unsavedFilesCount = Object.values(fileEditStates).filter(fileState => fileState.isModified).length + 
                           (isModified && activeFileId && !fileEditStates[activeFileId]?.isModified ? 1 : 0);
  
  // 计算当前文件的行数和字符数
  const lineCount = activeFileContent ? activeFileContent.split('\n').length : 0;
  const charCount = activeFileContent ? activeFileContent.length : 0;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-2">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        {/* 左侧：系统信息 */}
        <div className="flex items-center gap-6">
          {systemInfo && (
            <>
              <div className="flex items-center gap-1">
                <Monitor size={12} />
                <span>{systemInfo.os}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{systemInfo.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Terminal size={12} />
                <span>{systemInfo.shell.split('/').pop()}</span>
              </div>
            </>
          )}
        </div>

        {/* 中间：文件统计 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <FileText size={12} />
            <span>{totalFiles} 个配置文件</span>
          </div>
          {unsavedFilesCount > 0 && (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <AlertCircle size={12} />
              <span>{unsavedFilesCount} 个未保存</span>
            </div>
          )}
        </div>

        {/* 右侧：当前文件信息 */}
        <div className="flex items-center gap-6">
          {activeFile && (
            <>
              <div className="flex items-center gap-1">
                <HardDrive size={12} />
                <span>{formatFileSize(activeFile.size)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatDate(activeFile.lastModified)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={12} />
                <span>{lineCount} 行, {charCount} 字符</span>
              </div>
              {isModified && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <Save size={12} />
                  <span>未保存</span>
                </div>
              )}
            </>
          )}
          <div className="text-blue-600 dark:text-blue-400 font-medium">
            Tauri Desktop App
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TauriStatusBar;