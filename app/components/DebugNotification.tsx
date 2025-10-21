// components/DebugNotification.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface DebugMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

const DebugNotification: React.FC = () => {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Global function তৈরি করছি যেখান থেকে call করা যাবে
    (window as any).showDebug = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const newMessage: DebugMessage = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date()
      };
      
      setMessages(prev => [newMessage, ...prev.slice(0, 9)]); // সর্বোচ্চ 10টি message
      
      // 5 second পর auto remove
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }, 5000);
    };

    // Cleanup
    return () => {
      delete (window as any).showDebug;
    };
  }, []);

  const removeMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-[1000] max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-2">
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          <span className="font-bold text-sm">Debug Console</span>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ✕
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No debug messages
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={`p-3 border-b border-gray-100 text-sm ${
                  msg.type === 'error' ? 'bg-red-50 border-red-200' :
                  msg.type === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${
                    msg.type === 'error' ? 'text-red-700' :
                    msg.type === 'success' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {msg.type.toUpperCase()}
                  </span>
                  <button 
                    onClick={() => removeMessage(msg.id)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-800 break-words">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
        
        {messages.length > 0 && (
          <div className="p-2 border-t border-gray-200 text-center">
            <button 
              onClick={() => setMessages([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugNotification;