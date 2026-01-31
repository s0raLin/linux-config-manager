import React from 'react';
import { useTauriApp } from '../contexts/TauriAppContext';
import { 
  Terminal, 
  FileText, 
  GitBranch, 
  Key, 
  Settings, 
  Package,
  ChevronRight,
  ChevronDown,
  File,
  Shield,
  Clock,
  HardDrive
} from 'lucide-react';

const iconMap = {
  Terminal,
  FileText,
  GitBranch,
  Key,
  Settings,
  Package,
};

const TauriSidebar: React.FC = () => {
  const { state, actions } = useTauriApp();
  const { categories, files, activeFileId, isLoading } = state;
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(categories.map(cat => cat.id))
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleFileSelect = (fileId: string) => {
    actions.selectFile(fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">配置文件</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {files.length} 个配置文件
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">加载中...</p>
          </div>
        ) : (
          <div className="p-2">
            {categories.map((category) => {
              const categoryFiles = files.filter(file => file.category === category.id);
              const isExpanded = expandedCategories.has(category.id);
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || File;

              return (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-slate-500" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-500" />
                    )}
                    <IconComponent size={16} className="text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {category.name}
                    </span>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {categoryFiles.length}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {categoryFiles.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 p-2">
                          暂无配置文件
                        </p>
                      ) : (
                        categoryFiles.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => handleFileSelect(file.id)}
                            className={`w-full text-left p-2 rounded-lg transition-all ${
                              activeFileId === file.id
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500'
                                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <File size={14} className="text-slate-500" />
                              <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                {file.name}
                              </span>
                              {file.isSymlink && (
                                <Shield size={12} className="text-blue-500" title="符号链接" />
                              )}
                              {file.backupExists && (
                                <Shield size={12} className="text-green-500" title="已备份" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <HardDrive size={10} />
                                <span>{formatFileSize(file.size)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={10} />
                                <span>{formatDate(file.lastModified)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                              {file.description}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default TauriSidebar;