import React, { useEffect, useRef } from 'react';
import { useTauriApp } from '../contexts/TauriAppContext';
import SyntaxHighlightedEditor from './SyntaxHighlightedEditor';
import { 
  Save, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Shield, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const TauriEditor: React.FC = () => {
  const { state, actions } = useTauriApp();
  const { 
    activeFileId, 
    activeFileContent, 
    files, 
    isLoading, 
    error, 
    isModified,
    undoHistory,
    redoHistory
  } = state;
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  // 根据文件名获取语言类型
  const getFileLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'bashrc': 'bash',
      'zshrc': 'bash',
      'profile': 'bash',
      'gitconfig': 'gitconfig',
      'vimrc': 'vim',
      'config': 'text',
      'conf': 'text',
      'cfg': 'text',
      'ini': 'ini',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
    };
    
    // 首先检查完整文件名
    if (languageMap[filename]) {
      return languageMap[filename];
    }
    
    // 然后检查扩展名
    if (ext && languageMap[ext]) {
      return languageMap[ext];
    }
    
    return 'text';
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (e.shiftKey) {
              // Ctrl+Shift+S: 保存所有文件
              actions.saveAllFiles();
            } else {
              // Ctrl+S: 保存当前文件
              actions.saveFile();
            }
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Ctrl+Shift+Z: 重做
              actions.redo();
            } else {
              // Ctrl+Z: 撤销
              actions.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            // Ctrl+Y: 重做
            actions.redo();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  const handleContentChange = (content: string) => {
    actions.updateFileContent(content);
  };

  const handleSave = () => {
    actions.saveFile();
  };

  const handleBackup = () => {
    if (activeFileId) {
      actions.backupFile(activeFileId);
    }
  };

  const handleRevert = () => {
    actions.revertChanges();
  };

  const handleUndo = () => {
    actions.undo();
  };

  const handleRedo = () => {
    actions.redo();
  };

  if (!activeFileId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <FileText size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            选择一个配置文件
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            从左侧边栏选择一个配置文件开始编辑
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      {/* 文件标题栏 */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-slate-600 dark:text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {activeFile?.name}
              {isModified && <span className="text-orange-500 ml-1">*</span>}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {activeFile?.path}
            </p>
          </div>
          {activeFile?.isSymlink && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
              <Shield size={12} />
              符号链接
            </div>
          )}
          {activeFile?.backupExists && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
              <CheckCircle size={12} />
              已备份
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoHistory.length === 0}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="撤销 (Ctrl+Z)"
          >
            <Undo2 size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoHistory.length === 0}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="重做 (Ctrl+Y)"
          >
            <Redo2 size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
          <button
            onClick={handleRevert}
            disabled={!isModified}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="恢复到原始内容"
          >
            <RotateCcw size={16} />
            恢复
          </button>
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="创建备份"
          >
            <Shield size={16} />
            备份
          </button>
          <button
            onClick={handleSave}
            disabled={!isModified || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="保存文件 (Ctrl+S)"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* 编辑器区域 */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">加载文件内容...</p>
            </div>
          </div>
        ) : (
          <SyntaxHighlightedEditor
            content={activeFileContent}
            language={getFileLanguage(activeFile?.name || '')}
            onContentChange={handleContentChange}
            isReadOnly={false}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        )}
      </div>
    </div>
  );
};

export default TauriEditor;