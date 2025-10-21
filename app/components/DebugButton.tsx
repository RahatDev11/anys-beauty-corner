// components/DebugButton.tsx - WITH COPY FEATURE
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
}

const DebugButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');

  const gatherDebugInfo = (): DebugData => {
    // Cart data from context (যদি available থাকে)
    const cartContext = (window as any).cartContext || {};
    const authContext = (window as any).authContext || {};
    
    return {
      page: window.location.pathname,
      url: window.location.href,
      timestamp: new Date().toLocaleString(),
      components: Array.from(document.querySelectorAll('*[class]'))
        .map(el => el.className.split(' ')[0])
        .filter((name, index, self) => name && self.indexOf(name) === index)
        .slice(0, 20),
      states: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
      cartInfo: {
        totalItems: cartContext.totalItems || 0,
        totalPrice: cartContext.totalPrice || 0,
        cartItems: cartContext.cart || [],
        ...((window as any).cartData || {})
      },
      userInfo: {
        isLoggedIn: authContext.user || false,
        user: authContext.user || null,
        isAdmin: authContext.isAdmin || false,
        ...((window as any).userData || {})
      }
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      // Fallback for older browsers
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

  const copySection = (data: any, title: string) => {
    const text = JSON.stringify(data, null, 2);
    copyToClipboard(text);
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
    console.log('🔍 DEBUG DATA:', data);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setCopyStatus('');
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  return (
    <>
      {/* Debug Button */}
      <button
        onClick={handleDebugClick}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Debug Information"
      >
        <span className="text-lg font-bold">🔍</span>
      </button>

      {/* Debug Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">🔍 Debug Information</h2>
              <div className="flex items-center space-x-2">
                {copyStatus && (
                  <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                    ✅ {copyStatus}
                  </span>
                )}
                <button
                  onClick={copyAllData}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={closePanel}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {debugData && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-blue-800">📄 Page Information</h3>
                        <button
                          onClick={() => copySection({
                            page: debugData.page,
                            url: debugData.url,
                            timestamp: debugData.timestamp
                          }, "Page Info")}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <p><strong>Page:</strong> {debugData.page}</p>
                      <p><strong>URL:</strong> {debugData.url}</p>
                      <p><strong>Time:</strong> {debugData.timestamp}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-green-800">📱 Device Information</h3>
                        <button
                          onClick={() => copySection(debugData.states, "Device Info")}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <p><strong>Screen:</strong> {debugData.states.screenWidth} x {debugData.states.screenHeight}</p>
                      <p><strong>Viewport:</strong> {debugData.states.viewport}</p>
                      <p><strong>Components:</strong> {debugData.components.length}</p>
                    </div>
                  </div>

                  {/* Components List */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-purple-800">🧩 Components on Page</h3>
                      <button
                        onClick={() => copySection(debugData.components, "Components")}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {debugData.components.map((component, index) => (
                        <span 
                          key={index}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cart Information */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-yellow-800">🛒 Cart Information</h3>
                      <button
                        onClick={() => copySection(debugData.cartInfo, "Cart Info")}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <pre className="text-sm bg-white p-3 rounded border max-h-40 overflow-y-auto">
                      {JSON.stringify(debugData.cartInfo, null, 2)}
                    </pre>
                  </div>

                  {/* User Information */}
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-indigo-800">👤 User Information</h3>
                      <button
                        onClick={() => copySection(debugData.userInfo, "User Info")}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <pre className="text-sm bg-white p-3 rounded border max-h-40 overflow-y-auto">
                      {JSON.stringify(debugData.userInfo, null, 2)}
                    </pre>
                  </div>

                  {/* Raw Data */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">📊 Raw Debug Data</h3>
                      <button
                        onClick={copyAllData}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        📋 Copy All
                      </button>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border max-h-40 overflow-y-auto">
                      {JSON.stringify(debugData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Click outside or press ESC to close
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log('🔍 DEBUG DATA:', debugData);
                    setCopyStatus('Logged to Console!');
                    setTimeout(() => setCopyStatus(''), 2000);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  📝 Log to Console
                </button>
                <button
                  onClick={copyAllData}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                >
                  📋 Copy All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugButton;