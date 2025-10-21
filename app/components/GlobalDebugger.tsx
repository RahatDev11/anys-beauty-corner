// components/GlobalDebugger.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface DebugData {
  page: string;
  url: string;
  timestamp: string;
  components: string[];
  states: Record<string, any>;
  cartInfo?: any;
  userInfo?: any;
  errors: string[];
  performance: any;
  localStorageData: any;
  sessionStorageData: any;
}

const GlobalDebugger: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');

  // Global error handler
  useEffect(() => {
    const originalConsoleError = console.error;
    const errors: string[] = [];

    console.error = (...args: any[]) => {
      errors.push(args.join(' '));
      originalConsoleError.apply(console, args);
    };

    // Global error listener
    const handleGlobalError = (event: ErrorEvent) => {
      errors.push(`Global Error: ${event.message} at ${event.filename}:${event.lineno}`);
    };

    // Promise rejection listener
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      errors.push(`Promise Rejection: ${event.reason}`);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  const gatherDebugInfo = (): DebugData => {
    // Performance data
    const performanceInfo = {
      loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A',
      memory: (performance as any).memory || 'Not available',
      navigation: performance.getEntriesByType('navigation')[0] || 'Not available'
    };

    // Storage data
    const localStorageData: any = {};
    const sessionStorageData: any = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          sessionStorageData[key] = sessionStorage.getItem(key);
        }
      }
    } catch (e) {
      console.log('Storage access blocked');
    }

    return {
      page: window.location.pathname,
      url: window.location.href,
      timestamp: new Date().toLocaleString(),
      components: Array.from(document.querySelectorAll('*[class]'))
        .map(el => {
          const classes = el.className.split(' ');
          return classes[0] || el.tagName.toLowerCase();
        })
        .filter((name, index, self) => name && self.indexOf(name) === index)
        .slice(0, 30),
      states: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        cookies: navigator.cookieEnabled,
        online: navigator.onLine,
      },
      cartInfo: (window as any).cartContext || (window as any).cartData || 'Not available',
      userInfo: (window as any).authContext || (window as any).userData || 'Not available',
      errors: [], // Will be populated by error handlers
      performance: performanceInfo,
      localStorageData,
      sessionStorageData
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const copyAllData = () => {
    if (debugData) {
      const allData = JSON.stringify(debugData, null, 2);
      copyToClipboard(allData);
    }
  };

  const handleDebugClick = () => {
    const data = gatherDebugInfo();
    setDebugData(data);
    setIsPanelOpen(true);
    console.log('🔍 GLOBAL DEBUG DATA:', data);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setCopyStatus('');
  };

  // Keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        handleDebugClick();
      }
      
      if (event.key === 'Escape' && isPanelOpen) {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPanelOpen]);

  // Auto-detect common issues
  useEffect(() => {
    const checkForIssues = () => {
      const issues = [];
      
      // Check if cart context is available
      if (!(window as any).cartContext && !(window as any).cartData) {
        issues.push('Cart context not found');
      }
      
      // Check if auth context is available
      if (!(window as any).authContext && !(window as any).userData) {
        issues.push('Auth context not found');
      }
      
      // Check for console errors
      if (typeof console._errorCount !== 'undefined' && console._errorCount > 0) {
        issues.push(`Console errors: ${console._errorCount}`);
      }
      
      return issues;
    };

    // Periodically check for issues (optional)
    const interval = setInterval(() => {
      const issues = checkForIssues();
      if (issues.length > 0 && !isPanelOpen) {
        console.log('⚠️ Potential issues detected:', issues);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPanelOpen]);

  return (
    <>
      {/* Global Debug Button - Always visible */}
      <button
        onClick={handleDebugClick}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        title="Global Debug (Ctrl+Shift+D)"
      >
        <span className="text-xl font-bold">🐛</span>
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          D
        </span>
      </button>

      {/* Debug Panel */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={closePanel}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600 text-white">
              <div>
                <h2 className="text-xl font-bold">🐛 Global Debug System</h2>
                <p className="text-sm opacity-90">Automatically works on every page</p>
              </div>
              <div className="flex items-center space-x-3">
                {copyStatus && (
                  <span className="text-green-300 text-sm font-medium bg-green-800 px-3 py-1 rounded-full">
                    ✅ {copyStatus}
                  </span>
                )}
                <button
                  onClick={copyAllData}
                  className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 text-sm font-bold border border-white"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={closePanel}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh] bg-gray-50">
              {debugData && (
                <div className="space-y-6">
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">{debugData.components.length}</div>
                      <div className="text-sm text-gray-600">Components</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-green-600">{debugData.states.screenWidth}px</div>
                      <div className="text-sm text-gray-600">Screen Width</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {debugData.cartInfo && debugData.cartInfo.totalItems ? debugData.cartInfo.totalItems : 0}
                      </div>
                      <div className="text-sm text-gray-600">Cart Items</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {debugData.userInfo && debugData.userInfo.user ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">Logged In</div>
                    </div>
                  </div>

                  {/* Main Data Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Page Info */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          📄 Page Information
                          <button
                            onClick={() => copyToClipboard(JSON.stringify({
                              page: debugData.page,
                              url: debugData.url,
                              timestamp: debugData.timestamp
                            }, null, 2))}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋
                          </button>
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Page:</span> {debugData.page}</p>
                          <p><span className="font-medium">URL:</span> {debugData.url}</p>
                          <p><span className="font-medium">Time:</span> {debugData.timestamp}</p>
                        </div>
                      </div>

                      {/* Device Info */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          📱 Device & Browser
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(debugData.states, null, 2))}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋
                          </button>
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Viewport:</span> {debugData.states.viewport}</p>
                          <p><span className="font-medium">Language:</span> {debugData.states.language}</p>
                          <p><span className="font-medium">Online:</span> {debugData.states.online ? 'Yes' : 'No'}</p>
                          <p><span className="font-medium">Cookies:</span> {debugData.states.cookies ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>

                      {/* Components */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          🧩 Components ({debugData.components.length})
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(debugData.components, null, 2))}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋
                          </button>
                        </h3>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {debugData.components.map((component, index) => (
                            <span 
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {component}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Cart Info */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          🛒 Cart Information
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(debugData.cartInfo, null, 2))}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋
                          </button>
                        </h3>
                        <pre className="text-xs bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                          {JSON.stringify(debugData.cartInfo, null, 2)}
                        </pre>
                      </div>

                      {/* User Info */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          👤 User Information
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(debugData.userInfo, null, 2))}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋
                          </button>
                        </h3>
                        <pre className="text-xs bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                          {JSON.stringify(debugData.userInfo, null, 2)}
                        </pre>
                      </div>

                      {/* Storage Info */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          💾 Storage Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-1">Local Storage</h4>
                            <pre className="text-xs bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                              {Object.keys(debugData.localStorageData).length} items
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Session Storage</h4>
                            <pre className="text-xs bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                              {Object.keys(debugData.sessionStorageData).length} items
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Raw Data */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      📊 Complete Raw Data
                      <button
                        onClick={copyAllData}
                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        📋 Copy All
                      </button>
                    </h3>
                    <pre className="text-xs bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                      {JSON.stringify(debugData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Shortcuts:</span> 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">Shift</kbd> + 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">D</kbd> to open • 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> to close
              </div>
              <button
                onClick={() => {
                  console.log('🔍 GLOBAL DEBUG DATA:', debugData);
                  setCopyStatus('Logged to Console!');
                  setTimeout(() => setCopyStatus(''), 2000);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                📝 Log to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalDebugger;