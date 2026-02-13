import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// ============================================
// 프로덕션 콘솔 보안 처리
// ============================================
if (process.env.NODE_ENV === 'production') {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  // 모든 콘솔 출력 비활성화
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};

  // 고정 메시지
  originalConsole.log(
    '%cCover Letters, Democratized.%c\nDeepGL.',
    'color: #007AFF; font-size: 20px; font-weight: 700;',
    'color: #86868B; font-size: 14px; font-weight: 500;'
  );

  // 비밀 명령어로 콘솔 복원
  window.unlock_praisethelord = () => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
    console.log('%c✅ 콘솔 로그 활성화됨', 'color: #34C759; font-weight: 700;');
    return 'unlocked';
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
