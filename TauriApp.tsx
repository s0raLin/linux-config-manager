import React from 'react';
import { TauriAppProvider } from './contexts/TauriAppContext';
import TauriTopNavbar from './components/TauriTopNavbar';
import TauriSidebar from './components/TauriSidebar';
import TauriEditor from './components/TauriEditor';
import TauriStatusBar from './components/TauriStatusBar';

function TauriApp() {
  return (
    <TauriAppProvider>
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* 顶部导航栏 */}
        <TauriTopNavbar />
        
        {/* 主要内容区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 侧边栏 */}
          <TauriSidebar />
          
          {/* 编辑器区域 */}
          <div className="flex-1 flex flex-col">
            <TauriEditor />
          </div>
        </div>
        
        {/* 底部状态栏 */}
        <TauriStatusBar />
      </div>
    </TauriAppProvider>
  );
}

export default TauriApp;