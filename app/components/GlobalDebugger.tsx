// components/GlobalDebugger.tsx - COMPLETE VERSION
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

interface DebugData {
  page: string;
  url: string;
  timestamp: string;
  components: string[];
  states: Record<string, any>;
  cartInfo: any;
  userInfo: any;
  errors: string[];
  performance: any;
  localStorageData: any;
  sessionStorageData: any;
  networkRequests: any[];
  contextStatus: {
    cartContext: boolean;
    authContext: boolean;
  };
  featureFlags: {
    cartSummary: boolean;
    sidebar: boolean;
    notifications: boolean;
  };
}

const GlobalDebugger: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'cart' | 'user' | 'performance' | 'storage' | 'raw'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [errorLog, setErrorLog] = useState<string[]>([]);
  
  const { cart, totalItems, totalPrice } = useCart();
  const { user, isAdmin } = useAuth();

  const autoRefreshRef = useRef<NodeJS.Timeout>();

  // Error monitoring
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: any[]) => {
      const errorMsg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setErrorLog(prev => [...prev.slice(-49), `ERROR: ${errorMsg}`]);
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const warnMsg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setErrorLog(prev => [...prev.slice(-49), `WARN: ${warnMsg}`]);
      originalConsoleWarn.apply(console, args);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      setErrorLog(prev => [...prev.slice(-49), `GLOBAL ERROR: ${event.message} at ${event.filename}:${event.lineno}`]);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      setErrorLog(prev => [...prev.slice(-49), `PROMISE REJECTION: ${event.reason}`]);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && isPanelOpen) {
      autoRefreshRef.current = setInterval(() => {
        const data = gatherDebugInfo();
        setDebugData(data);
      }, 2000);
    } else {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    }

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [autoRefresh, isPanelOpen]);

  const gatherDebugInfo = (): DebugData => {
    // Performance data
    const performanceInfo = {
      loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A',
      memory: (performance as any).memory || 'Not available',
      navigation: performance.getEntriesByType('navigation')[0] || 'Not available',
      now: performance.now(),
      timeOrigin: performance.timeOrigin
    };

    // Storage data
    const localStorageData: any = {};
    const sessionStorageData: any = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            localStorageData[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            localStorageData[key] = localStorage.getItem(key);
          }
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          try {
            sessionStorageData[key] = JSON.parse(sessionStorage.getItem(key) || '');
          } catch {
            sessionStorageData[key] = sessionStorage.getItem(key);
          }
        }
      }
    } catch (e) {
      console.log('Storage access blocked');
    }

    // Network requests (last 10)
    const networkRequests = performance.getEntriesByType('resource')
      .slice(-10)
      .map((entry: any) => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: entry.initiatorType
      }));

    // Context data
    const cartInfo = {
      source: 'context',
      totalItems,
      totalPrice,
      cartItems: cart,
      itemCount: cart.length,
      timestamp: new Date().toISOString()
    };

    const userInfo = {
      source: 'context', 
      user: user,
      isAdmin: isAdmin,
      isLoggedIn: !!user,
      userEmail: user?.email,
      userName: user?.displayName,
      timestamp: new Date().toISOString()
    };

    // Feature flags detection
    const featureFlags = {
      cartSummary: !!document.querySelector('.cart-summary, [class*="CartSummary"]'),
      sidebar: !!document.querySelector('.cart-sidebar, .sidebar, [class*="Sidebar"]'),
      notifications: !!document.querySelector('[class*="Toast"], [class*="Notification"]')
    };

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
        .slice(0, 50),
      states: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        cookies: navigator.cookieEnabled,
        online: navigator.onLine,
        platform: navigator.platform,
        vendor: navigator.vendor,
      },
      cartInfo,
      userInfo,
      errors: errorLog,
      performance: performanceInfo,
      localStorageData,
      sessionStorageData,
      networkRequests,
      contextStatus: {
        cartContext: true,
        authContext: true,
      },
      featureFlags
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
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setCopyStatus('');
    setAutoRefresh(false);
  };

  const refreshData = () => {
    const data = gatherDebugInfo();
    setDebugData(data);
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

      if (event.key === 'F5' && isPanelOpen) {
        event.preventDefault();
        refreshData();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPanelOpen]);

  const clearErrorLog = () => {
    setErrorLog([]);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    refreshData();
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    refreshData();
  };

  return (
    <>
      {/* Global Debug Button */}
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
            className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600 text-white">
              <div>
                <h2 className="text-xl font-bold">🐛 Global Debug System</h2>
                <p className="text-sm opacity-90">Automatically works on every page • Real-time monitoring</p>
              </div>
              <div className="flex items-center space-x-3">
                {copyStatus && (
                  <span className="text-green-300 text-sm font-medium bg-green-800 px-3 py-1 rounded-full">
                    ✅ {copyStatus}
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded"
                    />
                    <span>Auto Refresh</span>
                  </label>
                  <button
                    onClick={refreshData}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    title="Refresh Data (F5)"
                  >
                    🔄
                  </button>
                  <button
                    onClick={copyAllData}
                    className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 text-sm font-bold border border-white"
                  >
                    📋 Copy All
                  </button>
                </div>
                <button
                  onClick={closePanel}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex space-x-1 px-4">
                {['overview', 'cart', 'user', 'performance', 'storage', 'raw'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-white text-red-600 border-t border-l border-r border-gray-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'overview' && '📊 Overview'}
                    {tab === 'cart' && '🛒 Cart'}
                    {tab === 'user' && '👤 User'}
                    {tab === 'performance' && '⚡ Performance'}
                    {tab === 'storage' && '💾 Storage'}
                    {tab === 'raw' && '📄 Raw Data'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-gray-50">
              {debugData && (
                <div className="space-y-6">
                  
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-blue-600">{debugData.components.length}</div>
                          <div className="text-sm text-gray-600">Components</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-green-600">{debugData.states.screenWidth}px</div>
                          <div className="text-sm text-gray-600">Screen Width</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-purple-600">{debugData.cartInfo.totalItems}</div>
                          <div className="text-sm text-gray-600">Cart Items</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-orange-600">{debugData.cartInfo.itemCount}</div>
                          <div className="text-sm text-gray-600">Products</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-red-600">{debugData.errors.length}</div>
                          <div className="text-sm text-gray-600">Errors</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {debugData.userInfo.isLoggedIn ? 'Yes' : 'No'}
                          </div>
                          <div className="text-sm text-gray-600">Logged In</div>
                        </div>
                      </div>

                      {/* Context Status */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">🔧 System Status</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded text-center bg-green-100 text-green-800">
                            <div className="font-bold">Cart Context</div>
                            <div>✅ Available</div>
                          </div>
                          <div className="p-3 rounded text-center bg-green-100 text-green-800">
                            <div className="font-bold">Auth Context</div>
                            <div>✅ Available</div>
                          </div>
                          <div className={`p-3 rounded text-center ${debugData.featureFlags.cartSummary ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <div className="font-bold">Cart Summary</div>
                            <div>{debugData.featureFlags.cartSummary ? '✅ Detected' : '⚠️ Not Found'}</div>
                          </div>
                          <div className={`p-3 rounded text-center ${debugData.featureFlags.sidebar ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <div className="font-bold">Sidebar</div>
                            <div>{debugData.featureFlags.sidebar ? '✅ Detected' : '⚠️ Not Found'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Page & Device Info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-3">📄 Page Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Page:</span> {debugData.page}</p>
                            <p><span className="font-medium">URL:</span> <span className="text-xs break-all">{debugData.url}</span></p>
                            <p><span className="font-medium">Time:</span> {debugData.timestamp}</p>
                            <p><span className="font-medium">User Agent:</span> <span className="text-xs break-all">{debugData.states.userAgent}</span></p>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-3">📱 Device Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Viewport:</span> {debugData.states.viewport}</p>
                            <p><span className="font-medium">Language:</span> {debugData.states.language}</p>
                            <p><span className="font-medium">Platform:</span> {debugData.states.platform}</p>
                            <p><span className="font-medium">Online:</span> {debugData.states.online ? '✅ Yes' : '❌ No'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Error Log */}
                      {debugData.errors.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800">❌ Error Log ({debugData.errors.length})</h3>
                            <button
                              onClick={clearErrorLog}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {debugData.errors.map((error, index) => (
                              <div key={index} className="text-xs bg-red-50 p-2 rounded border border-red-200">
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                        {/* Cart Tab */}
                  {activeTab === 'cart' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">🛒 Cart Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{debugData.cartInfo.totalItems}</div>
                            <div className="text-sm text-blue-800">Total Items</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">{debugData.cartInfo.totalPrice} ৳</div>
                            <div className="text-sm text-green-800">Total Price</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{debugData.cartInfo.itemCount}</div>
                            <div className="text-sm text-purple-800">Products</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xl font-bold text-orange-600">{debugData.cartInfo.cartItems.length}</div>
                            <div className="text-sm text-orange-800">Cart Entries</div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-gray-700 mb-2">Cart Items:</h4>
                        <div className="max-h-64 overflow-y-auto">
                          {debugData.cartInfo.cartItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 border-b border-gray-100">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Price: {item.price} ৳ × {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{item.price * item.quantity} ৳</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Tab */}
                  {activeTab === 'user' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">👤 User Information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className={`p-3 rounded text-center ${debugData.userInfo.isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            <div className="font-bold">Status</div>
                            <div>{debugData.userInfo.isLoggedIn ? '✅ Logged In' : '❌ Logged Out'}</div>
                          </div>
                          <div className={`p-3 rounded text-center ${debugData.userInfo.isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            <div className="font-bold">Admin</div>
                            <div>{debugData.userInfo.isAdmin ? '✅ Yes' : '❌ No'}</div>
                          </div>
                        </div>
                        
                        {debugData.userInfo.isLoggedIn && (
                          <div className="space-y-2">
                            <p><span className="font-medium">Email:</span> {debugData.userInfo.userEmail || 'N/A'}</p>
                            <p><span className="font-medium">Name:</span> {debugData.userInfo.userName || 'N/A'}</p>
                            <p><span className="font-medium">User ID:</span> {debugData.userInfo.user?.uid || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Tab */}
                  {activeTab === 'performance' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">⚡ Performance Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{debugData.performance.loadTime}ms</div>
                            <div className="text-sm text-blue-800">Load Time</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{Math.round(debugData.performance.now())}ms</div>
                            <div className="text-sm text-green-800">Performance Now</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{debugData.networkRequests.length}</div>
                            <div className="text-sm text-purple-800">Network Requests</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">🌐 Network Requests</h3>
                        <div className="max-h-48 overflow-y-auto">
                          {debugData.networkRequests.map((request, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border-b border-gray-100 text-sm">
                              <div className="flex-1 truncate">
                                <span className="font-medium">{request.type}:</span> 
                                <span className="text-gray-600 ml-1 truncate">{request.name.split('/').pop()}</span>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                {Math.round(request.duration)}ms
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storage Tab */}
                  {activeTab === 'storage' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-800">💾 Local Storage</h3>
                          <button
                            onClick={clearLocalStorage}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {Object.entries(debugData.localStorageData).map(([key, value]) => (
                            <div key={key} className="p-2 border-b border-gray-100">
                              <div className="font-medium text-sm">{key}</div>
                              <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-800">💿 Session Storage</h3>
                          <button
                            onClick={clearSessionStorage}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {Object.entries(debugData.sessionStorageData).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No session storage data</p>
                          ) : (
                            Object.entries(debugData.sessionStorageData).map(([key, value]) => (
                              <div key={key} className="p-2 border-b border-gray-100">
                                <div className="font-medium text-sm">{key}</div>
                                <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw Data Tab */}
                  {activeTab === 'raw' && (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">📄 Complete Raw Data</h3>
                        <pre className="text-xs bg-gray-50 p-3 rounded border max-h-96 overflow-y-auto">
                          {JSON.stringify(debugData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Shortcuts:</span> 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">Shift</kbd> + 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">D</kbd> • 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">F5</kbd> Refresh • 
                <kbd className="mx-1 px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> Close
              </div>
              <div className="flex space-x-2">
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

export default GlobalDebugger;