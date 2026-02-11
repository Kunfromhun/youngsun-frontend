// DEPLOY TEST 20260109
/// Section 1: Initial Setup and State Management for App.js (딥글 글래스모피즘 버전)
// This section includes imports, initial state, reducer, and state declarations
// Attach this section first when reconstructing App.js
import React, { useState, useReducer, useRef, useEffect, useCallback } from 'react';
import { authFetch } from './lib/api';
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';import './App.css';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import IntroPage from './pages/IntroPage';
import LandingPage from './pages/LandingPage';
import MyPage from './pages/MyPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DatabasePage from './pages/DatabasePage';
import CompanyFolderPage from './pages/CompanyFolderPage';
import EpisodeListPage from './pages/EpisodeListPage';
import CoverLetterListPage from './pages/CoverLetterListPage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import CoverLetterDetailPage from './pages/CoverLetterDetailPage';
import SearchPage from './pages/SearchPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DGLCChargePage from './pages/DGLCChargePage';
import DGLCSuccessPage from './pages/DGLCSuccessPage';
import DGLCFailPage from './pages/DGLCFailPage';
import GlobalFooter from './pages/GlobalFooter';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';
// ============================================
// ✅ 한국어 조사 처리 유틸리티
// ============================================

/**
 * 한글 문자의 받침(종성) 유무를 확인
 * @param {string} word - 검사할 단어
 * @returns {boolean} - 마지막 글자에 받침이 있으면 true
 */
const hasFinalConsonant = (word) => {
  if (!word || typeof word !== 'string') return false;
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  
  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code < 0xAC00 || code > 0xD7A3) return false;
  
  // 받침 여부: (코드 - 0xAC00) % 28 === 0 이면 받침 없음
  return (code - 0xAC00) % 28 !== 0;
};

/**
 * 단어에 맞는 조사를 반환
 * @param {string} word - 단어
 * @param {string} particleType - 조사 타입: '이/가', '은/는', '을/를', '와/과', '로/으로'
 * @returns {string} - 적절한 조사
 */
const getParticle = (word, particleType) => {
  const hasBatchim = hasFinalConsonant(word);
  
  const particles = {
    '이/가': hasBatchim ? '이' : '가',
    '은/는': hasBatchim ? '은' : '는',
    '을/를': hasBatchim ? '을' : '를',
    '와/과': hasBatchim ? '과' : '와',
    '로/으로': hasBatchim ? '으로' : '로',
  };
  
  return particles[particleType] || '';
};

// ============================================
// ✅ 브라우저 알림 유틸리티
// ============================================

/**
 * 알림 권한 요청
 * @returns {Promise<string>} - 'granted', 'denied', 'default'
 */
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
};

/**
 * 브라우저 알림 발송
 * @param {string} title - 알림 제목
 * @param {string} body - 알림 내용
 */
const sendNotification = (title, body) => {
  // 1. 탭 타이틀 변경 (권한 없어도 동작)
  const originalTitle = document.title;
  document.title = `✅ ${title}`;
  
  setTimeout(() => {
    document.title = originalTitle;
  }, 5000);
  
  // 2. 브라우저 알림 (권한 있을 때만)
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'deepgl-notification',
      requireInteraction: false,
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // 5초 후 자동 닫기
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

// 반원 + 십자가 로고 컴포넌트 (개선된 버전)
const BrainCrossLogo = ({ size = 150, showCross = true }) => {
  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <defs>
          <filter id="glassFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
          </filter>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
       
        {/* 단순한 원형 배경 */}
        <circle
          cx="100" cy="100" r="80"
          fill="url(#circleGradient)"
          stroke="rgba(107, 114, 128, 0.5)"
          strokeWidth="2"
          filter="url(#glassFilter)"
        />
       
        {/* 외곽 글로우 */}
        <circle
          cx="100" cy="100" r="85"
          fill="none"
          stroke="rgba(107, 114, 128, 0.1)"
          strokeWidth="1"
        />
       
        {/* 십자가 */}
        {showCross && (
          <>
            <rect
              x="92" y="40"
              width="16" height="120"
              fill="rgba(74, 85, 104, 0.8)"
              rx="8"
            />
            <rect
              x="40" y="92"
              width="120" height="16"
              fill="rgba(74, 85, 104, 0.8)"
              rx="8"
            />
          </>
        )}
      </svg>
    </div>
  );
};

// 인트로 애니메이션 컴포넌트 (수정된 버전: 원과 십자가가 굴러들어와서 합체)
const IntroAnimation = ({ onComplete }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
 
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setAnimationStarted(true);
    }, 50);
   
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000);
   
    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
 
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#FBFBFD'
    }}>
     
      {/* CSS 애니메이션을 위한 스타일 태그 */}
      <style >{`
        @keyframes rollFromLeft {
          0% { transform: translate(-50%, -50%) translateX(-400px) rotate(-720deg); opacity: 0; }
          100% { transform: translate(-50%, -50%) translateX(0) rotate(0deg); opacity: 1; }
        }
       
        @keyframes rollFromRight {
          0% { transform: translate(-50%, -50%) translateX(400px) rotate(720deg); opacity: 0; }
          100% { transform: translate(-50%, -50%) translateX(0) rotate(0deg); opacity: 1; }
        }
       
        @keyframes fastSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(3600deg); opacity: 1; }
        }
       
        @keyframes hideElement {
          to { opacity: 0; visibility: hidden; }
        }
       
        @keyframes fadeIn {
          to { opacity: 1; }
        }
       
        @keyframes letterFadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
       
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
       
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(107, 114, 128, 0.3)); }
          50% { filter: drop-shadow(0 0 30px rgba(107, 114, 128, 0.5)); }
        }
       
        .circle-element {
          opacity: 0;
          ${animationStarted ? 'animation: rollFromLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;' : ''}
        }
       
        .cross-element {
          opacity: 0;
          ${animationStarted ? 'animation: rollFromRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;' : ''}
        }
       
        .cross-combined {
          opacity: 0;
          ${animationStarted ? 'animation: fadeIn 0.2s ease 2.5s forwards, fastSpin 3s cubic-bezier(0.25, 0.8, 0.8, 1) 3s forwards, hideElement 0.3s ease 6s forwards;' : ''}
        }
       
        .final-logo {
          opacity: 0;
          ${animationStarted ? 'animation: fadeIn 0.5s ease 6s forwards, glow 2s ease-in-out 6.5s infinite;' : ''}
        }
       
        .deepgl-letter {
          opacity: 0;
          display: inline-block;
          background: linear-gradient(135deg, #4A5568, #2D3748);
          background-clip: text;
          -webkit-background-clip: text;
          color: #4A5568;
          -webkit-text-fill-color: transparent;
          z-index: 10;
        }
       
        .deepgl-letter-1 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 5.2s forwards;' : ''} }
        .deepgl-letter-2 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 5.4s forwards;' : ''} }
        .deepgl-letter-3 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 5.6s forwards;' : ''} }
        .deepgl-letter-4 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 5.8s forwards;' : ''} }
        .deepgl-letter-5 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 6.0s forwards;' : ''} }
        .deepgl-letter-6 { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 6.2s forwards;' : ''} }
       
        .start-button-animated {
          opacity: 0;
          ${animationStarted ? 'animation: slideUp 0.6s ease 5.5s forwards;' : ''}
        }

        .start-screen .final-logo {
          cursor: pointer;
          will-change: transform, opacity;
          transition: transform 160ms cubic-bezier(.2,.6,.2,1),
                      filter 160ms cubic-bezier(.2,.6,.2,1);
        }
        .start-screen .final-logo:hover {
          transform: translate(-50%, -50%) scale(1.04) !important;
          filter: none;
        }
        .start-screen .final-logo::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.88);
          width: 220px;
          height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(0,0,0,0) 58%,
            rgba(107,114,128,0.28) 60%,
            rgba(107,114,128,0.18) 70%,
            rgba(0,0,0,0) 75%
          );
          opacity: 0;
          animation: softPulse 3.6s ease-out infinite;
        }
        .start-screen .final-logo::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.92);
          width: 220px;
          height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(0,0,0,0) 62%,
            rgba(107,114,128,0.22) 64%,
            rgba(107,114,128,0.12) 74%,
            rgba(0,0,0,0) 79%
          );
          opacity: 0;
          animation: softPulse 3.6s ease-out infinite;
          animation-delay: 1.8s;
        }
        @keyframes microBreath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.006); }
        }
        @keyframes softPulse {
          0% { transform: translate3d(-50%, -50%, 0) scale(0.88); opacity: 0; }
          8% { opacity: .25; }
          22% { transform: translate3d(-50%, -50%, 0) scale(0.98); opacity: .38; }
          38% { transform: translate3d(-50%, -50%, 0) scale(1.06); opacity: .22; }
          58% { transform: translate3d(-50%, -50%, 0) scale(1.14); opacity: .12; }
          78% { transform: translate3d(-50%, -50%, 0) scale(1.22); opacity: .06; }
          100% { transform: translate3d(-50%, -50%, 0) scale(1.28); opacity: 0; }
        }
        .start-screen .final-logo:hover::before,
        .start-screen .final-logo:hover::after {
          animation-duration: 2.6s;
        }
        @media (prefers-reduced-motion: reduce) {
          .start-screen .final-logo,
          .start-screen .final-logo::before,
          .start-screen .final-logo::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
     
      {/* 왼쪽에서 굴러오는 원 (200px로 확대) */}
      <svg
        className="circle-element"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <circle
          cx="100" cy="100" r="80"
          fill="rgba(156, 163, 175, 0.3)"
          stroke="rgba(107, 114, 128, 0.5)"
          strokeWidth="2"
        />
      </svg>
     
      {/* 오른쪽에서 굴러오는 십자가 (200px로 확대) */}
      <svg
        className="cross-element"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </svg>
     
      {/* 합체된 십자가 (빠른 회전용, 200px로 확대) - 배경색 제거 */}
      <div
        className="cross-combined"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px'
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transformOrigin: 'center center' }}>
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="rgba(107, 114, 128, 0.5)"
            strokeWidth="2"
          />
          <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.9)" rx="8"/>
          <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.9)" rx="8"/>
        </svg>
      </div>
     
      {/* 최종 로고 */}
      <div
        className="final-logo"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <BrainCrossLogo size={200} showCross={true} />
      </div>
     
      {/* DEEPGL 텍스트 박스 */}
      <div
        translate="no"
        style={{
          position: 'absolute',
          top: 'calc(100% - 60px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(251, 251, 253, 0.95)',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          fontSize: '36px',
          fontWeight: '800',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: '-apple-system, "SF Pro Display", sans-serif',
          zIndex: 10
        }}
      >
        {['D','E','E','P','G','L'].map((letter, i) => (
          <span
            key={i}
            className={`deepgl-letter deepgl-letter-${i + 1}`}
          >
            {letter}
          </span>
        ))}
      </div>
     
      {/* 시작 버튼 */}
      <button
        className="button-primary intro-button start-button-animated"
        onClick={onComplete}
        style={{
          position: 'absolute',
          bottom: '80px',
          padding: '16px 36px',
          fontSize: '18px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, rgba(74, 85, 104, 0.9), rgba(74, 85, 104, 0.8))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '14px',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(74, 85, 104, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 15px 40px rgba(74, 85, 104, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 10px 30px rgba(74, 85, 104, 0.3)';
        }}
      >
        딥글과 시작하기
      </button>
    </div>
  );
};

// 글래스모피즘 로고 컴포넌트 (애니메이션 완료 후 사용)
const DeepGlLogo = ({ size = 120 }) => (
  <div style={{
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }}>
    <BrainCrossLogo size={size} showCross={true} />
  </div>
);

// 글래스모피즘 아이콘//
const GlassIcon = ({ type, size = 24, style = {} }) => {
  const icons = {
    check: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    write: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 2l2.09 6.26L20 9l-4.91.74L12 16l-2.09-6.26L4 9l4.91-.74z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    document: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    analysis: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M9 11H7v8h2v-8zm4-4h-2v12h2V7zm4-2h-2v14h2V5z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    company: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    episodes: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    guide: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              fill="currentColor" opacity="0.8"/>
      </svg>
    )
  };
 
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ...style
    }}>
      {icons[type] || icons.sparkle}
    </div>
  );
};

// Enhanced Design System Constants with Glassmorphism
const DESIGN_TOKENS = {
  colors: {
    primary: '#4A5568',
    background: '#FBFBFD',
    surface: '#FFFFFF',
    textPrimary: '#1D1D1F',
    textSecondary: '#86868B',
    border: 'rgba(0,0,0,0.08)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBgHover: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassBorderHover: 'rgba(255, 255, 255, 0.3)',
  },
  blur: {
    light: '8px',
    medium: '15px',
    heavy: '25px',
    extra: '35px',
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  animation: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
};

const initialState = {
  resumeId: '',
  preAnalysisId: '',
  analysisId: '',
  analysisData: null,  // ← 이거 추가
  talentProfile: '',
  coreCompetency: '',
  companyInfo: { company: '', jobTitle: '', jobTasks: '', jobRequirements: '', questions: '', resumeFile: null, wordLimit: '' },
  plan: '',
  loading: false,
  chatLoading: false,
  loadingMessage: '',
  selectedExperiences: [],
  selectedExperiencesIndices: [],
  processing: '',
  nextStep: '',
  needsConfirmation: false,
  trendInfo: '',
  questionTopics: [],
  selectedForTopics: [],
  summarizedExperiences: [],
  preCompetencies: [],
  summarizedEpisodes: [],
  episodeAnalysis: [],
  coverLetterParagraphs: [],
  aiScreeningSuggestions: [],
  aiProofreadingSuggestions: [],
  coverLetterText: '',
  showProofreadingPopup: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRE_ANALYSIS':
      return {
        ...state,
        preAnalysisId: action.preAnalysisId || state.preAnalysisId,
        companyInfo: action.companyInfo || state.companyInfo,
        preCompetencies: action.preCompetencies || state.preCompetencies,
        questionTopics: action.questionTopics || state.questionTopics
      };
    case 'SET_ANALYSIS':
      const newResumeId = state.resumeId && !action.resumeId ? state.resumeId : action.resumeId || state.resumeId;
      console.log(`[${new Date().toISOString()}] SET_ANALYSIS: resumeId='${newResumeId}' exists`);
      localStorage.setItem('resumeId', newResumeId);
      return {
        ...state,
        resumeId: newResumeId,
        analysisId: action.analysisId || state.analysisId,
        analysisData: action.analysisData || state.analysisData,  // ← 이거 추가
        companyInfo: action.companyInfo || state.companyInfo,
        competencies: action.competencies || state.competencies,
        selectedExperiences: action.selectedExperiences || state.selectedExperiences,
        selectedExperiencesIndices: action.selectedExperiencesIndices || state.selectedExperiencesIndices,
        questionTopics: action.questionTopics || state.questionTopics,
        selectedForTopics: action.selectedForTopics || state.selectedForTopics,
        talentProfile: action.talentProfile || state.talentProfile,
        coreCompetency: action.coreCompetency || state.coreCompetency
      };
    case 'SET_PLAN':
      console.log(`[${new Date().toISOString()}] SET_PLAN: resumeId='${state.resumeId}' exists`);
      return {
        ...state,
        plan: action.plan,
        source: action.source,
        processing: action.processing,
        nextStep: action.nextStep,
        summarizedExperiences: action.summarizedExperiences || [],
        selectedExperiences: [],
        selectedExperiencesIndices: [],
        summarizedEpisodes: action.summarizedExperiences || state.summarizedEpisodes
      };
    case 'SET_COVER_LETTER':
      return { ...state, coverLetterParagraphs: action.paragraphs || state.coverLetterParagraphs };
    case 'SET_AI_SCREENING':
      return { ...state, aiScreeningSuggestions: action.suggestions || state.aiScreeningSuggestions };
    case 'SET_AI_PROOFREADING':
      return { ...state, aiProofreadingSuggestions: action.suggestions || state.aiProofreadingSuggestions };
    case 'SET_COVER_LETTER_TEXT':
      return { ...state, coverLetterText: action.text || state.coverLetterText };
    case 'SET_PROOFREADING_POPUP':
      return { ...state, showProofreadingPopup: action.show };
    case 'SET_LOADING':
      return { ...state, loading: action.loading, loadingMessage: action.message };
    case 'SET_CHAT_LOADING':
      return { ...state, chatLoading: action.chatLoading, loadingMessage: action.message || state.loadingMessage };
    case 'SET_CONFIRMATION':
      return { ...state, needsConfirmation: action.needsConfirmation };
    case 'SET_SUMMARIZED_EPISODES':
      return { ...state, summarizedEpisodes: action.summarizedEpisodes || state.summarizedEpisodes };
    case 'SET_EPISODE_ANALYSIS':
      return { ...state, episodeAnalysis: action.episodeAnalysis || state.episodeAnalysis };
    default:
      return state;
  }
};

const DeepglWordmark = () => (
  <div
    style={{
      display: 'flex',
      gap: '12px',
      fontSize: '36px',
      fontWeight: '800',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      fontFamily: '-apple-system, "SF Pro Display", sans-serif',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    {['D','E','E','P','G','L'].map((letter, i) => (
      <span
        key={i}
        className={`deepgl-letter deepgl-letter-${i + 1}`}
        style={{
          background: 'linear-gradient(135deg, #4A5568, #2D3748)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: '#4A5568',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {letter}
      </span>
    ))}
  </div>
);

// ✅ 동적 로딩 메시지 시스템 (엔드포인트별 interval 포함) - 조사 플레이스홀더 추가
const LOADING_STAGES = {
  'pre-analyze': {
    messages: [
      '{company}의 채용 공고 정보 수집 중...',
      '{company}의 직무 요구사항 분석 중...',
      '{company}{이/가} 원하는 인재상 파악 중...',
      'Perplexity AI로 최신 트렌드 검색 중...',
      '{company}에 필요한 핵심 역량 도출 중...'
    ],
    interval: 15000
  },
  'analyze-all': {
    messages: [
      '이력서 PDF 텍스트 추출 중...',
      '{company}의 요구사항과 이력서 매칭 중...',
      '관련 경험 추출 중...',
      '{company}에 적합한 역량 분석 중...',
      '최종 매칭 결과 정리 중...'
    ],
    interval: 15000
  },
  'suggest-direction': {
    messages: [
      '{topic} 주제에 맞는 경험 탐색 중...',
      '{company}의 인재상과 경험 연결 중...',
      '차별화 포인트 분석 중...',
      '최적의 방향성 도출 중...'
    ],
    interval: 15000
  },
  'generate-question': {
    messages: [
      '{topic} 관련 질문 생성 중...',
      '경험 구체화를 위한 핵심 포인트 분석 중...'
    ],
    interval: 15000
  },
  'generate-episode': {
    messages: [
      '대화 내용 분석 중...',
      '{topic} 에피소드 구조화 중...',
      'STAR 기법으로 에피소드 정리 중...',
      '핵심 키워드 추출 중...'
    ],
    interval: 30000
  },
  'generate-plan': {
    messages: [
      '{company} 맞춤 자소서 구조 설계 중...',
      '에피소드 활용 전략 수립 중...',
      '문단별 역할 배분 중...',
      'Master Instructions 생성 중...',
      '{company}{와/과}의 연결성 전략 최적화 중...'
    ],
    interval: 30000
  },
  'generate-cover-letter': {
    messages: [
      '{company} 맞춤 자소서 작성 시작...',
      '문단 1 작성 중...',
      '문단 2 작성 중...',
      '문단 3 작성 중...',
      '전체 흐름 검토 중...'
    ],
    interval: 15000
  },
  'edit-cover-letter': {
    messages: [
      '자소서 문장별 분석 중...',
      '어색한 표현 탐지 중...',
      'AI 문체 자연스럽게 교정 중...',
      '글자수 최적화 중...',
      '최종 첨삭 완료 중...'
    ],
    interval: 15000
  }
};

// ✅ 동적 로딩 메시지 커스텀 훅 - 조사 처리 추가
const useLoadingMessage = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const timerRef = useRef(null);
  const stageIndexRef = useRef(0);

  // 조사 플레이스홀더를 실제 조사로 변환
  const formatMessage = (template, context) => {
    let result = template;
    
    // {company} 치환
    if (context.company) {
      result = result.replace(/{company}/g, context.company);
      
      // 조사 치환
      result = result.replace(/{이\/가}/g, getParticle(context.company, '이/가'));
      result = result.replace(/{은\/는}/g, getParticle(context.company, '은/는'));
      result = result.replace(/{을\/를}/g, getParticle(context.company, '을/를'));
      result = result.replace(/{와\/과}/g, getParticle(context.company, '와/과'));
      result = result.replace(/{로\/으로}/g, getParticle(context.company, '로/으로'));
    }
    
    // {topic} 치환
    if (context.topic) {
      result = result.replace(/{topic}/g, context.topic);
    }
    
    return result;
  };

  const startLoading = (endpoint, context = {}) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const config = LOADING_STAGES[endpoint];
    if (!config) {
      setCurrentMessage(context.company ? `${context.company} 처리 중...` : '처리 중...');
      return;
    }
    
    const { messages, interval } = config;
    
    stageIndexRef.current = 0;
    setCurrentMessage(formatMessage(messages[0], context));
    
    timerRef.current = setInterval(() => {
      stageIndexRef.current = (stageIndexRef.current + 1) % messages.length;
      setCurrentMessage(formatMessage(messages[stageIndexRef.current], context));
    }, interval);
  };

  const stopLoading = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentMessage('');
    stageIndexRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { currentMessage, startLoading, stopLoading };
};

/**
* v25.3: STAR 입력 패널 (2x2 그리드) - App 바깥으로 이동
*/
const STARInputPanel = React.memo(({ inputFields, starInputs, setStarInputs, disabled, onModeSwitch, displayTexts, phaseNumber, onHelpClick }) => 
  {  console.log('[STARInputPanel] displayTexts:', JSON.stringify(displayTexts));
  if (!inputFields || inputFields.length === 0) return null;
  
  const orderedKeys = ['situation', 'task', 'action', 'result'];
  const orderedFields = orderedKeys
    .map(key => inputFields.find(f => f.key === key))
    .filter(Boolean);
  
  const topRow = orderedFields.slice(0, 2);
  const bottomRow = orderedFields.slice(2, 4);
  
  const renderField = (field) => (
    <div
      key={field.key}
      style={{
        flex: 1,
        minWidth: '320px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
    <div style={{
        fontSize: '15px',
        color: '#86868B',
        lineHeight: '1.5',
        textAlign: 'center',
        minHeight: '50px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <div 
            className="star-text-line1"
            style={{ 
              color: '#1D1D1F',
              fontWeight: '500',
              marginBottom: '4px'
            }}
          >
            {displayTexts?.[field.key]?.line1 || ''}
          </div>
 {/* 객관식 헬프 아이콘 - 회색 SVG 스타일 */}
 {true && (       
                 <div
              className="mcq-help-icon"
              onClick={() => onHelpClick && onHelpClick(field.key, displayTexts?.[field.key]?.line1 || '')}
              title="이 질문에 대한 답을 하기가 어려우면, 객관식으로 진행할 수 있어요"
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(107, 114, 128, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(107, 114, 128, 0.2)',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                marginBottom: '4px',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(107, 114, 128, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M18 8.5V8a2 2 0 0 0-4 0v.5M14 8.5V6a2 2 0 0 0-4 0v2.5M10 8.5V7a2 2 0 0 0-4 0v5.5M6 12.5V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-5.5a2 2 0 0 0-4 0M10 8.5V12M14 8.5V12" 
                  stroke="rgba(75, 85, 99, 0.8)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div 
          className="star-text-line2"
          style={{ 
            fontSize: '13px', 
            color: '#86868B'
          }}
        >
          {displayTexts?.[field.key]?.line2 || ''}
        </div>
      </div>
      
      <textarea
        key={`star-textarea-${field.key}`}
        value={starInputs[field.key] || ''}
        onChange={(e) => setStarInputs(prev => ({
          ...prev,
          [field.key]: e.target.value
        }))}
        disabled={disabled}
        style={{
          width: '100%',
          minHeight: '50px',
          maxHeight: '120px',
          padding: '14px 20px',
          fontSize: '17px',
          border: '1px solid rgba(74, 85, 104, 0.3)',
          borderRadius: '24px',
          resize: 'none',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          outline: 'none',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          lineHeight: '1.5',
          overflow: 'hidden',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="star-textarea-no-scrollbar"
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(74, 85, 104, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(74, 85, 104, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(74, 85, 104, 0.3)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
  
  return (
    <div 
      className="star-input-panel"
      style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center'
      }}
    >
      <div style={{
        display: 'flex',
        gap: '24px',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {topRow.map(renderField)}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '24px',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {bottomRow.map(renderField)}
      </div>
      
      <button
        onClick={onModeSwitch}
        style={{
          marginTop: '4px',
          padding: '10px 16px',
          fontSize: '15px',
          color: '#86868B',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#1D1D1F'}
        onMouseLeave={(e) => e.target.style.color = '#86868B'}
      >
        일반 텍스트로 입력하기
      </button>
    </div>
  );
});

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('start');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
 
  // Process step tracking
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const PROCESS_STEPS = ['경험구체화', '경험정리', '계획서 생성', '자소서 생성', '최종검토'];  
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPlanTransitionPopup, setShowPlanTransitionPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentExperienceStep, setCurrentExperienceStep] = useState(1);
  const [currentParagraphId, setCurrentParagraphId] = useState(null);
  const [editedParagraphText, setEditedParagraphText] = useState('');
  const [showAiSuggestionPopup, setShowAiSuggestionPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 첨삭 완료 상태 추적
  const [isProofreadingComplete, setIsProofreadingComplete] = useState(false);

  // ✅ 🔥 NEW: 첨삭 수정내용 팝업 상태
  const [showEditInfoPopup, setShowEditInfoPopup] = useState(null); // { paragraphId, editInstructions }

  // 힌트 관련 state
// 힌트 관련 state
const [currentQuestionHint, setCurrentQuestionHint] = useState('');
const [showHintTooltip, setShowHintTooltip] = useState(false);
const [hintTooltipPosition, setHintTooltipPosition] = useState({ x: 0, y: 0 });

// 객관식 경험 추출 관련 state
const [currentPhaseNumber, setCurrentPhaseNumber] = useState(0);
const [showMcqModal, setShowMcqModal] = useState(false);
const [mcqStep, setMcqStep] = useState(1);
const [mcqQuestion, setMcqQuestion] = useState('');
const [mcqOptions, setMcqOptions] = useState([]);
const [mcqSelections, setMcqSelections] = useState([]);
const [mcqLoading, setMcqLoading] = useState(false);
const [mcqGeneratedAnswer, setMcqGeneratedAnswer] = useState('');
const [mcqShowResult, setMcqShowResult] = useState(false);
const [mcqCurrentField, setMcqCurrentField] = useState('');
const [mcqStakeholderQuestion, setMcqStakeholderQuestion] = useState('');
const [mcqMainQuestion, setMcqMainQuestion] = useState('');

// 메인질문 상황 재제시 관련 state
const [showSituationSelection, setShowSituationSelection] = useState(false);
const [situationOptions, setSituationOptions] = useState([]);
const [situationCoreLogic, setSituationCoreLogic] = useState('');
const [situationLoading, setSituationLoading] = useState(false);

// STAR 객관식 진행 관련 state
const [showStarMcq, setShowStarMcq] = useState(false);
const [starMcqType, setStarMcqType] = useState(''); // 'S' | 'T' | 'A' | 'R'
const [starMcqQuestion, setStarMcqQuestion] = useState('');
const [starMcqOptions, setStarMcqOptions] = useState([]);
// DGLC 잔액 부족 모달
const [showDglcModal, setShowDglcModal] = useState(false);
const [dglcModalData, setDglcModalData] = useState({ balance: 0, required: 0, code: '', message: '' });
const [globalDglcBalance, setGlobalDglcBalance] = useState(null);
const [dglcRewardToast, setDglcRewardToast] = useState(null);
const [starMcqLoading, setStarMcqLoading] = useState(false);
const [starMcqSelections, setStarMcqSelections] = useState([]); // 이전 선택들 저장
const [starMcqAnswers, setStarMcqAnswers] = useState({}); // { S: '...', T: '...', A: '...', R: '...' }
// v3.0: 중첩 심화형 추가 state
const [depthSelections, setDepthSelections] = useState([]); // 현재 STAR 내 심화 선택들
// previousSelections 제거됨 - starInputs에서 직접 previousStarContents 생성
const [currentDepth, setCurrentDepth] = useState(1); // 현재 심화 단계
const [contextSummary, setContextSummary] = useState(''); // 누적 요약 (질문에 표시용)
const [starMcqPurpose, setStarMcqPurpose] = useState(''); // 질문 목적 (객관식에 표시용)
// STAR 질문 편집 관련 state
const [editingStarQuestion, setEditingStarQuestion] = useState(false); // 질문 편집 모드
const [editedStarQuestionText, setEditedStarQuestionText] = useState(''); // 편집 중인 질문 텍스트
const [regeneratingOptions, setRegeneratingOptions] = useState(false); // 보기 재생성 로딩
const [rejectedQuestions, setRejectedQuestions] = useState([]); // 질문 재생성 시 거부된 질문 누적
// 에피소드 수정 관련 state
const [editingEpisodeIndex, setEditingEpisodeIndex] = useState(null); // 수정 중인 에피소드 인덱스
const [editedEpisodeText, setEditedEpisodeText] = useState(''); // 수정 중인 에피소드 텍스트
const [savingEpisode, setSavingEpisode] = useState(false); // 에피소드 저장 로딩
const [isCategory, setIsCategory] = useState(false); // R 카테고리 선택 여부// // 객관식 보기 편집 모드 state// 객관식 보기 편집 모드 state
const [editingOptionId, setEditingOptionId] = useState(null); // 현재 편집 중인 옵션 ID
// 객관식 선택 state (제출 전 임시 저장)
const [selectedSituationId, setSelectedSituationId] = useState(null);
const [selectedStarOptionId, setSelectedStarOptionId] = useState(null);
const [selectedMcqOptionId, setSelectedMcqOptionId] = useState(null);


// v25.3: STAR 입력 시스템
const [inputFields, setInputFields] = useState(null);
const [starInputs, setStarInputs] = useState({
  situation: '',
  task: '',
  action: '',
  result: ''
});
const [inputMode, setInputMode] = useState('text');
const [currentStarStep, setCurrentStarStep] = useState('S'); // 현재 진행 중인 STAR 단계: 'S' | 'T' | 'A' | 'R' | 'DONE'
const handleModeSwitch = useCallback(() => setInputMode('text'), []);

// ============================================
// STAR 순차 진행 API 호출 함수들
// ============================================

const fetchNextStarQuestion = async (completedStarType) => {
  try {
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: true, message: '다음 질문을 준비하고 있습니다...' });
    
    // starInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;
    
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-next-star-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completedStarType,
        previousStarContents,
        projectId: currentProjectId,
        questionId: currentQuestionId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // 다음 STAR 단계로 업데이트
      setCurrentStarStep(data.nextStarType);
      
      // inputFields에 새 필드 동적 추가
      const labelMap = { 'S': '상황', 'T': '과제', 'A': '행동', 'R': '결과' };
      const fieldKeyMap = { 'S': 'situation', 'T': 'task', 'A': 'action', 'R': 'result' };
      const fieldKey = fieldKeyMap[data.nextStarType];
      
      const newField = {
        key: fieldKey,
        label: `${data.nextStarType} (${labelMap[data.nextStarType]})`,
        placeholder: {
          line1: data.question || '',
          line2: data.placeholder || ''
        }
      };
      
      // inputFields에 새 필드 추가 (기존 필드 유지)
      setInputFields(prev => [...(prev || []), newField]);
      
      // starDisplayTexts 업데이트
      setStarDisplayTexts(prev => ({
        ...prev,
        [fieldKey]: {
          line1: data.question || '',
          line2: data.placeholder || ''
        }
      }));
      
      // 메인질문은 유지 (chatHistory에 추가하지 않음)
      
    } else {
      console.error('다음 STAR 질문 생성 실패:', data.error);
    }
  } catch (error) {
    console.error('다음 STAR 질문 API 호출 실패:', error);
  } finally {
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
  }
};
// Phase 2 질문 가져오기 (STAR 완료 후)
const fetchEpisodeDetailQuestion = async () => {
  try {
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: true, message: '에피소드 완성 질문을 준비하고 있습니다...' });
    
    // Phase 1 starInputs 저장
    const phase1StarContents = {
      S: starInputs.situation || '',
      T: starInputs.task || '',
      A: starInputs.action || '',
      R: starInputs.result || ''
    };
    
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-episode-detail-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        starContents: phase1StarContents,
        projectId: currentProjectId,
        questionId: currentQuestionId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // ✅ Phase 2로 전환
      setCurrentPhaseNumber(2);
      setQuestionCount(2);      
      // ✅ STAR 단계 리셋
      setCurrentStarStep('S');
      
      // ✅ STAR 입력 초기화
      setStarInputs({ situation: '', task: '', action: '', result: '' });
      
      // ✅ Phase 2: 단일 입력창 모드
      setInputMode('text');
      setInputFields(null);
      setStarDisplayTexts({
        situation: { line1: '', line2: '' },
        task: { line1: '', line2: '' },
        action: { line1: '', line2: '' },
        result: { line1: '', line2: '' }
      });
      
      // 타이프라이터 효과로 Phase 2 보충질문 표시
      typewriterEffect(data.question, () => {
        setChatHistory(prev => [...prev, {
          sender: '딥글',
          message: data.question,
          hint: data.placeholder || ''
        }]);
        
        if (data.placeholder) {
          setCurrentQuestionHint(data.placeholder);
        }
      });
      
      console.log('[Phase2] 단일 입력창 모드로 전환, 보충질문:', data.question);
      
    } else {
      console.error('Phase 2 질문 생성 실패:', data.error);
    }
  } catch (error) {
    console.error('Phase 2 질문 API 호출 실패:', error);
  } finally {
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
  }
};

// ============================================
// 메인질문 상황 재제시 함수들
// ============================================
// 메인질문 🖐️ 클릭 시 호출
const handleMainQuestionHelp = async () => {
  setSituationLoading(true);
  setShowSituationSelection(true);
  
  try {
    // 현재 메인 질문 가져오기
    const currentMainQuestion = chatHistory.length > 0 
      ? chatHistory[chatHistory.length - 1].message 
      : '';
    
  // 현재 선택된 경험 카드 정보 가져오기
  const currentTopicIndex = currentExperienceStep - 1;
  const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
  const selectedExperience = state.selectedExperiences?.[selectedIndex];
  const currentWhySelected = selectedExperience?.whySelected || {};
  
  console.log('[handleMainQuestionHelp] selectedExperience:', selectedExperience);
  console.log('[handleMainQuestionHelp] state.companyInfo:', state.companyInfo);
  
  const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/regenerate-main-question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      whySelected: currentWhySelected,
      currentMainQuestion: currentMainQuestion,
      companyInfo: {
        company: state.companyInfo?.company || '',
        jobTitle: state.companyInfo?.jobTitle || ''
      },
      selectedCard: {
        company: selectedExperience?.company || '',
        description: selectedExperience?.description || ''
      },
      projectId: currentProjectId,
      questionId: currentQuestionId
    })
  });
    
    const data = await response.json();
    if (data.success) {
      setSituationOptions(data.situations || []);
      setSituationCoreLogic(data.coreLogic || '');
    } else {
      console.error('상황 재제시 실패:', data.error);
    }
  } catch (error) {
    console.error('상황 재제시 API 호출 실패:', error);
  } finally {
    setSituationLoading(false);
  }
};

// 상황 선택 시 호출
const handleSituationSelect = async (selectedSituation) => {
  setSituationLoading(true);
  
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/apply-situation-selection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whySelected: currentWhySelected,
        selectedSituation: selectedSituation,
        companyInfo: {
          company: state.companyInfo?.company || '',
          jobTitle: state.companyInfo?.jobTitle || ''
        },
        selectedCard: {
          company: selectedExperience?.company || '',
          description: selectedExperience?.description || ''
        },
        currentPhase: currentPhaseNumber,
        projectId: currentProjectId,
        questionId: currentQuestionId
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // 메인질문 업데이트 (chatHistory에 반영)
      if (data.mainQuestion) {
        setChatHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = {
              ...newHistory[newHistory.length - 1],
              message: data.mainQuestion
            };
          }
          return newHistory;
        });
      }
      
      // STAR 질문 업데이트
      if (data.starQuestions && inputFields) {
        const updatedFields = inputFields.map(field => {
          const starKey = field.key.charAt(0).toUpperCase(); // situation -> S
          if (data.starQuestions[starKey]) {
            return {
              ...field,
              question: data.starQuestions[starKey]
            };
          }
          return field;
        });
        setInputFields(updatedFields);
        
        // starDisplayTexts도 업데이트
        const newDisplayTexts = {};
        updatedFields.forEach(field => {
          newDisplayTexts[field.key] = {
            line1: field.question || '',
            line2: field.subLabel || ''
          };
        });
        setStarDisplayTexts(newDisplayTexts);
      }
      
      // 화면 전환 (상황 선택 화면 닫기)
      setShowSituationSelection(false);
      setSituationOptions([]);
    } else {
      console.error('상황 적용 실패:', data.error);
    }
  } catch (error) {
    console.error('상황 적용 API 호출 실패:', error);
  } finally {
    setSituationLoading(false);
  }
};

// 상황 재제시 새로고침
const handleSituationRefresh = () => {
  handleMainQuestionHelp();
};

// ============================================
// STAR 객관식 함수들
// ============================================

// STAR 🖐️ 클릭 시 호출
const handleStarMcqStart = async (starType) => {
  setStarMcqLoading(true);
  setShowStarMcq(true);
  setStarMcqType(starType);
  // v3.0: 새 STAR 시작 시 심화 선택 초기화
  setDepthSelections([]);
  setCurrentDepth(1);
  setContextSummary('');
  setStarMcqPurpose('');
    setIsCategory(false);
  
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    // starInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;
    const requestBody = starType === 'PHASE2' ? {
      starType: 'PHASE2',
      currentPhase: 2,
      depthSelections: [],
      projectId: currentProjectId,
      questionId: currentQuestionId
    } : {
      starType: starType,
      currentPhase: ['S', 'T', 'A', 'R'].indexOf(starType) + 1,
      previousStarContents: previousStarContents,
      depthSelections: [],
      whySelected: currentWhySelected,
      selectedCard: {
        company: selectedExperience?.company || '',
        description: selectedExperience?.description || ''
      },
      companyInfo: {
        company: state.companyInfo?.company || '',
        jobTitle: state.companyInfo?.jobTitle || ''
      },
      projectId: currentProjectId,
      questionId: currentQuestionId
    };

    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-star-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    if (data.success) {
      setStarMcqQuestion(data.question || '');
      setStarMcqOptions(data.options || []);
      setCurrentDepth(data.depth || 1);
      setContextSummary(data.contextSummary || '');
      setStarMcqPurpose(data.purpose || '');
      setIsCategory(data.isCategory || false);
    } else {
      console.error('STAR 객관식 생성 실패:', data.error);
    }
  } catch (error) {
    console.error('STAR 객관식 API 호출 실패:', error);
  } finally {
    setStarMcqLoading(false);
  }
};
// STAR 객관식 선택 시 호출 (v3.0: 심화 계속, 자동 이동 없음)
const handleStarMcqSelect = async (selectedOption) => {
  const currentStarType = starMcqType;
  const currentQuestion = starMcqQuestion;
  
  setStarMcqLoading(true);
  setStarMcqOptions([]);
  setStarMcqQuestion('다음 질문을 준비하고 있습니다...');
  
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    // starInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;
    
    // 심화 계속 (isComplete: false)
    // 심화 계속 (isComplete: false)
    const answerBody = currentStarType === 'PHASE2' ? {
      starType: 'PHASE2',
      question: currentQuestion,
      selectedOption: selectedOption,
      depthSelections: depthSelections,
      isComplete: false,
      projectId: currentProjectId,
      questionId: currentQuestionId
    } : {
      starType: currentStarType,
      question: currentQuestion,
      selectedOption: selectedOption,
      depthSelections: depthSelections,
      isComplete: false,
      previousStarContents: previousStarContents,
      whySelected: currentWhySelected,
      selectedCard: {
        company: selectedExperience?.company || '',
        description: selectedExperience?.description || ''
      },
      companyInfo: {
        company: state.companyInfo?.company || '',
        jobTitle: state.companyInfo?.jobTitle || ''
      },
      projectId: currentProjectId,
      questionId: currentQuestionId
    };

    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-star-mcq-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerBody)
    });
    
    const data = await response.json();
    if (data.success) {
      // 심화 선택 저장
      const newDepthSelections = data.depthSelections || [...depthSelections, { question: currentQuestion, selected: selectedOption.text }];
      setDepthSelections(newDepthSelections);
      
      // 다음 심화 질문 요청
      await fetchNextDepthQuestion(currentStarType, newDepthSelections);
    } else {
      console.error('STAR 심화 선택 저장 실패:', data.error);
      setStarMcqLoading(false);
    }
  } catch (error) {
    console.error('STAR 심화 API 호출 실패:', error);
    setStarMcqLoading(false);
  }
};
// 다음 심화 질문 가져오기
const fetchNextDepthQuestion = async (starType, currentDepthSelections) => {
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    // starInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;
    const depthBody = starType === 'PHASE2' ? {
      starType: 'PHASE2',
      currentPhase: 2,
      depthSelections: currentDepthSelections,
      projectId: currentProjectId,
      questionId: currentQuestionId
    } : {
      starType: starType,
      currentPhase: ['S', 'T', 'A', 'R'].indexOf(starType) + 1,
      previousStarContents: previousStarContents,
      depthSelections: currentDepthSelections,
      whySelected: currentWhySelected,
      selectedCard: {
        company: selectedExperience?.company || '',
        description: selectedExperience?.description || ''
      },
      companyInfo: {
        company: state.companyInfo?.company || '',
        jobTitle: state.companyInfo?.jobTitle || ''
      },
      projectId: currentProjectId,
      questionId: currentQuestionId
    };

    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-star-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(depthBody)
    });
    
    const data = await response.json();
    if (data.success) {
      setStarMcqQuestion(data.question || '');
      setStarMcqOptions(data.options || []);
      setCurrentDepth(data.depth || currentDepthSelections.length + 1);
      setContextSummary(data.contextSummary || '');
      setStarMcqPurpose(data.purpose || '');
      setIsCategory(data.isCategory || false);
    } else {
      console.error('STAR 심화 질문 생성 실패:', data.error);
    }
  } catch (error) {
    console.error('STAR 심화 질문 API 호출 실패:', error);
  } finally {
    setStarMcqLoading(false);
  }
};
// 다음 STAR 첫 질문 가져오기
const fetchNextStarFirstQuestion = async (starType, updatedStarInputs) => {
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    // updatedStarInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (updatedStarInputs.situation?.trim()) previousStarContents.S = updatedStarInputs.situation;
    if (updatedStarInputs.task?.trim()) previousStarContents.T = updatedStarInputs.task;
    if (updatedStarInputs.action?.trim()) previousStarContents.A = updatedStarInputs.action;
    if (updatedStarInputs.result?.trim()) previousStarContents.R = updatedStarInputs.result;
    
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-star-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        starType: starType,
        currentPhase: ['S', 'T', 'A', 'R'].indexOf(starType) + 1,
        previousStarContents: previousStarContents,
        depthSelections: [],
        whySelected: currentWhySelected,
        selectedCard: {
          company: selectedExperience?.company || '',
          description: selectedExperience?.description || ''
        },
        companyInfo: {
          company: state.companyInfo?.company || '',
          jobTitle: state.companyInfo?.jobTitle || ''
        },
        projectId: currentProjectId,
        questionId: currentQuestionId
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setStarMcqQuestion(data.question || '');
      setStarMcqOptions(data.options || []);
      setCurrentDepth(data.depth || 1);
      setContextSummary(data.contextSummary || '');
      setIsCategory(data.isCategory || false);
    } else {
      console.error('다음 STAR 질문 생성 실패:', data.error);
    }
  } catch (error) {
    console.error('다음 STAR 질문 API 호출 실패:', error);
  } finally {
    setStarMcqLoading(false);
  }
};
// "다음 질문으로 넘어가기" 클릭 시 (현재 STAR 완료 → 메인화면 복귀)
const handleStarMcqNextStar = async () => {
  const currentStarType = starMcqType;
  
  setStarMcqLoading(true);
  setStarMcqQuestion('답변을 정리하고 있습니다...');
  setStarMcqOptions([]);
  
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || {};
    
    // starInputs에서 previousStarContents 생성
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;
// 현재 STAR 완료 처리 (isComplete: true)
const completeBody = currentStarType === 'PHASE2' ? {
  starType: 'PHASE2',
  question: starMcqQuestion,
  selectedOption: depthSelections.length > 0 
    ? { text: depthSelections[depthSelections.length - 1].selected }
    : { text: '' },
  depthSelections: depthSelections,
  isComplete: true,
  projectId: currentProjectId,
  questionId: currentQuestionId
} : {
  starType: currentStarType,
  question: starMcqQuestion,
  selectedOption: depthSelections.length > 0 
    ? { text: depthSelections[depthSelections.length - 1].selected }
    : { text: '' },
  depthSelections: depthSelections,
  isComplete: true,
  previousStarContents: previousStarContents,
  whySelected: currentWhySelected,
  selectedCard: {
    company: selectedExperience?.company || '',
    description: selectedExperience?.description || ''
  },
  companyInfo: {
    company: state.companyInfo?.company || '',
    jobTitle: state.companyInfo?.jobTitle || ''
  },
  projectId: currentProjectId,
  questionId: currentQuestionId
};

const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-star-mcq-answer`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(completeBody)
});

const data = await response.json();
if (data.success && data.isComplete) {
  if (currentStarType === 'PHASE2') {
    // ✅ Phase 2: fullAnswer를 textarea에 세팅
    setCurrentAnswer(data.fullAnswer || '');
    console.log('[Phase2] 객관식 완료, textarea에 세팅:', data.fullAnswer);
  } else {
    // Phase 1: 기존 STAR 입력창에 채움
    const fieldKeyMap = { 'S': 'situation', 'T': 'task', 'A': 'action', 'R': 'result' };
    const fieldKey = fieldKeyMap[currentStarType];
    setStarInputs(prev => ({ ...prev, [fieldKey]: data.fullAnswer || '' }));
    
    // starMcqAnswers에도 저장
    const newAnswers = { ...starMcqAnswers, [currentStarType]: data.fullAnswer || '' };
    setStarMcqAnswers(newAnswers);
    
    // 현재 STAR 단계 업데이트
    setCurrentStarStep(currentStarType);
    
    // 모든 STAR 완료 시 (R까지 완료)
    const starOrder = ['S', 'T', 'A', 'R'];
    const currentIndex = starOrder.indexOf(currentStarType);
    if (currentIndex >= 3) {
      handleStarMcqComplete(newAnswers);
    }
  }
  
  // 객관식 모달 닫기 → 메인화면 복귀
  setShowStarMcq(false);
  setStarMcqType('');
  setStarMcqQuestion('');
  setStarMcqOptions([]);
  setDepthSelections([]);
  setCurrentDepth(1);
  setContextSummary('');
  setStarMcqPurpose('');
    setIsCategory(false);
  setStarMcqLoading(false);
    } else {
      console.error('STAR 완료 처리 실패:', data.error);
      setStarMcqLoading(false);
    }
  } catch (error) {
    console.error('STAR 완료 API 호출 실패:', error);
    setStarMcqLoading(false);
  }
};
// STAR 객관식 완료 시 호출
const handleStarMcqComplete = async (answers) => {
  try {
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    
    await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/complete-star-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        starAnswers: answers,
        selectedCard: {
          company: selectedExperience?.company || '',
          description: selectedExperience?.description || ''
        },
        companyInfo: {
          company: state.companyInfo?.company || '',
          jobTitle: state.companyInfo?.jobTitle || ''
        },
        projectId: currentProjectId,
        questionId: currentQuestionId
      })
    });
    
    // 화면 전환 (STAR 객관식 화면 닫기)
    setShowStarMcq(false);
    setStarMcqType('');
    setStarMcqQuestion('');
    setStarMcqOptions([]);
    setStarMcqSelections([]);
    setDepthSelections([]);
  
    setCurrentDepth(1);
    setContextSummary('');
    setStarMcqPurpose('');
    } catch (error) {
    console.error('STAR 완료 API 호출 실패:', error);
  }
};

// STAR 객관식 새로고침
const handleStarMcqRefresh = () => {
  setStarMcqLoading(true);
  setStarMcqOptions([]);
  setStarMcqQuestion('다른 선택지를 준비하고 있습니다...');
  fetchNextDepthQuestion(starMcqType, depthSelections);
};
// STAR 객관식 질문 자체 재생성
const handleRegenerateStarQuestion = async () => {
  const currentQ = starMcqQuestion;
  const updatedRejected = [...rejectedQuestions, currentQ];
  setRejectedQuestions(updatedRejected);
  setStarMcqLoading(true);
  setStarMcqOptions([]);
  setStarMcqQuestion('다른 질문을 준비하고 있습니다...');

  try {
    const previousStarContents = {};
    if (starInputs.situation?.trim()) previousStarContents.S = starInputs.situation;
    if (starInputs.task?.trim()) previousStarContents.T = starInputs.task;
    if (starInputs.action?.trim()) previousStarContents.A = starInputs.action;
    if (starInputs.result?.trim()) previousStarContents.R = starInputs.result;

    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/regenerate-star-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: currentProjectId,
        questionId: currentQuestionId,
        starType: starMcqType,
        rejectedQuestions: updatedRejected,
        depthSelections: depthSelections,
        previousStarContents: previousStarContents
      })
    });

    const data = await response.json();

    if (data.success) {
      setStarMcqQuestion(data.question);
      setStarMcqOptions(data.options || []);
    } else {
      console.error('질문 재생성 실패:', data.error);
      setStarMcqQuestion(currentQ);
    }
  } catch (error) {
    console.error('질문 재생성 API 호출 실패:', error);
    setStarMcqQuestion(currentQ);
  } finally {
    setStarMcqLoading(false);
  }
};
// STAR 객관식 취소 (원래 화면으로)

const handleStarMcqCancel = () => {
  setShowStarMcq(false);
  setStarMcqType('');
  setStarMcqQuestion('');
  setStarMcqOptions([]);
  setDepthSelections([]);

  setCurrentDepth(1);
  setContextSummary('');
  setStarMcqPurpose('');
  setRejectedQuestions([]);
};

  // STAR 질문 수정 후 보기 재생성
  const handleRegenerateStarMcqOptions = async () => {
    if (!editedStarQuestionText.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }
    
    setRegeneratingOptions(true);
    setStarMcqOptions([]);
    
    try {
      // previousStarContents 생성
      const previousStarContents = {};
      if (starInputs.situation) previousStarContents.S = starInputs.situation;
      if (starInputs.task) previousStarContents.T = starInputs.task;
      if (starInputs.action) previousStarContents.A = starInputs.action;
      if (starInputs.result) previousStarContents.R = starInputs.result;
      
      const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/regenerate-star-mcq-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProjectId,
          questionId: currentQuestionId,
          starType: starMcqType,
          depth: currentDepth,
          editedQuestion: editedStarQuestionText,
          depthSelections: depthSelections,
          previousStarContents: previousStarContents
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStarMcqQuestion(data.editedQuestion);
        setStarMcqOptions(data.options || []);
        setEditingStarQuestion(false);
        setEditedStarQuestionText('');
      } else {
        console.error('보기 재생성 실패:', data.error);
        alert('보기 재생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('보기 재생성 API 호출 실패:', error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setRegeneratingOptions(false);
    }
  };

  // 에피소드 수정 API 호출
  const handleUpdateEpisode = async (episodeIndex) => {
    if (!editedEpisodeText.trim()) {
      alert('에피소드 내용을 입력해주세요.');
      return;
    }
    
    setSavingEpisode(true);
    
    try {
      const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/update-session-episode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProjectId,
          questionId: currentQuestionId,
          editedEpisode: editedEpisodeText
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // state 업데이트
        const updatedEpisodes = [...state.summarizedEpisodes];
        updatedEpisodes[episodeIndex] = {
          ...updatedEpisodes[episodeIndex],
          episode: data.episode
        };
        dispatch({ type: 'SET_SUMMARIZED_EPISODES', summarizedEpisodes: updatedEpisodes });
        
        setEditingEpisodeIndex(null);
        setEditedEpisodeText('');
        alert('에피소드가 수정되었습니다.');
      } else {
        console.error('에피소드 수정 실패:', data.error);
        alert('에피소드 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('에피소드 수정 API 호출 실패:', error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setSavingEpisode(false);
    }
  };
  
  // 상황 선택 취소 (원래 화면으로)
const handleSituationCancel = () => {
  setShowSituationSelection(false);
  setSituationOptions([]);
};

// 객관식 경험 추출 함수들
const handleStartMcq = async (fieldKey, stakeholderQuestion) => {
  setMcqLoading(true);
  try {
    // 현재 메인 질문 가져오기
    const mainQ = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].message : '';
    setMcqMainQuestion(mainQ);
    
    // 현재 선택된 경험 카드의 whySelected 가져오기
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    const selectedExperience = state.selectedExperiences?.[selectedIndex];
    const currentWhySelected = selectedExperience?.whySelected || '';
    
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whySelected: currentWhySelected,
        phase: currentPhaseNumber,
        mainQuestion: mainQ,
        stakeholderQuestion: stakeholderQuestion,
        questionStep: 1,
        previousSelections: []
      })
    });
    const data = await response.json();
    if (data.success) {
      setMcqQuestion(data.question);
      setMcqOptions(data.options || []);
      setMcqStep(1);
    } else {
      console.error('MCQ 생성 실패:', data.error);
      setShowMcqModal(false);
    }
  } catch (error) {
    console.error('MCQ API 호출 실패:', error);
    setShowMcqModal(false);
  } finally {
    setMcqLoading(false);
  }
};

const handleMcqSelect = async (selectedOption) => {
  const newSelection = {
    question: mcqQuestion,
    selected: selectedOption.text
  };
  const updatedSelections = [...mcqSelections, newSelection];
  setMcqSelections(updatedSelections);
  
  if (mcqStep < 3) {
    // 다음 단계 질문 요청
    setMcqLoading(true);
    try {
      const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-mcq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whySelected: state.analysisData?.whySelected || '',
          phase: currentPhaseNumber,
          mainQuestion: mcqMainQuestion,
          stakeholderQuestion: mcqStakeholderQuestion,
          questionStep: mcqStep + 1,
          previousSelections: updatedSelections
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMcqQuestion(data.question);
        setMcqOptions(data.options || []);
        setMcqStep(mcqStep + 1);
      }
    } catch (error) {
      console.error('MCQ 다음 단계 실패:', error);
    } finally {
      setMcqLoading(false);
    }
  } else {
    // 3단계 완료, 답변 생성
    handleMcqGenerateAnswer(updatedSelections);
  }
};

const handleMcqGenerateAnswer = async (selections) => {
  setMcqLoading(true);
  try {
    const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/generate-mcq-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whySelected: state.analysisData?.whySelected || '',
        phase: currentPhaseNumber,
        mainQuestion: mcqMainQuestion,
        stakeholderQuestion: mcqStakeholderQuestion,
        selections: selections
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setMcqGeneratedAnswer(data.generatedAnswer);
      setMcqShowResult(true);
    }
  } catch (error) {
    console.error('MCQ 답변 생성 실패:', error);
  } finally {
    setMcqLoading(false);
  }
};

const handleMcqConfirm = () => {
  // 해당 STAR 입력창에 답변 자동 입력
  setStarInputs(prev => ({
    ...prev,
    [mcqCurrentField]: mcqGeneratedAnswer
  }));
  setShowMcqModal(false);
  // 상태 초기화
  setMcqStep(1);
  setMcqSelections([]);
  setMcqShowResult(false);
  setMcqGeneratedAnswer('');
  setMcqQuestion('');
  setMcqOptions([]);
};

const handleMcqRegenerate = () => {
  // Step 1부터 다시 시작
  setMcqStep(1);
  setMcqSelections([]);
  setMcqShowResult(false);
  setMcqGeneratedAnswer('');
  handleStartMcq(mcqCurrentField, mcqStakeholderQuestion);
};

// STAR 타이프라이터 효과용 state
const [starDisplayTexts, setStarDisplayTexts] = useState({
  situation: { line1: '', line2: '' },
  task: { line1: '', line2: '' },
  action: { line1: '', line2: '' },
  result: { line1: '', line2: '' }
});
const [isStarTextAnimating, setIsStarTextAnimating] = useState(false);

// ============================================
// ✅ 세션 런타임 초기화 함수
// 하위딥글(문항) 진입 시 호출하여 이전 문항 데이터 오염 방지
// 백엔드 DB의 사전분석 데이터는 건드리지 않음
// ============================================
const resetSessionState = useCallback(() => {
  console.log('[resetSessionState] 세션 런타임 state 초기화');

  // 1. 문답 관련
  setChatHistory([]);
  setCurrentAnswer('');
  setQuestionCount(0);
  setCurrentExperienceStep(1);
  setCurrentPhaseNumber(0);
  setError(null);

  // 2. STAR 입력 관련
  setStarInputs({ situation: '', task: '', action: '', result: '' });
  setInputFields(null);
  setInputMode('text');
  setCurrentStarStep('S');
  setStarDisplayTexts({
    situation: { line1: '', line2: '' },
    task: { line1: '', line2: '' },
    action: { line1: '', line2: '' },
    result: { line1: '', line2: '' }
  });
  setIsStarTextAnimating(false);

  // 3. 객관식 관련
  setShowMcqModal(false);
  setMcqStep(1);
  setMcqQuestion('');
  setMcqOptions([]);
  setMcqSelections([]);
  setMcqLoading(false);
  setMcqGeneratedAnswer('');
  setMcqShowResult(false);
  setMcqCurrentField('');
  setMcqStakeholderQuestion('');
  setMcqMainQuestion('');

  // 4. 상황 재제시 관련
  setShowSituationSelection(false);
  setSituationOptions([]);
  setSituationCoreLogic('');
  setSituationLoading(false);

  // 5. STAR 객관식 관련
  setShowStarMcq(false);
  setStarMcqType('');
  setStarMcqQuestion('');
  setStarMcqOptions([]);
  setStarMcqLoading(false);
  setStarMcqSelections([]);
  setStarMcqAnswers({});

  // 6. 심화/편집/선택 관련
  setDepthSelections([]);
  setCurrentDepth(1);
  setContextSummary('');
  setStarMcqPurpose('');
    setIsCategory(false);
  setEditingOptionId(null);
  setSelectedSituationId(null);
  setSelectedStarOptionId(null);
  setSelectedMcqOptionId(null);

  // 7. 힌트 관련
  setCurrentQuestionHint('');
  setShowHintTooltip(false);

  // 8. 에피소드/계획서/자소서 관련
  dispatch({ type: 'SET_SUMMARIZED_EPISODES', summarizedEpisodes: [] });
  dispatch({ type: 'SET_EPISODE_ANALYSIS', episodeAnalysis: [] });
  dispatch({ type: 'SET_PLAN', plan: '', source: [], processing: '', nextStep: '', summarizedExperiences: [] });
  dispatch({ type: 'SET_COVER_LETTER', paragraphs: [] });
  dispatch({ type: 'SET_COVER_LETTER_TEXT', text: '' });
  dispatch({ type: 'SET_AI_SCREENING', suggestions: [] });
  dispatch({ type: 'SET_AI_PROOFREADING', suggestions: [] });
  dispatch({ type: 'SET_PROOFREADING_POPUP', show: false });
  dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false, message: '' });

  // 9. 팝업/UI 관련
  setShowPlanPopup(false);
  setShowPlanTransitionPopup(false);
  setCurrentParagraphId(null);
  setEditedParagraphText('');
  setShowAiSuggestionPopup(null);
  setIsSubmitting(false);
  setIsProofreadingComplete(false);
  setShowEditInfoPopup(null);
}, []);

 
  // Simplified popup positions
  const [aiSuggestionPopupPosition, setAiSuggestionPopupPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 });
  const planPopupRef = useRef(null);
  const chatBoxRef = useRef(null);
  const aiSuggestionPopupRef = useRef(null);
  const originalTextRef = useRef(null);

// URL 파라미터로 딥글 플로우 진입 처리
// URL 파라미터로 딥글 플로우 진입 처리
useEffect(() => {
  
  const urlParams = new URLSearchParams(location.search);
  const flow = urlParams.get('flow');
  const projectId = urlParams.get('projectId');
  const questionId = urlParams.get('questionId');
  const restoreParam = urlParams.get('restore');
  const statusParam = urlParams.get('status');
  
  // ✅ state에 저장 (다른 함수에서 사용하기 위해)
  if (projectId) setCurrentProjectId(projectId);
  if (questionId) setCurrentQuestionId(questionId);
  
  // flow=experience-extraction 처리 (문답 화면)

  // flow=experience-extraction 처리 (문답 화면)
  if (flow === 'experience-extraction' && projectId && questionId) {
    resetSessionState();
    const savedData = localStorage.getItem('deepgl_selected_experience');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 문항 ID 불일치 시 무시 (이전 문항 잔여 데이터 방지)
      if (parsedData.questionId && parsedData.questionId !== questionId) {
        console.log('[DEBUG] localStorage 문항 불일치 - 무시:', parsedData.questionId, '!==', questionId);
        localStorage.removeItem('deepgl_selected_experience');
        return;
      }
      console.log('[DEBUG] parsedData:', parsedData);
      const { selectedCard, selectedIndex, resumeId, analysisId, selectedExperiences, questionTopics, companyInfo, conversationState, talentProfile, coreCompetency, userId } = parsedData;     
       console.log('[DEBUG] resumeId:', resumeId);      console.log('[DEBUG] analysisId:', analysisId);
      console.log('[DEBUG] selectedIndex:', selectedIndex);
      console.log('[DEBUG] conversationState:', conversationState);
      console.log('[DEBUG] companyInfo from localStorage:', companyInfo);
      
// companyInfo가 없거나 빈 경우 selectedCard에서 가져오기
let resolvedCompanyInfo = (companyInfo && companyInfo.company) 
? companyInfo 
: (selectedCard?.companyInfo && selectedCard.companyInfo.company)
  ? selectedCard.companyInfo
  : { company: '', jobTitle: '', jobTasks: '', jobRequirements: '' };

// 🆕 companyInfo가 여전히 비어있으면 projectId로 DB에서 조회
if (!resolvedCompanyInfo.company && projectId) {
fetch(
`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${projectId}`)
  .then(res => res.json())
  .then(projectData => {
    if (projectData.project) {
      const fetchedCompanyInfo = {
        company: projectData.project.company || '',
        jobTitle: projectData.project.jobTitle || '',
        jobTasks: projectData.project.jobTasks || '',
        jobRequirements: projectData.project.jobRequirements || ''
      };
      console.log('[DEBUG] companyInfo fetched from DB:', fetchedCompanyInfo);
      dispatch({
        type: 'SET_ANALYSIS',
        companyInfo: fetchedCompanyInfo
      });
    }
  })
  .catch(err => console.error('[DEBUG] Failed to fetch project info:', err));
}

console.log('[DEBUG] resolvedCompanyInfo:', resolvedCompanyInfo);

// 상태 업데이트
dispatch({
type: 'SET_ANALYSIS',
resumeId: resumeId,
analysisId: analysisId,
analysisData: { selectedExperiences: selectedExperiences },
selectedExperiences: selectedExperiences,
selectedExperiencesIndices: [selectedIndex ?? 0],
questionTopics: questionTopics || [selectedCard?.topic],
companyInfo: resolvedCompanyInfo,
talentProfile: talentProfile || '',
coreCompetency: coreCompetency || ''
});
    
      // 화면 전환
    

      setScreen('experience-extraction');
      setCurrentExperienceStep(1);
      
      // localStorage 정리
      localStorage.removeItem('deepgl_selected_experience');
      
      // URL 정리
      window.history.replaceState({}, '', '/');
      
     // 대화 상태 복원 (restore=true인 경우)
     if (restoreParam === 'true' && conversationState) {
      console.log('[DEBUG] Restoring conversation state, questionCount:', conversationState.questionCount);
      setQuestionCount(conversationState.questionCount || 0);
      
      // 이전 답변들로 chatHistory 복원
      let restoredHistory = [];
      if (conversationState.collectedAnswers && conversationState.collectedAnswers.length > 0) {
        conversationState.collectedAnswers.forEach((answer, idx) => {
          restoredHistory.push({ sender: '딥글', message: `질문 ${idx + 1}` });
          restoredHistory.push({ sender: '나', message: answer.answer || answer });
        });
        setChatHistory(restoredHistory);
      }
      
      // 완료된 문답이면 에피소드 자동 생성
      if (conversationState.isComplete) {
        if (conversationState.episodeData) {
          setScreen('summarized-episode-review');
        } else {
          // 직접 API 호출 (state 대신 복원된 값 사용)
      // 직접 API 호출 (state 대신 복원된 값 사용)
      const topicToUse = questionTopics?.[0] || selectedCard?.topic || '지원동기';
      startLoading('generate-episode', { company: companyInfo?.company, topic: topicToUse });
      dispatch({ type: 'SET_LOADING', loading: true, message: '' });
      setScreen('experience-extraction');
      
      fetch('https://youngsun-xi.vercel.app/generate-episode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeId: resumeId,
              analysisId: analysisId,
              chatHistory: restoredHistory,
              questionTopics: questionTopics || [selectedCard?.topic],
              currentTopic: topicToUse,
              selectedExperienceIndices: [selectedIndex ?? 0],
              projectId: projectId,
              questionId: questionId
            }),
          })
          .then(res => res.json())
          .then(data => {
            stopLoading();
            if (data.episode) {
              dispatch({ type: 'SET_SUMMARIZED_EPISODES', summarizedEpisodes: [{ topic: topicToUse, episode: data.episode, company: data.company || companyInfo?.company || '', competency: data.competency || selectedCard?.competency || '', talentProfile: talentProfile || '', coreCompetency: coreCompetency || data.competency || selectedCard?.competency || '' }] });           
                 setScreen('summarized-episode-review');          
                  } else {           
                       setError('에피소드 생성에 실패했습니다.');
            }
          })
          .catch(err => {
            stopLoading();
            setError('에피소드 생성 중 오류: ' + err.message);
          });
        }
        return;
      }
      
   // ✅ 저장된 질문이 있으면 바로 표시 (API 호출 X)
      // mainQuestion(메인질문) 우선, 없으면 lastQuestion(STAR질문) 사용
      const displayQuestion = conversationState.regeneratedQuestion?.mainQuestion 
        || conversationState.mainQuestion 
        || conversationState.lastQuestion;
      
      if (displayQuestion) {
        console.log('[DEBUG] Restoring question from DB:', {
          mainQuestion: conversationState.regeneratedQuestion?.mainQuestion || conversationState.mainQuestion,
          lastQuestion: conversationState.lastQuestion,
          using: displayQuestion
        });
        setChatHistory(prev => [...prev, { 
          sender: '딥글', 
          message: displayQuestion, 
          hint: conversationState.lastHint || '' 
        }]);
        if (conversationState.lastHint) {
          setCurrentQuestionHint(conversationState.lastHint);
        }
        
        // ✅ Phase 복원 (새 필드 우선, 없으면 기존 필드)
        const restoredPhase = conversationState.currentPhase || conversationState.lastPhaseNumber || 1;
        setCurrentPhaseNumber(restoredPhase);
        console.log('[DEBUG] Restored phase:', restoredPhase);
        
        // ✅ STAR 단계 복원
        if (conversationState.currentStarType) {
          setCurrentStarStep(conversationState.currentStarType);
          console.log('[DEBUG] Restored starStep:', conversationState.currentStarType);
        }
        
  // ✅ STAR 입력값 복원 (previousStarContents 우선, 없으면 starContents)
  const starData = conversationState.previousStarContents || conversationState.starContents || {};
  if (Object.keys(starData).length > 0) {
    const restoredInputs = {
      situation: starData.S || '',
      task: starData.T || '',
      action: starData.A || '',
      result: starData.R || ''
    };
    setStarInputs(restoredInputs);
    console.log('[DEBUG] Restored starInputs:', restoredInputs);
    
    // ✅ 완료된 STAR들의 displayTexts도 복원
    const starQuestions = conversationState.regeneratedQuestion?.starQuestions || {};
    const starKeyMap = { S: 'situation', T: 'task', A: 'action', R: 'result' };
    const restoredDisplayTexts = {};
    
    Object.keys(starData).forEach(type => {
      if (starData[type]) {
        const key = starKeyMap[type];
        restoredDisplayTexts[key] = {
          line1: starQuestions[type] || '',
          line2: ''
        };
      }
    });
    
    if (Object.keys(restoredDisplayTexts).length > 0) {
      setStarDisplayTexts(prev => ({ ...prev, ...restoredDisplayTexts }));
      console.log('[DEBUG] Restored displayTexts for completed STARs:', Object.keys(restoredDisplayTexts));
    }
  }
     
   // ✅ 각 STAR 단계별 질문 복원 (완료된 단계 + 현재 단계)
   if (conversationState.regeneratedQuestion?.starQuestions) {
    const starQuestions = conversationState.regeneratedQuestion.starQuestions;
    const currentType = conversationState.currentStarType;
    const starOrder = ['S', 'T', 'A', 'R'];
    const currentIndex = starOrder.indexOf(currentType);
    
    // 완료된 단계들 + 현재 단계까지 질문 복원
    const questionsToRestore = [];
    starOrder.forEach((type, index) => {
      if (index <= currentIndex && starQuestions[type]) {
        questionsToRestore.push({
          sender: '딥글',
          message: starQuestions[type],
          hint: '',
          starType: type
        });
      }
    });
    
    if (questionsToRestore.length > 0) {
      setChatHistory(prev => {
        // 중복 방지: 이미 있는 질문은 제외
        const existingMessages = prev.map(m => m.message);
        const newQuestions = questionsToRestore.filter(q => !existingMessages.includes(q.message));
        return [...prev, ...newQuestions];
      });
      console.log('[DEBUG] Restored STAR questions up to', currentType);
    }
  }

    // ✅ mainQuestion을 chatHistory 마지막에 추가 (화면에 표시되는 것은 마지막 메시지)
    const finalMainQuestion = conversationState.regeneratedQuestion?.mainQuestion 
      || conversationState.mainQuestion;
    if (finalMainQuestion) {
      setChatHistory(prev => {
        // 이미 같은 mainQuestion이 마지막에 있으면 추가하지 않음
        if (prev.length > 0 && prev[prev.length - 1].message === finalMainQuestion) {
          return prev;
        }
        return [...prev, { 
          sender: '딥글', 
          message: finalMainQuestion, 
          hint: conversationState.lastHint || '',
          isMainQuestion: true 
        }];
      });
      console.log('[DEBUG] Added mainQuestion as last message:', finalMainQuestion.substring(0, 50) + '...');
    }
        
    // ✅ inputFields 복원 (완료된 STAR + 현재 STAR 모두 포함)
    const currentType = conversationState.currentStarType || 'S';
    const starOrder = ['S', 'T', 'A', 'R'];
    const currentIndex = starOrder.indexOf(currentType);
    const starQuestions = conversationState.regeneratedQuestion?.starQuestions || {};
    const starKeyMap = { S: 'situation', T: 'task', A: 'action', R: 'result' };
    const labelMap = { S: 'S (상황)', T: 'T (과제)', A: 'A (행동)', R: 'R (결과)' };
    
    // 완료된 STAR + 현재 STAR까지 inputFields 생성
    const allInputFields = [];
    starOrder.forEach((type, index) => {
      if (index <= currentIndex) {
        allInputFields.push({
          key: starKeyMap[type],
          label: labelMap[type],
          placeholder: {
            line1: starQuestions[type] || '',
            line2: ''
          }
        });
      }
    });
    
    if (allInputFields.length > 0 && restoredPhase !== 2) {
      setInputFields(allInputFields);
      setInputMode('star');
      
      // ✅ displayTexts도 함께 설정 (완료된 STAR + 현재 STAR)
      const allDisplayTexts = {};
      allInputFields.forEach(field => {
        allDisplayTexts[field.key] = {
          line1: field.placeholder?.line1 || '',
          line2: field.placeholder?.line2 || ''
        };
      });
      setStarDisplayTexts(prev => ({ ...prev, ...allDisplayTexts }));
      
      console.log('[DEBUG] Restored inputFields for:', allInputFields.map(f => f.key));
      console.log('[DEBUG] Restored displayTexts for all fields:', Object.keys(allDisplayTexts));
    }
    
    // ✅ Phase 2 텍스트 모드 복원 (일반텍스트 Phase 2)
    if (restoredPhase === 2 && !conversationState.lastInputFields) {
      setInputFields(null);
      setInputMode('text');
      console.log('[DEBUG] Restored Phase 2 text mode');
    }
      
     // ✅ STAR 완료 여부 체크
     if (conversationState.starMcqCompleted) {
      setCurrentStarStep('DONE');
      console.log('[DEBUG] STAR already completed');
      return;
    }
    
    return;
  }
}

// 질문 생성 API 직접 호출...
    
  
    // 질문 생성 API 직접 호출 (새로 시작하거나 저장된 질문 없을 때)
    setTimeout(async () => {
      try {
        dispatch({ type: 'SET_CHAT_LOADING', chatLoading: true });
        
        const response = await authFetch('https://youngsun-xi.vercel.app/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeId: resumeId || '',
            analysisId: analysisId || '',
            analysisData: { selectedExperiences: selectedExperiences },
            selectedExperienceIndices: [selectedIndex ?? 0],
            chatHistory: [],
            questionTopics: questionTopics || [selectedCard?.topic],
            topicIndex: 0,
            step: conversationState?.questionCount ? conversationState.questionCount + 1 : 1,
            projectId: projectId,
            questionId: questionId
          }),
        });
        
        const data = await response.json();
        console.log('generate-question 응답:', data);
        
        dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
        
        if (data.question) {
          setChatHistory(prev => [...prev, { sender: '딥글', message: data.question, hint: data.hint || '' }]);
          if (data.hint) {
            setCurrentQuestionHint(data.hint);
          }
          if (data.inputFields) {
            setInputFields(data.inputFields);
            setInputMode('star');
            
            // ✅ 즉시 placeholder 설정
            const targets = {};
            data.inputFields.forEach(field => {
              targets[field.key] = {
                line1: field.placeholder?.line1 || '',
                line2: field.placeholder?.line2 || ''
              };
            });
            setStarDisplayTexts(targets);
          }
          setQuestionCount(conversationState?.questionCount ? conversationState.questionCount + 1 : 1);
        }
      } catch (err) {
        console.error('질문 생성 실패:', err);
        dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
      }
    }, 300);
  }
}

// flow=reused-episode 처리 (재활용 에피소드 - Q&A 스킵)
if (flow === 'reused-episode' && projectId && questionId) {
  resetSessionState();
  const savedData = localStorage.getItem('deepgl_reused_episode');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // 문항 ID 불일치 시 무시 (이전 문항 잔여 데이터 방지)
    if (parsedData.questionId && parsedData.questionId !== questionId) {
      console.log('[DEBUG] localStorage 문항 불일치 - 무시:', parsedData.questionId, '!==', questionId);
      localStorage.removeItem('deepgl_reused_episode');
      return;
    }
    const { episode, companyInfo, talentProfile, coreCompetency, analysisId, resumeId, questionText } = parsedData;
    
    console.log('[DEBUG] Reused episode loaded:', episode);
    
    // questionText 사용 (없으면 fallback)
    const topicHeader = questionText || '자기소개서 문항';
    
    // 상태 업데이트 (analysisId, resumeId 포함)
    dispatch({
      type: 'SET_ANALYSIS',
      companyInfo: companyInfo || {},
      analysisId: analysisId || '',
      resumeId: resumeId || '',
      questionTopics: [topicHeader]
    });
    
    dispatch({
      type: 'SET_SUMMARIZED_EPISODES',
      summarizedEpisodes: [{
        topic: topicHeader,
        episode: typeof episode === 'string' ? episode : episode.content,
        company: companyInfo?.company || '',
        competency: coreCompetency || ''
      }]
    });
    
    // 에피소드 리뷰 화면으로 이동
    setScreen('summarized-episode-review');
    
    // localStorage 정리
    localStorage.removeItem('deepgl_reused_episode');
    
    // URL 정리
    window.history.replaceState({}, '', '/');
  }
}


  // flow=restore 처리 (에피소드/계획서/자소서 복원)
  if (flow === 'restore' && projectId && questionId) {
    resetSessionState();    const savedData = localStorage.getItem('deepgl_selected_experience');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const { resumeId, analysisId, selectedExperiences, questionTopics, companyInfo, restoreStatus, episodeData, planData, coverLetterData } = parsedData;
      
      console.log('[DEBUG] Restoring status:', restoreStatus || statusParam);
      
      // 상태 업데이트
      dispatch({
        type: 'SET_ANALYSIS',
        resumeId: resumeId,
        analysisId: analysisId,
        analysisData: { selectedExperiences: selectedExperiences },
        selectedExperiences: selectedExperiences,
        selectedExperiencesIndices: [0],
        questionTopics: questionTopics,
        companyInfo: companyInfo || {}
      });
      
      // 에피소드 데이터 복원
      if (episodeData) {
        dispatch({
          type: 'SET_SUMMARIZED_EPISODES',
          summarizedEpisodes: episodeData.summarizedEpisodes || [],
          episodeAnalysis: episodeData.episodeAnalysis || null
        });
      }
      
      // 계획서 데이터 복원
      if (planData) {
        dispatch({
          type: 'SET_PLAN',
          plan: planData.plan || '',
          source: planData.source || []
        });
      }
      
      // 자소서 데이터 복원
      if (coverLetterData) {
        dispatch({
          type: 'SET_COVER_LETTER',
          paragraphs: coverLetterData.paragraphs || []
        });
      }
      
      const status = restoreStatus || statusParam;
      
      // 상태에 따라 화면 전환
      if (status === 'episode') {
        setScreen('summarized-episode-review');
      } else if (status === 'plan') {
        setScreen('plan-view');
      } else if (status === 'letter' || status === 'done') {
        // reviewData가 있으면 첨삭 완료 상태로 복원
        if (parsedData.reviewData && parsedData.reviewData.paragraphs) {
          const reviewParagraphs = parsedData.reviewData.paragraphs.map(p => ({
            id: p.id,
            text: p.edited || p.text || '',
            originalCharCount: p.originalCharCount,
            editedCharCount: p.editedCharCount,
            editInstructions: p.editInstructions || []
          }));
          dispatch({
            type: 'SET_COVER_LETTER',
            paragraphs: reviewParagraphs
          });
          setIsProofreadingComplete(true);
        }
        setScreen('cover-letter-view');
      }
      
      setCurrentExperienceStep(1);
      
      // localStorage 정리
      localStorage.removeItem('deepgl_selected_experience');
      
      // URL 정리
      window.history.replaceState({}, '', '/');
    }
  }
}, [location.search]);

  


const editorRef = useRef(null);
  const proofreadingPopupRef = useRef(null);

  // ✅ 동적 로딩 메시지 훅 사용
 // ✅ 동적 로딩 메시지 훅 사용
// STAR 텍스트 타이프라이터 효과 함수
// ✅ 동적 로딩 메시지 훅 사용
const { currentMessage, startLoading, stopLoading } = useLoadingMessage();
// STAR 텍스트 타이프라이터 효과 함수
const typewriterSTARTexts = (fields, onComplete) => {
  if (!fields || fields.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  setIsStarTextAnimating(true);
  
  // 초기화
  setStarDisplayTexts({
    situation: { line1: '', line2: '' },
    task: { line1: '', line2: '' },
    action: { line1: '', line2: '' },
    result: { line1: '', line2: '' }
  });

  // 각 필드의 목표 텍스트
  const targets = {};
  fields.forEach(field => {
    targets[field.key] = {
      line1: field.placeholder?.line1 || '',
      line2: field.placeholder?.line2 || ''
    };
  });

  // 전체 최대 길이 계산
  let maxLength = 0;
  Object.values(targets).forEach(t => {
    maxLength = Math.max(maxLength, t.line1.length, t.line2.length);
  });

  let charIndex = 0;
  const interval = setInterval(() => {
    if (charIndex >= maxLength) {
      clearInterval(interval);
      setIsStarTextAnimating(false);
      if (onComplete) onComplete();
      return;
    }

    setStarDisplayTexts(prev => {
      const updated = { ...prev };
      Object.keys(targets).forEach(key => {
        updated[key] = {
          line1: targets[key].line1.slice(0, charIndex + 1),
          line2: targets[key].line2.slice(0, charIndex + 1)
        };
      });
      return updated;
    });

    charIndex++;
  }, 30);
};

  const goToAnalysis = () => {
    setCurrentProcessStep(0);
    setScreen('analysis');
  };

  const goToPreAnalysisReview = () => {
    setCurrentProcessStep(1);
    setScreen('pre-analysis-review');
  };

  const goToDirectionSelection = (resumeId, analysisId) => {
    setCurrentProcessStep(2);
    dispatch({
      type: 'SET_ANALYSIS',
      selectedExperiencesIndices: Array(state.questionTopics.length).fill(null),
      selectedExperiences: []
    });
    setScreen('direction-selection');
    handleDirectionSuggestion(resumeId, analysisId);
  };

  const goToExperienceExtraction = () => {
    setCurrentProcessStep(2);
    setScreen('experience-extraction');
  };

  const goToPlanGeneration = () => {
    setShowPlanTransitionPopup(false);
    setScreen('plan-generation');
  };

  const goToSummarizedEpisodeReview = () => {
    setScreen('summarized-episode-review');
  };

  const goToPlanView = () => {
    setCurrentProcessStep(3);
    setScreen('plan-view');
  };

  const goToCoverLetterView = () => {
    setCurrentProcessStep(4);
    setIsProofreadingComplete(false);
    setScreen('cover-letter-view');
  };

  const goToParagraphEdit = (paragraphId) => {
    const paragraph = state.coverLetterParagraphs.find(p => p.id === paragraphId);
    setCurrentParagraphId(paragraphId);
    setEditedParagraphText(paragraph ? paragraph.text : '');
    setScreen('paragraph-edit');
  };

  const handleStartWriting = () => {
    goToAnalysis();
  };

  // ✅ 수정: handlePreAnalysisSubmit - 알림 권한 요청 및 완료 알림 추가
  const handlePreAnalysisSubmit = async (e) => {
    e.preventDefault();
    if (
      !state.companyInfo.company ||
      !state.companyInfo.jobTitle ||
      !state.companyInfo.jobTasks ||
      !state.companyInfo.jobRequirements ||
      !state.companyInfo.questions
    ) {
      setError('모든 필드를 채워주세요');
      return;
    }
    
    // ✅ 알림 권한 요청 (첫 분석 시)
    await requestNotificationPermission();
    
    startLoading('pre-analyze', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      const response = await authFetch('https://youngsun-xi.vercel.app/pre-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: state.companyInfo.company,
          jobTitle: state.companyInfo.jobTitle,
          jobTasks: state.companyInfo.jobTasks,
          jobRequirements: state.companyInfo.jobRequirements,
          questions: state.companyInfo.questions,
          wordLimit: state.companyInfo.wordLimit || '1000'
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('사전 분석 실패');
      const data = await response.json();
      if (data.error) {
        setError(`사전 분석 실패: ${data.details}`);
      } else {
        dispatch({
          type: 'SET_PRE_ANALYSIS',
          preAnalysisId: data.preAnalysisId,
          companyInfo: state.companyInfo,
          preCompetencies: data.competencies,
          questionTopics: data.questionTopics
        });
        
        // ✅ 완료 알림 발송
        sendNotification(
          '딥글 사전 분석 완료',
          `${state.companyInfo.company} 사전 분석이 완료되었습니다. 이력서를 업로드해주세요.`
        );
        
        goToPreAnalysisReview();
      }
    } catch (error) {
      setError(`서버에 문제가 생겼습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  // ✅ 수정: handleAnalysisSubmit - 완료 알림 추가
  const handleAnalysisSubmit = async (e) => {
    e.preventDefault();
    if (!state.companyInfo.resumeFile) {
      setError('이력서를 업로드해주세요');
      return;
    }
    
    startLoading('analyze-all', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    const formData = new FormData();
    formData.append('preAnalysisId', state.preAnalysisId);
    formData.append('resume', state.companyInfo.resumeFile);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      const response = await authFetch('https://youngsun-xi.vercel.app/analyze-all', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`분석 실패: ${response.statusText}`);
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] [DEBUG-Stage2-Frontend] /analyze-all response:`, data);
      if (data.error) {
        if (data.code === 'INSUFFICIENT_EXPERIENCES') {
          setError(`${data.details}\n\n이력서에 더 다양한 경험을 추가하거나 다른 주제를 선택해주세요.`);
        } else {
          setError(`분석 실패: ${data.details}`);
        }
        stopLoading();
        dispatch({ type: 'SET_LOADING', loading: false, message: '' });
        return;
      }
      if (!data.resumeId || !data.analysisId) {
        console.error(`[${new Date().toISOString()}] [DEBUG-Stage2-Frontend] Error: Missing resumeId or analysisId in /analyze-all response`, data);
        setError('분석 실패: 서버에서 이력서 ID 또는 분석 ID를 반환하지 않았습니다. 다시 시도해주세요.');
        stopLoading();
        dispatch({ type: 'SET_LOADING', loading: false, message: '' });
        return;
      }
      const reindexedExperiences = (data.selectedExperiences || []).map((exp, idx) => ({
        ...exp,
        index: idx,
        whySelected: exp.whySelected || {
          resumeFact: '이력서 기반 정보',
          topicLogic: '주제 연결성',
          competencyProof: '역량 어필 가능성',
          advantageOverOthers: '차별화 요소'
        },
        questionTemplates: exp.questionTemplates || {
          situation: '상황 질문',
          action: '행동 질문',
          result: '결과 질문'
        },
        episodeDirection: exp.episodeDirection || '에피소드 방향성 설명'
      }));
      console.log(`[${new Date().toISOString()}] handleAnalysisSubmit: resumeId='${data.resumeId}' exists`);
      localStorage.setItem('resumeId', data.resumeId);
      const updatedCompanyInfo = data.companyInfo || {};
      dispatch({
        type: 'SET_ANALYSIS',
        resumeId: data.resumeId,
        analysisId: data.analysisId,
        analysisData: data,  // ← 이거 추가 (응답 전체 저장)
        companyInfo: updatedCompanyInfo,
        competencies: data.competencies,
        selectedExperiences: reindexedExperiences,
        selectedExperiencesIndices: Array(data.questionTopics.length).fill(null),
        questionTopics: data.questionTopics,
        selectedForTopics: data.selectedForTopics || []
      });
      
      // ✅ 완료 알림 발송
      sendNotification(
        '딥글 이력서 분석 완료',
        `이력서 분석이 완료되었습니다. 경험을 선택해주세요.`
      );
      
      goToDirectionSelection(data.resumeId, data.analysisId);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [DEBUG-Stage2-Frontend] Error in handleAnalysisSubmit:`, error.message);
      setError(`서버에 문제가 생겼습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);
  const typingMsgIdRef = useRef(null);

  const typewriterEffect = (text, onComplete) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    if (typingMsgIdRef.current) {
      const tempId = typingMsgIdRef.current;
      setChatHistory(prev => prev.filter(m => m._tempTypingId !== tempId));
      typingMsgIdRef.current = null;
    }
    setIsTyping(true);
    setTypingMessage('');
    const tempId = `typing-${Date.now()}`;
    typingMsgIdRef.current = tempId;
    setChatHistory(prev => [
      ...prev,
      { sender: '딥글', message: '', _tempTypingId: tempId }
    ]);
    let i = 0;
    typingTimerRef.current = setInterval(() => {
      if (i < text.length) {
        const next = text.slice(0, i + 1);
        setTypingMessage(next);
        setChatHistory(prev =>
          prev.map(m => (m._tempTypingId === tempId ? { ...m, message: next } : m))
        );
        i++;
      } else {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setIsTyping(false);
        setTypingMessage('');
        setChatHistory(prev => prev.filter(m => m._tempTypingId !== tempId));
        typingMsgIdRef.current = null;
        if (onComplete) onComplete();
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);

  // ✅ 수정: handleDirectionSuggestion
  const handleDirectionSuggestion = async (resumeId, analysisId) => {
    console.log(`[${new Date().toISOString()}] Starting handleDirectionSuggestion for resumeId: ${resumeId}, analysisId: ${analysisId}`);
    
    startLoading('suggest-direction', { 
      company: state.companyInfo.company,
      topic: state.questionTopics[currentExperienceStep - 1] || '주제'
    });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      const requestBody = {
        resumeId,
        analysisId,
        currentStep: currentExperienceStep,
        questionTopics: state.questionTopics
      };
   
      const response = await authFetch('https://youngsun-xi.vercel.app/suggest-direction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '방향성 제안에 실패했습니다.');
      }
      const data = await response.json();
      if (data.error) {
        if (data.code === 'NO_EXPERIENCES') {
          throw new Error(`${data.error}\n\n이력서를 보완하거나 다른 주제를 선택해주세요.`);
        }
        throw new Error(data.details || '방향성 제안에 문제가 생겼습니다.');
      }
      if (!data.selectedExperiences || data.selectedExperiences.length < 1) {
        throw new Error('적합한 경험이 없습니다. 이력서를 보완해주세요.');
      }
      const currentTopic = state.questionTopics[currentExperienceStep - 1];
      const isValidTopic = data.selectedExperiences.every(exp => exp.topic === currentTopic);
      if (!isValidTopic) {
        throw new Error(`경험 주제가 ${currentTopic}와 맞지 않습니다.`);
      }
      const updatedExperiences = data.selectedExperiences.map((exp, idx) => ({
        ...exp,
        whySelected: exp.whySelected || {
          resumeFact: '이력서 기반 정보',
          topicLogic: '주제 연결성',
          competencyProof: '역량 어필 가능성',
          advantageOverOthers: '차별화 요소'
        },
        questionTemplates: exp.questionTemplates || {
          situation: '상황 질문',
          action: '행동 질문',
          result: '결과 질문'
        },
        episodeDirection: exp.episodeDirection || '에피소드 방향성 설명'
      }));
      let newSelectedIndices = [...state.selectedExperiencesIndices];
      while (newSelectedIndices.length <= currentExperienceStep - 1) {
        newSelectedIndices.push(null);
      }
      if (state.resumeId) {
        console.log(`[${new Date().toISOString()}] handleDirectionSuggestion: resumeId='${state.resumeId}' exists`);
      }
      dispatch({
        type: 'SET_ANALYSIS',
        resumeId: state.resumeId,
        analysisId: state.analysisId,
        selectedExperiences: updatedExperiences,
        selectedExperiencesIndices: newSelectedIndices
      });
      const sourceArray = Array.isArray(data.source) ? data.source.map(url => url.trim()) : (typeof data.source === 'string' ? data.source.split(',').map(url => url.trim()) : []);
      dispatch({
        type: 'SET_SUGGESTION',
        suggestion: '방향성 제안 완료',
        source: sourceArray,
        trendInfo: data.trendInfo || ''
      });
      console.log(`[${new Date().toISOString()}] Success: Direction suggestion completed for topic: ${currentTopic}`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in handleDirectionSuggestion: ${error.message}`);
      setError(`방향성 제안에 실패했습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  const handleScenarioSelect = (index) => {
    const currentTopic = state.questionTopics[currentExperienceStep - 1];
    const topicExperiences = state.selectedExperiences.filter(exp => exp.topic === currentTopic);
    const selectedExperience = topicExperiences[index];
    if (selectedExperience) {
      const newSelected = [...state.selectedExperiencesIndices];
      while (newSelected.length <= currentExperienceStep - 1) {
        newSelected.push(null);
      }
   
      const actualIndex = state.selectedExperiences.findIndex(exp =>
        exp.company === selectedExperience.company &&
        exp.topic === selectedExperience.topic &&
        exp.description === selectedExperience.description
      );
   
      newSelected[currentExperienceStep - 1] = actualIndex >= 0 ? actualIndex : selectedExperience.index;
      dispatch({ type: 'SET_ANALYSIS', selectedExperiencesIndices: newSelected });
      console.log(`[${new Date().toISOString()}] Scenario selected: ${selectedExperience.company} (actualIndex: ${actualIndex}) for topic: ${currentTopic}`);
    }
  };

  // ✅ 수정: handleStartExtraction
  const handleStartExtraction = async () => {
    console.log(`[${new Date().toISOString()}] Starting handleStartExtraction for step: ${currentExperienceStep}`);
    const currentTopicIndex = currentExperienceStep - 1;
    const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
    if (selectedIndex === undefined || selectedIndex === null || !Array.isArray(state.selectedExperiences) || selectedIndex < 0 || selectedIndex >= state.selectedExperiences.length) {
      setError('경험을 선택해주세요');
      return;
    }
    
    startLoading('generate-question', { 
      company: state.companyInfo.company,
      topic: state.questionTopics[currentTopicIndex] || '주제'
    });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: true, message: '' });
    
    try {
      const currentTopic = state.questionTopics[currentTopicIndex];
      const selectedExperience = state.selectedExperiences[selectedIndex];
   
      if (!selectedExperience || selectedExperience.topic !== currentTopic) {
        throw new Error('선택된 경험이 유효하지 않거나 주제와 맞지 않습니다.');
      }
      setChatHistory([]);
      setQuestionCount(0);
      setCurrentQuestionHint('');
      
      console.log('[DEBUG] API 호출 전:', {
        resumeId: state.resumeId,
        analysisId: state.analysisId,
        questionTopics: state.questionTopics,
        selectedExperiencesIndices: state.selectedExperiencesIndices
      });
     
      const response = await authFetch('https://youngsun-xi.vercel.app/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          analysisData: state.analysisData,  // ← 이거 추가
          selectedExperienceIndices: state.selectedExperiencesIndices,
          chatHistory: [],
          questionTopics: state.questionTopics,
          topicIndex: currentTopicIndex,
          step: 1,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'INVALID_RESUME_ID') {
          setError('이력서 ID가 일치하지 않습니다. 처음부터 다시 시작해주세요.');
          setScreen('start');
          stopLoading();
          dispatch({ type: 'SET_LOADING', loading: false, message: '' });
          dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
          return;
        }
        throw new Error('질문 생성에 실패했습니다.');
      }
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] /generate-question response:`, data);
      if (data.error) {
        setChatHistory([{ sender: '딥글', message: data.error }]);
        setError(data.details || '질문 생성에 문제가 생겼습니다.');
        stopLoading();
        dispatch({ type: 'SET_LOADING', loading: false, message: '' });
        dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
        return;
      }
     
      if (data.hint) {
        setCurrentQuestionHint(data.hint);
        console.log(`[${new Date().toISOString()}] Hint received: "${data.hint}"`);
      }

      /// v25.3: STAR inputFields 저장 + 타이프라이터 효과
      if (data.inputFields) {
        setInputFields(data.inputFields);
        setInputMode('star');
        setStarInputs({ situation: '', task: '', action: '', result: '' });
        
        // ✅ 즉시 placeholder 설정
        const targets = {};
        data.inputFields.forEach(field => {
          targets[field.key] = {
            line1: field.placeholder?.line1 || '',
            line2: field.placeholder?.line2 || ''
          };
        });
        setStarDisplayTexts(targets);
        
        console.log(`[${new Date().toISOString()}] STAR inputFields received:`, data.inputFields);
      }
      
      // ✅ 완료 알림 발송
      sendNotification(
        '딥글 질문 준비 완료',
        `${state.questionTopics[currentTopicIndex]} 경험 구체화를 시작합니다.`
      );
     
      dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
      typewriterEffect(data.question, () => {
        setChatHistory([{ sender: '딥글', message: data.question, hint: data.hint || '' }]);
        setQuestionCount(1);
      });
   
      setShowPlanTransitionPopup(false);
      setScreen('experience-extraction');
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in handleStartExtraction: ${error.message}`);
      setError(`채팅 시작에 실패했습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  const handleGenerateQuestion = async (answer, currentStep) => {
    console.log(`[${new Date().toISOString()}] [DEBUG] currentStep: ${currentStep}`);
    try {
      const currentTopic = state.questionTopics[currentExperienceStep - 1];
   
      if (answer) {
        console.log(`[${new Date().toISOString()}] user answer: '${answer}'`);
        setChatHistory(prev => [...prev, { sender: '나', message: answer }]);
        console.log(`[${new Date().toISOString()}] step ${currentStep - 1} question success`);
      }
      dispatch({ type: 'SET_CHAT_LOADING', chatLoading: true, message: '생각 중...' });
      const response = await authFetch('https://youngsun-xi.vercel.app/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          analysisData: state.analysisData,
          previousAnswer: answer || '',
          selectedExperienceIndices: state.selectedExperiencesIndices,
          chatHistory,
          questionTopics: state.questionTopics,
          topicIndex: currentExperienceStep - 1,
          step: currentStep,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'INVALID_RESUME_ID') {
          setError('이력서 ID가 일치하지 않습니다. 처음부터 다시 시작해주세요.');
          setScreen('start');
          dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
          return;
        }
        throw new Error('질문 가져오기에 실패했습니다.');
      }
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] /generate-question response:`, data);
      
   // ✅ Phase 2 전환: 일반텍스트로 Phase 1 완료 시 fetchEpisodeDetailQuestion 직접 호출
   console.log('[DEBUG_PHASE2] phaseNumber:', data.phaseNumber, typeof data.phaseNumber, 'inputType:', data.inputType, 'inputFields:', data.inputFields);
   if (data.phaseNumber === 2) {
    console.log('[Phase2] 일반텍스트 Phase 1 완료 → fetchEpisodeDetailQuestion 호출');
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
    await fetchEpisodeDetailQuestion();
    return;
  }
      
      if (data.error) {
        setChatHistory(prev => [...prev, { sender: '딥글', message: data.error, type: 'error' }]);
        setError(data.details || '질문 생성에 문제가 생겼습니다.');
        if (data.retry) {
          setQuestionCount(currentStep);
          dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
          return;
        }
        throw new Error(data.details || '질문 생성에 문제가 생겼습니다.');
      }
      const message = data.question;
      const sourceArray = Array.isArray(data.source) ? data.source.map(url => url.trim()) : (typeof data.source === 'string' ? data.source.split(',').map(url => url.trim()) : []);
      console.log(`[${new Date().toISOString()}] step ${currentStep} question start: '${message}'`);
   
      if (data.hint) {
        setCurrentQuestionHint(data.hint);
        console.log(`[${new Date().toISOString()}] New hint received: "${data.hint}"`);
      }
      
      // 객관식 헬프용 phaseNumber 저장
      if (data.phaseNumber !== undefined) {
        setCurrentPhaseNumber(data.phaseNumber);
        console.log(`[${new Date().toISOString()}] Phase number received: ${data.phaseNumber}`);
      }
// v25.3: STAR inputFields 업데이트 + 타이프라이터 효과
if (data.inputFields && data.phaseNumber !== 2) {
  setInputFields(data.inputFields);
  setInputMode('star');
  setStarInputs({ situation: '', task: '', action: '', result: '' });
  
  // ✅ Phase 1 시작 표시 (최초 시작 시에만)
  if (currentPhaseNumber === 0) {
    setCurrentPhaseNumber(1);
  }
  setCurrentStarStep('S');
  
  // ✅ 즉시 placeholder 설정
  const targets = {};
  data.inputFields.forEach(field => {
    targets[field.key] = {
      line1: field.placeholder?.line1 || '',
      line2: field.placeholder?.line2 || ''
    };
  });
  setStarDisplayTexts(targets);
  
  console.log(`[${new Date().toISOString()}] STAR started (Phase ${currentPhaseNumber || 1}), inputFields updated:`, data.inputFields);
}
   
      dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
   
      const fullMessage = `${message}${data.trendInfo ? `\n\n최신 트렌드: ${data.trendInfo}` : ''}${sourceArray.length ? `\n\n출처: ${sourceArray.join(', ')}` : ''}`;
   
      typewriterEffect(fullMessage, () => {
        setChatHistory(prev => [...prev, {
          sender: '딥글',
          message: fullMessage,
          hint: data.hint || ''
        }]);
        setQuestionCount(currentStep);
     
        if (data.needsEnd) {
          // 종료 시 STAR 입력칸 숨기기
          setInputFields(null);
          setInputMode('text');
          
          setTimeout(() => {
            typewriterEffect(`자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`, () => {
              setChatHistory(prev => [...prev, {
                sender: '딥글',
                message: `자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`
              }]);
              setQuestionCount(0);
              setTimeout(() => {
                handleSummarizeEpisodes();
              }, 1500);
            });
          }, 1000);
        }
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in handleGenerateQuestion: ${error.message}`);
      setChatHistory(prev => [...prev, { sender: '딥글', message: `서버에 문제가 생겼습니다: ${error.message}`, type: 'error' }]);
      setError(`질문 가져오기에 실패했습니다: ${error.message}`);
    }
    dispatch({ type: 'SET_CHAT_LOADING', chatLoading: false });
    setCurrentAnswer('');
  };
  const handleChatSubmit = async () => {
    if (isSubmitting) return;
    // v25.3: 입력 모드에 따라 다른 데이터 처리
    let userAnswer;
    if (inputMode === 'star') {
      const hasAnyInput = Object.values(starInputs).some(v => v.trim());
      if (!hasAnyInput) return;
      userAnswer = { ...starInputs };
    } else {
      if (!currentAnswer.trim()) return;
      userAnswer = currentAnswer;
    }
    
    setIsSubmitting(true);
    
// STAR 모드일 때: 순차 진행 로직 (메인질문 유지, 애니메이션 없음)
if (inputMode === 'star' && currentStarStep !== 'DONE') {
  const starOrder = ['S', 'T', 'A', 'R'];
  const currentIndex = starOrder.indexOf(currentStarStep);
  
  setIsSubmitting(false);
  
  if (currentIndex < 3) {
    // S, T, A 완료 → 다음 STAR 질문 요청
    await fetchNextStarQuestion(currentStarStep);
  } else {
    // R 완료 → Phase 구분
    if (currentPhaseNumber < 2) {
      // Phase 1 R 완료 → Phase 2 메인질문 + STAR 시작
      await fetchEpisodeDetailQuestion();
    } else {
      // Phase 2 R 완료 → complete-star-mcq 호출 후 에피소드 생성
      setCurrentStarStep('DONE');
      setInputMode('text');
      const currentTopic = state.questionTopics[currentExperienceStep - 1] || '경험';
      
      // ✅ 먼저 complete-star-mcq 호출 (isComplete: true 저장)
      try {
        const starAnswers = {
          S: starInputs.situation || '',
          T: starInputs.task || '',
          A: starInputs.action || '',
          R: starInputs.result || ''
        };
        
        await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/complete-star-mcq`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: currentProjectId,
            questionId: currentQuestionId,
            starAnswers
          })
        });
        console.log('[DEBUG] Phase 2 complete-star-mcq called successfully');
      } catch (error) {
        console.error('[DEBUG] Phase 2 complete-star-mcq failed:', error);
      }
      
      // ✅ 그 다음 에피소드 생성
      typewriterEffect(`자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`, () => {
        setChatHistory(prev => [...prev, {
          sender: '딥글',
          message: `자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`
        }]);
        setTimeout(() => {
          handleSummarizeEpisodes();
        }, 1500);
      });
    }
  }
  return;
}
    
 // Phase 2 텍스트 제출: 에피소드 생성으로 직행
 if (currentPhaseNumber === 2) {
  setIsSubmitting(false);
  const currentTopic = state.questionTopics[currentExperienceStep - 1] || '경험';
  
  // chatHistory에 사용자 답변 추가
  setChatHistory(prev => [...prev, { sender: '나', message: userAnswer }]);
  setCurrentAnswer('');
  
  typewriterEffect(`자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`, () => {
    setChatHistory(prev => [...prev, {
      sender: '딥글',
      message: `자, 이제 ${currentTopic} 구체화가 끝났습니다. 에피소드를 생성하겠습니다.`
    }]);
    setTimeout(() => {
      handleSummarizeEpisodes();
    }, 1500);
  });
  return;
}

// 텍스트 모드: 기존 로직 (메인 질문 버블 페이드아웃)
const currentBubble = document.querySelector('.focus-question-bubble');
if (currentBubble) {
  currentBubble.style.animation = 'slideOutToRight 0.6s ease-in-out forwards';
}

setTimeout(async () => {
  setIsSubmitting(false);
  
  const currentStep = questionCount;
  
  // 입력 리셋
  setCurrentAnswer('');
  
  // 질문 생성
  handleGenerateQuestion(userAnswer, currentStep + 1);
}, 800);
};
  // ✅ 수정: handleSummarizeEpisodes


  const handleSummarizeEpisodes = async () => {
    console.log(`[${new Date().toISOString()}] Starting handleSummarizeEpisodes for topic: ${state.questionTopics[currentExperienceStep - 1]}`);
    
    startLoading('generate-episode', { 
      company: state.companyInfo.company,
      topic: state.questionTopics[currentExperienceStep - 1] || '주제'
    });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      const currentTopic = state.questionTopics[currentExperienceStep - 1];
      const currentTopicIndex = currentExperienceStep - 1;
      const selectedIndex = state.selectedExperiencesIndices[currentTopicIndex];
      if (!chatHistory || chatHistory.length <= 1) {
        throw new Error('채팅 기록이 부족합니다.');
      }
      if (selectedIndex === undefined || selectedIndex === null) {
        throw new Error(`주제 ${currentTopic}에 선택된 경험이 없습니다.`);
      }
      console.log(`[${new Date().toISOString()}] Sending /generate-episode with selectedExperienceIndices:`, state.selectedExperiencesIndices);
      const response = await authFetch('https://youngsun-xi.vercel.app/generate-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          chatHistory,
          questionTopics: state.questionTopics,
          currentTopic,
          selectedExperienceIndices: state.selectedExperiencesIndices,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'INVALID_RESUME_ID') {
          setError('이력서 ID가 일치하지 않습니다. 처음부터 다시 시작해주세요.');
          setScreen('start');
          stopLoading();
          dispatch({ type: 'SET_LOADING', loading: false, message: '' });
          return;
        }
        throw new Error(`에피소드 생성에 실패했습니다: ${errorData.details || response.statusText}`);
      }
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] /generate-episode response:`, data);
      if (data.error) {
        throw new Error(data.details || '에피소드 생성에 문제가 생겼습니다.');
      }
      if (!data.episode) {
        throw new Error('완성된 에피소드가 없습니다. 채팅 기록이 부족하거나 주제가 맞지 않을 수 있습니다.');
      }
      const newEpisode = {
        topic: currentTopic,
        episode: data.episode,
        keywords: data.keywords || [],
        company: data.company || state.selectedExperiences?.[state.selectedExperiencesIndices[currentExperienceStep - 1]]?.company || '',
        competency: data.competency || state.selectedExperiences?.[state.selectedExperiencesIndices[currentExperienceStep - 1]]?.competency || '',
        talentProfile: state.talentProfile || '',
        coreCompetency: state.coreCompetency || data.competency || state.selectedExperiences?.[state.selectedExperiencesIndices[currentExperienceStep - 1]]?.competency || ''
      };
      const newEpisodeAnalysis = {
        topic: currentTopic,
        overview: `${currentTopic} 주제로 작성된 에피소드`,
        features: `키워드: ${(data.keywords || []).join(', ')}`
      };
      dispatch({
        type: 'SET_SUMMARIZED_EPISODES',
        summarizedEpisodes: [...state.summarizedEpisodes, newEpisode]
      });
      dispatch({
        type: 'SET_EPISODE_ANALYSIS',
        episodeAnalysis: [...state.episodeAnalysis, newEpisodeAnalysis]
      });
      if (state.resumeId) {
        console.log(`[${new Date().toISOString()}] handleSummarizeEpisodes: resumeId='${state.resumeId}' exists`);
      }
      dispatch({
        type: 'SET_ANALYSIS',
        selectedExperiences: [],
        selectedExperiencesIndices: Array(state.questionTopics.length).fill(null),
        resumeId: state.resumeId,
        analysisId: state.analysisId
      });
      if (currentExperienceStep === state.questionTopics.length) {
        setChatHistory([]);
        setQuestionCount(0);
      }
      
 // ✅ 완료 알림 발송 - 생성 완료 + DB 저장 알림
 const experienceCompany = state.selectedExperiences?.[selectedIndex]?.company || currentTopic;
 sendNotification(
   '딥글 에피소드 생성 완료',
   `${currentTopic} 에피소드가 완성되었습니다. ${experienceCompany}의 새로운 에피소드가 데이터베이스에 저장되었습니다.`
 );
      
      console.log(`[${new Date().toISOString()}] Success: Episode generation completed for topic: ${currentTopic}`);
      goToSummarizedEpisodeReview();
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in handleSummarizeEpisodes: ${error.message}`);
      setError(`에피소드 생성에 실패했습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  const goToCoverLetterCompletion = () => {
    setCurrentProcessStep(5);
    setScreen('cover-letter-completion');
  };

  // ✅ 수정: handlePlanRequest - 완료 알림 추가
  const handlePlanRequest = async () => {
    console.log(`[${new Date().toISOString()}] Before /generate-plan:`, {
      resumeId: state.resumeId,
      analysisId: state.analysisId,
      companyInfo: state.companyInfo,
      summarizedEpisodes: state.summarizedEpisodes
    });
    
    startLoading('generate-plan', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      if (!state.analysisId && !currentProjectId && !currentQuestionId) {
        throw new Error('분석 데이터가 없습니다. 다시 시도해주세요.');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);
      const response = await authFetch('https://youngsun-xi.vercel.app/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          companyInfo: state.companyInfo,
          chatHistory,
          questionTopics: state.questionTopics,
          summarizedEpisodes: state.summarizedEpisodes,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('계획서 생성 실패');
      const data = await response.json();
      if (data.error) {
        setError(`계획서 생성 실패: ${data.details}`);
        setChatHistory([...chatHistory, { sender: '딥글', message: `계획서 생성 실패: ${data.details}` }]);
      } else {
        const sourceArray = Array.isArray(data.source) ? data.source :
                          (typeof data.source === 'string' ? data.source.split(',').map(url => url.trim()) : []);
        
        // 🆕 응답에서 company 가져오기 (fallback 처리)
        const companyName = state.companyInfo?.company || data.company || '';
     
        dispatch({
          type: 'SET_PLAN',
          plan: data.plan,
          source: sourceArray,
          processing: data.processing,
          nextStep: data.nextStep,
          summarizedExperiences: data.summarizedExperiences
        });
        setChatHistory([...chatHistory, { sender: '딥글', message: '계획서가 준비되었습니다. 확인해보세요.' }]);
        
        // ✅ 완료 알림 발송
        sendNotification(
          '딥글 계획서 완료',
          `${companyName} 자소서 계획서가 준비되었습니다.`
        );
        
        goToPlanView();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('요청이 너무 오래 걸려 중단되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(`계획서 생성에 실패했습니다: ${error.message}`);
      }
      setChatHistory([...chatHistory, { sender: '딥글', message: '서버에 문제가 생겼습니다...' }]);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

// ✅ 수정: handleGenerateCoverLetter - 완료 알림 추가
  const handleGenerateCoverLetter = async () => {
    console.log(`[${new Date().toISOString()}] Before /generate-cover-letter:`, {
      resumeId: state.resumeId,
      analysisId: state.analysisId,
      plan: state.plan
    });
    
    startLoading('generate-cover-letter', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      if (!state.plan) {
        throw new Error('계획서가 없습니다. 다시 시도해주세요.');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      const response = await authFetch('https://youngsun-xi.vercel.app/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: state.plan,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('자소서 생성 실패');
      const data = await response.json();
      if (data.error) {
        setError(`자소서 생성 실패: ${data.details}`);
        setChatHistory([...chatHistory, { sender: '딥글', message: `자소서 생성 실패: ${data.details}` }]);
      } else {
        // 🆕 응답에서 company 가져오기 (fallback 처리)
        const companyName = state.companyInfo?.company || data.company || '';
        
        dispatch({
          type: 'SET_COVER_LETTER',
          paragraphs: data.paragraphs || []
        });
        dispatch({
          type: 'SET_AI_SCREENING',
          suggestions: data.suggestions || []
        });
        dispatch({
          type: 'SET_AI_PROOFREADING',
          suggestions: []
        });
        setChatHistory([...chatHistory, { sender: '딥글', message: '자소서가 완성되었습니다. 문단별로 수정해보세요.' }]);
  // ✅ 완료 알림 발송 - 생성 완료 + DB 저장 알림
  sendNotification(
    '딥글 자소서 완료',
    `${companyName} 자소서 초안이 완성되었습니다. ${companyName}의 새로운 자기소개서가 데이터베이스에 저장되었습니다.`
  );
        
        goToCoverLetterView();
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('요청이 너무 오래 걸려 중단되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(`자소서 생성에 실패했습니다: ${error.message}`);
      }
      setChatHistory([...chatHistory, { sender: '딥글', message: '서버에 문제가 생겼습니다...' }]);
    }

    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  const handleSaveParagraph = async (paragraphId, editedText) => {
    console.log(`[${new Date().toISOString()}] Saving paragraph:`, { paragraphId, editedText });
    try {
      const updatedParagraphs = state.coverLetterParagraphs.map(paragraph =>
        paragraph.id === paragraphId ? { ...paragraph, text: editedText } : paragraph
      );
      dispatch({
        type: 'SET_COVER_LETTER',
        paragraphs: updatedParagraphs
      });
      localStorage.setItem(`coverLetter_${state.resumeId}`, JSON.stringify(updatedParagraphs));
      
      // DB 업데이트 (edit_history 트리거 발동)
      const fullText = updatedParagraphs.map(p => p.text).join('\n\n');
      fetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/update-cover-letter-text`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProjectId,
          questionId: currentQuestionId,
          contentText: fullText
        })
      }).catch(err => console.warn('[DB_SYNC] 자소서 DB 동기화 실패:', err));
      
      setChatHistory([...chatHistory, { sender: '딥글', message: `문단 ${paragraphId} 저장 완료` }]);
      goToCoverLetterView();
    } catch (error) {
      setError(`문단 저장 실패: ${error.message}`);
      setChatHistory([...chatHistory, { sender: '딥글', message: '문단 저장에 문제가 생겼습니다...' }]);
    }
  };

  // ✅ 수정: handleFinalizeCoverLetter - 완료 알림 추가
  const handleFinalizeCoverLetter = async () => {
    console.log(`[${new Date().toISOString()}] Finalizing cover letter:`, {
      resumeId: state.resumeId,
      paragraphs: state.coverLetterParagraphs
    });
    
    startLoading('edit-cover-letter', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    dispatch({ type: 'SET_PROOFREADING_POPUP', show: true });
    
    try {
      if (!state.coverLetterParagraphs.length) {
        throw new Error('자소서 문단이 없습니다. 먼저 자소서를 생성해주세요.');
      }
      
      console.log(`[DEBUG] 전송할 paragraphs:`, state.coverLetterParagraphs);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      
      console.log(`[${new Date().toISOString()}] [Proofreading] Sending request to /edit-cover-letter`);
      
      const response = await authFetch('https://youngsun-xi.vercel.app/edit-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphs: state.coverLetterParagraphs,
          plan: state.plan,
          projectId: currentProjectId,
          questionId: currentQuestionId
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`첨삭 실패: HTTP ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`첨삭 실패: ${data.error}`);
      }
      
      console.log(`[${new Date().toISOString()}] [Proofreading] Response received:`, data);
      console.log(`[DEBUG] data.paragraphs:`, data.paragraphs);
      
      // 🔥 수정: editInstructions도 함께 저장
      const editedParagraphs = data.paragraphs.map(p => {
        console.log(`[DEBUG] 문단 ${p.id}: original=${p.original?.substring(0, 50)}..., edited=${p.edited?.substring(0, 50)}...`);
        return {
          id: p.id,
          text: p.edited,
          originalText: p.original,
          originalCharCount: p.originalCharCount,
          editedCharCount: p.editedCharCount,
          // 🔥 NEW: 수정 내용 저장
          editInstructions: p.editMetadata?.editInstructions || []
        };
      });
      
      console.log(`[DEBUG] editedParagraphs 최종:`, editedParagraphs);
      
      dispatch({
        type: 'SET_COVER_LETTER',
        paragraphs: editedParagraphs
      });
      
      setCurrentProcessStep(5);
      setIsProofreadingComplete(true);
      
      setChatHistory([...chatHistory, { 
        sender: '딥글', 
        message: `첨삭이 완료되었습니다. (${data.totalOriginalCharacters}자 → ${data.totalEditedCharacters}자)` 
      }]);
      
      // ✅ 완료 알림 발송
      sendNotification(
        '딥글 첨삭 완료',
        `자소서 첨삭이 완료되었습니다. (${data.totalOriginalCharacters}자 → ${data.totalEditedCharacters}자)`
      );
      
      console.log(`[${new Date().toISOString()}] [Proofreading] ✅ 첨삭 완료 - 문단이 업데이트됨`);
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [Proofreading] Error:`, error.message);
      if (error.name === 'AbortError') {
        setError('첨삭 요청이 너무 오래 걸려 중단되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(`첨삭 실패: ${error.message}`);
      }
      setChatHistory([...chatHistory, { sender: '딥글', message: `첨삭에 문제가 생겼습니다: ${error.message}` }]);
    } finally {
      stopLoading();
      dispatch({ type: 'SET_LOADING', loading: false, message: '' });
      dispatch({ type: 'SET_PROOFREADING_POPUP', show: false });
    }
  };

  const handleCompleteCoverLetter = async () => {
    console.log(`[${new Date().toISOString()}] Completing cover letter:`, {
      resumeId: state.resumeId,
      paragraphs: state.coverLetterParagraphs
    });
    try {
      if (!state.coverLetterParagraphs.length) {
        throw new Error('자소서 문단이 없습니다. 먼저 자소서를 생성해주세요.');
      }
      dispatch({
        type: 'SET_COVER_LETTER_TEXT',
        text: state.coverLetterParagraphs.map(p => p.text).join('\n\n')
      });
      setChatHistory([...chatHistory, { sender: '딥글', message: '최종 자소서가 준비되었습니다. 확인해보세요.' }]);
      goToCoverLetterCompletion();
    } catch (error) {
      setError(`최종 자소서 준비 실패: ${error.message}`);
      setChatHistory([...chatHistory, { sender: '딥글', message: '최종 자소서 준비에 문제가 생겼습니다...' }]);
    }
  };

  ///end of section 1//


/// ✅ 수정: 전체화면 로딩 (탭바 기준 중앙정렬, 파동 애니메이션)
const LoadingModal = ({ message }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: '80px',
    right: 0,
    bottom: 0,
    background: '#FBFBFD',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <DeepGlLogo size={80} />
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          animation: 'loadingPulse1 2.5s ease-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          animation: 'loadingPulse2 2.5s ease-out infinite',
          animationDelay: '0.8s',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(75, 85, 99, 0.1)',
          animation: 'loadingPulse3 2.5s ease-out infinite',
          animationDelay: '1.6s',
          pointerEvents: 'none'
        }} />
      </div>
      <p style={{
        color: '#4B5563',
        fontSize: '17px',
        fontWeight: '500',
        margin: 0
      }}>{message}</p>
    </div>
  </div>
);

// 객관식 경험 추출 모달 컴포넌트
const McqModal = ({ 
  isOpen, 
  onClose, 
  step, 
  question, 
  options,
  setOptions,
  editingOptionId,
  setEditingOptionId,
  selectedMcqOptionId,
  setSelectedMcqOptionId,
  loading, 
  showResult, 
  generatedAnswer, 
  stakeholderQuestion,
  onSelect, 
  onConfirm, 
  onRegenerate 
}) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 9998
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px',
        minWidth: '400px',
        maxWidth: '560px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: 9999
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#1D1D1F'
            }}>
              {showResult ? '답변 생성 완료' : `객관식 질문 ${step}/3`}
            </h3>
            {!showResult && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: '#86868B'
              }}>
                가장 적합한 선택지를 골라주세요
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#86868B',
              padding: '4px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        
        {/* 로딩 상태 */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0'
          }}>
            <div className="loading-spinner" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#86868B', fontSize: '15px' }}>
              {showResult ? '답변을 생성하고 있어요...' : '질문을 준비하고 있어요...'}
            </p>
          </div>
        )}
        
        {/* 결과 화면 */}
        {!loading && showResult && (
          <div>
            <p style={{
              fontSize: '15px',
              color: '#86868B',
              marginBottom: '12px'
            }}>
              이렇게 답하면 될 것 같아요 : <span style={{ color: '#1D1D1F', fontWeight: '500' }}>{stakeholderQuestion}</span>
            </p>
            <div style={{
              padding: '20px',
              background: 'rgba(74, 85, 104, 0.05)',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#1D1D1F'
              }}>
                {generatedAnswer}
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <button
                onClick={onRegenerate}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  border: '1px solid rgba(74, 85, 104, 0.3)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#4A5568',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(74, 85, 104, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                재생성
              </button>
              <button
                onClick={onConfirm}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #4A5568, #2D3748)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(74, 85, 104, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
        
        {/* 질문 & 선택지 */}
        {!loading && !showResult && (
          <div>
            <p style={{
              fontSize: '17px',
              fontWeight: '500',
              color: '#1D1D1F',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {question}
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
        {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => {
                    if (editingOptionId !== `mcq-${option.id}`) {
                      setSelectedMcqOptionId(option.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: selectedMcqOptionId === option.id ? 'rgba(74, 85, 104, 0.08)' : 'transparent',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selectedMcqOptionId === option.id ? '2px solid rgba(74, 85, 104, 0.4)' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMcqOptionId !== option.id) {
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMcqOptionId !== option.id) {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* 번호 뱃지 */}
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: selectedMcqOptionId === option.id ? 'rgba(74, 85, 104, 0.2)' : 'rgba(74, 85, 104, 0.1)',
                    borderRadius: '50%',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#4A5568',
                    flexShrink: 0
                  }}>
                    {option.id}
                  </span>
                  {/* 텍스트 영역 */}
                  <div style={{ flex: 1 }}>
                    {editingOptionId === `mcq-${option.id}` ? (
                      <input
                        type="text"
                        value={option.text}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setOptions(prev => prev.map(o => 
                            o.id === option.id ? { ...o, text: newText } : o
                          ));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingOptionId(null);
                          }
                        }}
                        onBlur={() => setEditingOptionId(null)}
                        autoFocus
                        style={{
                          width: '100%',
                          fontSize: '15px',
                          color: '#1D1D1F',
                          padding: '8px 12px',
                          border: '1px solid rgba(107, 114, 128, 0.3)',
                          borderRadius: '8px',
                          outline: 'none',
                          background: 'white'
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: '15px',
                        color: '#1D1D1F'
                      }}>
                        {option.text}
                      </span>
                    )}
                  </div>
                  {/* 연필 아이콘 */}
                  {editingOptionId !== `mcq-${option.id}` && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingOptionId(`mcq-${option.id}`);
                      }}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        opacity: 0.5,
                        transition: 'opacity 0.2s ease',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 선택 완료 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={() => {
                  if (selectedMcqOptionId !== null) {
                    const selectedOption = options.find(o => o.id === selectedMcqOptionId);
                    if (selectedOption) {
                      onSelect(selectedOption);
                      setSelectedMcqOptionId(null);
                    }
                  }
                }}
                disabled={selectedMcqOptionId === null}
                style={{
                  padding: '12px 32px',
                  background: selectedMcqOptionId !== null ? 'rgba(74, 85, 104, 0.9)' : 'rgba(107, 114, 128, 0.3)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'white',
                  cursor: selectedMcqOptionId !== null ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedMcqOptionId !== null) {
                    e.currentTarget.style.background = 'rgba(74, 85, 104, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMcqOptionId !== null) {
                    e.currentTarget.style.background = 'rgba(74, 85, 104, 0.9)';
                  }
                }}
              >
                선택 완료
              </button>
            </div>

            {/* 진행 표시 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px'
            }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: s === step ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: s <= step ? '#4A5568' : 'rgba(74, 85, 104, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// 🔥 NEW: 수정 내용 팝업 컴포넌트
const EditInfoPopup = ({ paragraphId, editInstructions, onClose }) => {
  if (!editInstructions || editInstructions.length === 0) {
    return (
      <>
        <div 
          className="modal-overlay" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9998
          }}
        />
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '320px',
          maxWidth: '480px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #E5E7EB',
          zIndex: 9999
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1D1D1F'
            }}>
              문단 {paragraphId} 수정 내용
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#86868B',
                padding: '4px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <p style={{ 
            color: '#86868B', 
            fontSize: '14px',
            margin: 0 
          }}>
            수정 내용이 없습니다.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 9998
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '320px',
        maxWidth: '480px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        border: '1px solid #E5E7EB',
        zIndex: 9999
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#1D1D1F'
          }}>
            문단 {paragraphId} 수정 내용
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#86868B',
              padding: '4px',
              lineHeight: 1,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1D1D1F'}
            onMouseLeave={(e) => e.target.style.color = '#86868B'}
          >
            ×
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {editInstructions.map((instruction, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: '#F9FAFB',
                borderRadius: '8px',
                border: '1px solid #E5E7EB'
              }}
            >
              <span style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#E5E7EB',
                borderRadius: '50%',
                fontSize: '12px',
                fontWeight: '600',
                color: '#4B5563'
              }}>
                {index + 1}
              </span>
              <p style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#374151',
                wordBreak: 'keep-all'
              }}>
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};



// 글래스모피즘 힌트 아이콘 컴포넌트 - 토글 방식으로 변경
const HintIcon = ({ onClick, isActive }) => (
  <div
    className="hint-icon-container"
    onClick={onClick}
    style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '28px',
      height: '28px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive 
        ? 'linear-gradient(135deg, rgba(74, 85, 104, 0.2), rgba(74, 85, 104, 0.15))'
        : 'linear-gradient(135deg, rgba(74, 85, 104, 0.1), rgba(74, 85, 104, 0.05))',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      boxShadow: '0 8px 32px rgba(74, 85, 104, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* 호버 시 빛나는 효과 */}
    <div
      className="hint-icon-glow"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle, rgba(74, 85, 104, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }}
    />
   
    {/* 미니멀 힌트 아이콘 */}
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ zIndex: 1 }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(74, 85, 104, 0.8)" strokeWidth="2"/>
      <path d="M12 17v-1m0-4v-4" stroke="rgba(74, 85, 104, 0.8)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="0.5" fill="rgba(74, 85, 104, 0.8)"/>
      </svg>
  </div>
);

// 객관식 헬프 아이콘 컴포넌트 (손 모양) - 회색 SVG 스타일
const McqHelpIcon = ({ onClick, disabled }) => (
  <div
    className="mcq-help-icon"
    onClick={disabled ? undefined : onClick}
    title={disabled ? "이 단계에서는 사용할 수 없어요" : "이 질문에 대한 답을 하기가 어려우면, 객관식으로 진행할 수 있어요"}
    style={{
      width: '24px',
      height: '24px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: disabled
        ? 'rgba(200, 200, 200, 0.2)'
        : 'rgba(107, 114, 128, 0.08)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      marginLeft: '8px'
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = 'rgba(107, 114, 128, 0.15)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
        e.currentTarget.style.transform = 'scale(1)';
      }
    }}
  >
    {/* 손 모양 아이콘 - 회색 스타일 */}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path 
        d="M18 8.5V8a2 2 0 0 0-4 0v.5M14 8.5V6a2 2 0 0 0-4 0v2.5M10 8.5V7a2 2 0 0 0-4 0v5.5M6 12.5V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-5.5a2 2 0 0 0-4 0M10 8.5V12M14 8.5V12" 
        stroke={disabled ? "rgba(156, 163, 175, 0.6)" : "rgba(75, 85, 99, 0.8)"} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// 힌트 표시 상태 관리

// 힌트 표시 상태 관리
const [showHintInBubble, setShowHintInBubble] = useState(false);


///1234
// 안전한 렌더링 헬퍼 함수
const safeRender = (value, fallback = '정보 없음') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object') return JSON.stringify(value);
  return fallback;
};

// 🔥 v6.2: 문단별 생성계획 카드 컴포넌트
const ParagraphPlanCard = ({ direction, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        padding: '20px 24px',
        marginBottom: '12px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: isExpanded
          ? '0 4px 12px rgba(0, 0, 0, 0.10)'
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.1s ease',
        border: '1px solid #e5e7eb',
        minHeight: isExpanded ? 'auto' : '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isExpanded ? 'flex-start' : 'center'
      }}
      onMouseEnter={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        }
      }}
    >
      {isExpanded ? (
        <div style={{ width: '100%' }}>
          {/* 헤더 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280'
            }}>
              {direction.id}문단 ({direction.role})
            </div>
          </div>

          {/* 방향성 */}
          <div style={{
            fontSize: '15px',
            color: '#374151',
            lineHeight: '1.7',
            wordBreak: 'keep-all',
            marginBottom: '12px'
          }}>
            {direction.direction || '방향성 정보가 없습니다.'}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827'
          }}>
            {direction.id}문단 ({direction.role})
          </div>
        </div>
      )}
    </div>
  );
};

// 🔥 v6.2: 문단별 방향성 섹션 컴포넌트
const ParagraphDirectionsSummary = ({ paragraphDirections }) => {
  return (
    <div
      className="section-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <h3 style={{
  marginBottom: '20px',
  fontSize: '18px',
  fontWeight: '700',
  color: '#111827'
}}>
  <GlassIcon type="guide" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
  문단별 생성계획
</h3>

      {paragraphDirections.map((dir, idx) => (
        <ParagraphPlanCard
          key={idx}
          direction={dir}
          index={idx}
        />
      ))}
    </div>
  );
};

const renderNewPlanStructure = (plan) => {
  console.log(
    `[${new Date().toISOString()}] Rendering plan structure v6.2:`,
    plan
  );

  // 공통 흰색 카드 스타일
  const whiteCardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  };

  // 🔥 v6.2: paragraphDirections 체크
  const hasParagraphDirections = plan?.paragraphDirections && Array.isArray(plan.paragraphDirections);

  return (
    <>
      {/* 🔥 v6.2: 기본 정보 요약 */}
      <div
        className="section-card"
        style={{
          ...whiteCardStyle,
          marginBottom: '20px',
          padding: '20px 24px'
        }}
      >
        <h3 style={{
  margin: '0 0 16px 0',
  fontSize: '18px',
  fontWeight: '700',
  color: '#111827'
}}>
  <GlassIcon type="write" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
  자소서 생성 정보
</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>회사</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {plan?.jobPosting?.company || '정보 없음'}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>직무</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {plan?.jobPosting?.jobTitle || '정보 없음'}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>주제</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {plan?.episode?.topic || '정보 없음'}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>역량</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {plan?.episode?.coreCompetency 
                ? `${plan.episode.talentProfile || ''} : ${plan.episode.coreCompetency}`
                : plan?.episode?.competency || '정보 없음'}
            </p>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>글자수</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {plan?.jobPosting?.wordLimit || 1000}자
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 v6.2: 문단별 방향성 */}
      {hasParagraphDirections && (
        <ParagraphDirectionsSummary paragraphDirections={plan.paragraphDirections} />
      )}

      {/* 회사 정보 섹션 */}
      <div className="section-card" style={{ ...whiteCardStyle, marginBottom: '20px', padding: '20px 24px' }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827'
        }}>
          <GlassIcon type="company" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          타겟 회사 정보
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '15px',
            padding: '12px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}
        >
          <p style={{ margin: 0 }}><strong>회사명:</strong> {plan?.jobPosting?.company || state?.companyInfo?.company || '정보 없음'}</p>
          <p style={{ margin: 0 }}><strong>직무명:</strong> {plan?.jobPosting?.jobTitle || state?.companyInfo?.jobTitle || '정보 없음'}</p>
          <p style={{ margin: 0 }}><strong>최대 글자수:</strong> {plan?.jobPosting?.wordLimit || state?.companyInfo?.wordLimit || 1000}자</p>
          <p style={{ margin: 0 }}><strong>질문 주제:</strong> {plan?.episode?.topic || '일반'}</p>
        </div>

        <p style={{ marginBottom: '0' }}>
          <strong>자소서 질문:</strong>
          <span style={{ marginLeft: '8px', fontStyle: 'italic', color: '#4a5568' }}>
            {plan?.jobPosting?.question || state?.companyInfo?.questions || '정보 없음'}
          </span>
        </p>
      </div>

      {/* 에피소드 섹션 */}
      <div className="section-card" style={{ ...whiteCardStyle, padding: '20px 24px' }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827'
        }}>
          <GlassIcon type="episodes" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          활용 에피소드
        </h3>

        {plan?.episode?.content ? (
          <div
            style={{
              padding: '15px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <strong style={{ color: '#111827', fontSize: '16px' }}>
                {plan.episode.topic || '제목 없음'}
              </strong>
              {(plan.episode.coreCompetency || plan.episode.competency) && (
                <span
                  style={{
                    fontSize: '11px',
                    background: '#ffffff',
                    color: '#111827',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {plan.episode.coreCompetency 
                    ? `${plan.episode.talentProfile || ''} : ${plan.episode.coreCompetency}`
                    : plan.episode.competency}
                </span>
              )}
            </div>

            <p
              style={{
                margin: '0',
                color: '#4b5563',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              {plan.episode.content}
            </p>
          </div>
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            에피소드 정보가 없습니다.
          </div>
        )}
      </div>
    </>
  );
};

const renderPlanTable = (plan, showSummarizedExperiences = true) => {
  console.log(`[${new Date().toISOString()}] Rendering plan table for topics:`, state.questionTopics);
  console.log(`[${new Date().toISOString()}] Received plan:`, typeof plan, plan);

  if (typeof plan === 'object' && plan !== null) {
    // 🔥 v6.2: paragraphDirections 체크 (최우선)
    if (plan.paragraphDirections && Array.isArray(plan.paragraphDirections)) {
      console.log(`[${new Date().toISOString()}] Using v6.2 paragraphDirections structure`);
      return renderNewPlanStructure(plan);
    }

    // 🔥 레거시: paragraphInstructions 체크 (v6.1 이하)
    if (plan.paragraphInstructions || plan.version?.includes('5.') || plan.version?.includes('6.')) {
      console.log(`[${new Date().toISOString()}] Using legacy Master Instructions structure`);
      return renderNewPlanStructure(plan);
    }

    // 기존 구조 체크
    if (plan.structure || plan.assemblyGuide || plan.analysis) {
      console.log(`[${new Date().toISOString()}] Using legacy plan structure`);
      return renderNewPlanStructure(plan);
    } else {
      console.log(`[${new Date().toISOString()}] Plan is object but missing expected properties`);
      return (
        <div className="error-section">
          <p>계획서 형식을 인식할 수 없습니다. 다시 생성해 주세요.</p>
          <pre style={{ fontSize: '12px', background: '#ffffff', padding: '10px', borderRadius: '6px', overflow: 'auto', border: '1px solid #e5e7eb' }}>
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      );
    }
  }

  if (typeof plan !== 'string') {
    console.log(`[${new Date().toISOString()}] Plan is not string or object:`, typeof plan);
    return (
      <div className="error-section">
        <p>계획서 데이터가 올바르지 않습니다. 다시 생성해 주세요.</p>
      </div>
    );
  }

  // 레거시 텍스트 파싱 (이전 버전 호환)
  console.log(`[${new Date().toISOString()}] Using legacy text parsing`);
  const lines = plan.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const companyJobAnalysisStart = lines.findIndex(line => line.includes('회사 및 직무 분석'));
  const directionStart = lines.findIndex(line => line.includes('자소서 방향성'));
  const companyInfoStart = lines.findIndex(line => line.includes('회사 정보'));
  const resumeSummaryStart = lines.findIndex(line => line.includes('사용자 이력서'));
  const topicEpisodeStart = lines.findIndex(line => line.includes('적용할 주제와 에피소드'));
  const tableStart = lines.findIndex(line => line.startsWith('| 문단 주제'));

  let companyJobAnalysisSection = companyJobAnalysisStart !== -1 && directionStart !== -1
    ? lines.slice(companyJobAnalysisStart + 1, directionStart).join('\n').trim()
    : '회사 및 직무 분석 섹션이 없습니다.';
  let directionSection = directionStart !== -1 && companyInfoStart !== -1
    ? lines.slice(directionStart + 1, companyInfoStart).join('\n').trim()
    : '자소서 방향성 섹션이 없습니다.';
  let companyInfoSection = companyInfoStart !== -1 && resumeSummaryStart !== -1
    ? lines.slice(companyInfoStart + 1, resumeSummaryStart).join('\n').trim()
    : state.companyInfo.company
      ? `회사명: ${state.companyInfo.company}\n직무명: ${state.companyInfo.jobTitle}\n요구사항: ${state.companyInfo.jobRequirements || '정보 없음'}\n업무: ${state.companyInfo.jobTasks || '정보 없음'}\n질문: ${state.companyInfo.questions || '정보 없음'}\n최대 글자수: ${state.companyInfo.wordLimit || '1000'}자`
      : '회사 정보 섹션이 없습니다.';
  let resumeSummarySection = resumeSummaryStart !== -1 && topicEpisodeStart !== -1
    ? lines.slice(resumeSummaryStart + 1, topicEpisodeStart).join('\n').trim()
    : '사용자 이력서 섹션이 없습니다.';
  let topicEpisodeSection = topicEpisodeStart !== -1 && tableStart !== -1
    ? lines.slice(topicEpisodeStart + 1, tableStart).join('\n').trim()
    : '적용할 주제와 에피소드 섹션이 없습니다.';

  const tableLines = tableStart !== -1 ? lines.slice(tableStart) : [];
  const headers = tableStart !== -1 ? tableLines[0].split('|').slice(1, -1).map(h => h.trim()) : ['문단 주제', '목적', '적용 경험', '방향성', '근거'];
  const rows = tableStart !== -1 ? tableLines.slice(2).filter(row => row.trim() !== '').map((row, rowIndex) => {
    const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells[0] && cells[0].includes('본론')) {
      const topicIndexMatch = cells[0].match(/본론 (\d+)/);
      if (topicIndexMatch) {
        const topicIndex = parseInt(topicIndexMatch[1]) - 1;
        const topic = state.questionTopics[topicIndex] || '';
        cells[0] = `${cells[0]} (${topic})`;
      }
    }
    return cells.slice(0, 5);
  }).filter(row => row.length >= 5) : [];

  if (companyJobAnalysisSection === '회사 및 직무 분석 섹션이 없습니다.' && state.companyInfo.jobRequirements) {
    companyJobAnalysisSection = `회사 요구사항: ${state.companyInfo.jobRequirements}\n분석: ${state.companyInfo.company}의 ${state.companyInfo.jobTitle} 직무는 위 요구사항을 기반으로 사용자의 경험과 매칭됩니다.`;
  }
  if (companyInfoSection === '회사 정보 섹션이 없습니다.' && state.companyInfo.company) {
    companyInfoSection = `회사명: ${state.companyInfo.company}\n직무명: ${state.companyInfo.jobTitle}\n요구사항: ${state.companyInfo.jobRequirements || '정보 없음'}\n업무: ${state.companyInfo.jobTasks || '정보 없음'}\n질문: ${state.companyInfo.questions || '정보 없음'}\n최대 글자수: ${state.companyInfo.wordLimit || '1000'}자`;
  }

  return (
    <>
      <div className="section-card">
        <h3><GlassIcon type="chart" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />회사 및 직무 분석</h3>
        {companyJobAnalysisSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="arrow" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />자소서 방향성</h3>
        {directionSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="company" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />회사 정보</h3>
        {companyInfoSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="document" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />사용자 이력서</h3>
        {resumeSummarySection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="episodes" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />적용할 주제와 에피소드</h3>
        {topicEpisodeSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => <th key={index}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>계획서 표를 생성하지 못했습니다. 다시 시도해 주세요.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

////5678////

///end of section 2///

useEffect(() => {
  const handleDglcInsufficient = (e) => {
    setDglcModalData(e.detail);
    setShowDglcModal(true);
  };
  window.addEventListener('dglc-insufficient', handleDglcInsufficient);
  return () => window.removeEventListener('dglc-insufficient', handleDglcInsufficient);
}, []);

useEffect(() => {
  // Focus Mode에서는 스크롤 불필요
}, [chatHistory]);

// Initialize localStorage on app start
useEffect(() => {
  // 문답 플로우 진입 중이면 초기화 스킵
  const savedFlow = localStorage.getItem('deepgl_selected_experience');
  const urlParams = new URLSearchParams(location.search);  const flow = urlParams.get('flow');
  if (savedFlow || flow === 'experience-extraction') return;
  
  localStorage.removeItem('resumeId');
  localStorage.removeItem('trends');
  dispatch({ type: 'SET_ANALYSIS', resumeId: '', analysisId: '' });
}, []);

// Load initial experiences when entering direction-selection
useEffect(() => {
  if (
    screen === 'direction-selection' &&
    state.resumeId &&
    state.analysisId &&
    state.selectedExperiences.length === 0
  ) {
    console.log(
      `[${new Date().toISOString()}] Loading initial experiences for resumeId=${state.resumeId}, analysisId=${state.analysisId}`
    );
    handleDirectionSuggestion(state.resumeId, state.analysisId);
  }
}, [screen, state.resumeId, state.analysisId, state.selectedExperiences.length]);



/**
 * 🔥 NEW: 문단별 수정 내용 팝업 (이름 변경해서 중복 방지)
 * - 기존 EditInfoPopup이 프로젝트 어딘가에 있어도 충돌 안 남
 */
const ParagraphEditInfoPopup = ({ paragraphId, editInstructions, onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal suggestion-modal">
        <div className="modal-header">
          <span>수정 내용</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <p style={{ marginBottom: '12px', color: '#86868B', fontSize: '13px' }}>
            문단 ID: {paragraphId}
          </p>

          {Array.isArray(editInstructions) && editInstructions.length > 0 ? (
            <ul style={{ paddingLeft: '18px', margin: 0 }}>
              {editInstructions.map((inst, idx) => (
                <li key={idx} style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                  {typeof inst === 'string' ? inst : JSON.stringify(inst)}
                </li>
              ))}
            </ul>
          ) : (
            <p>표시할 수정 내용이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

const { isAuthenticated, loading: authLoading, email, userId } = useAuth();

useEffect(() => {
  if (!isAuthenticated || !userId) return;
  const fetchDglcBalance = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/dglc/balance?userId=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setGlobalDglcBalance(data.balance);
    } catch (e) { /* silent */ }
  };
  fetchDglcBalance();
  const interval = setInterval(fetchDglcBalance, 30000);
  window.addEventListener('dglc-balance-update', fetchDglcBalance);

  // Daily reward 호출
  const claimDailyReward = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/dglc/daily-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.rewarded) {
        setDglcRewardToast({
          type: data.type,
          amount: data.amount,
          title: data.type === 'signup' ? 'Welcome to DeepGL!' : 'Welcome back to DeepGL!',
        });
        fetchDglcBalance();
        setTimeout(() => setDglcRewardToast(null), 4000);
      }
    } catch (e) { /* silent */ }
  };
  claimDailyReward();

  return () => { clearInterval(interval); window.removeEventListener('dglc-balance-update', fetchDglcBalance); };
}, [isAuthenticated, userId]);

if (authLoading) {
  return (
    <div className="app-container">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="loading-indicator"><div className="progress-ring" /></div>
      </div>
    </div>
  );
}
// 모바일 감지
const isMobile = /iPhone|Android.*Mobile|iPod/.test(navigator.userAgent) && !/iPad/.test(navigator.userAgent);

if (screen === 'start' || screen === 'loading' || screen === 'direction-selection') {
  // 모바일이고 로그인된 상태면 차단 메시지
  if (isMobile && isAuthenticated) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FBFBFD',
        padding: '24px',
        textAlign: 'center'
      }}>
        <svg width="80" height="80" viewBox="0 0 200 200" style={{ marginBottom: '24px' }}>
          <defs>
            <linearGradient id="mobileBlockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#mobileBlockGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
          <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
          <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        </svg>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1D1D1F', marginBottom: '12px' }}>
          PC 또는 태블릿에서 이용해주세요
        </h2>
        <p style={{ fontSize: '15px', color: '#86868B', lineHeight: '1.6', marginBottom: '24px' }}>
          DeepGL은 PC나 태블릿 PC에서만 이용 가능합니다.
        </p>
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          style={{
            padding: '12px 24px',
            background: 'rgba(74, 85, 104, 0.9)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>
    );
  }
  return (
    <>
    {isAuthenticated && globalDglcBalance !== null && (
      <div onClick={() => navigate('/dglc/charge')} style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 9998,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px', padding: '8px 16px', cursor: 'pointer',
        border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: 'all 0.2s ease',
      }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1F2937, #374151)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}>D</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937' }}>
          {Number.isInteger(globalDglcBalance) ? globalDglcBalance : globalDglcBalance.toFixed(1)}
        </span>
      </div>
    )}
    <Routes>
    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
    <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
    <Route path="/login" element={<LoginPage onLoginSuccess={() => navigate('/dashboard')} />} />
          <Route path="/intro" element={!isAuthenticated ? <Navigate to="/login" replace /> : <IntroPage />} />
    <Route path="/dashboard" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DashboardPage />} />
    <Route path="/search" element={!isAuthenticated ? <Navigate to="/login" replace /> : <SearchPage />} />    
      <Route path="/mypage" element={!isAuthenticated ? <Navigate to="/login" replace /> : <MyPage />} />
    <Route path="/project/:projectId" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ProjectDetailPage />} />
    <Route path="/database" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DatabasePage />} />
    <Route path="/database/:companyName" element={!isAuthenticated ? <Navigate to="/login" replace /> : <CompanyFolderPage />} />
    <Route path="/database/:companyName/episodes" element={!isAuthenticated ? <Navigate to="/login" replace /> : <EpisodeListPage />} />    
    <Route path="/database/:companyName/cover-letters" element={!isAuthenticated ? <Navigate to="/login" replace /> : <CoverLetterListPage />} />
    <Route path="/database/:companyName/episodes/:episodeId" element={!isAuthenticated ? <Navigate to="/login" replace /> : <EpisodeDetailPage />} />
    <Route path="/database/:companyName/cover-letters/:coverLetterId" element={!isAuthenticated ? <Navigate to="/login" replace /> : <CoverLetterDetailPage />} />        
    <Route path="/project/:projectId/question/:questionId" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DeepglFlowWrapper />} />      
    <Route path="/dglc/charge" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DGLCChargePage />} />
    <Route path="/dglc/success" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DGLCSuccessPage />} />
    <Route path="/dglc/fail" element={<DGLCFailPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
       <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
  </Routes>
  {isAuthenticated && <GlobalFooter />}
  {showDglcModal && (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '36px',
        maxWidth: '420px', width: '90%', textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(245,158,11,0.3)'
        }}>
          <span style={{ fontSize: '24px' }}>D</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1D1D1F' }}>
          크레딧이 부족합니다
        </h3>
        <p style={{ fontSize: '14px', color: '#6E6E73', lineHeight: 1.7, marginBottom: '4px' }}>
          현재 잔액: <strong style={{ color: '#1D1D1F' }}>{dglcModalData.balance ?? 0} DGLC</strong>
        </p>
        {dglcModalData.required > 0 && (
          <p style={{ fontSize: '14px', color: '#6E6E73', lineHeight: 1.7, marginBottom: '4px' }}>
            필요 잔액: <strong style={{ color: '#EF4444' }}>{dglcModalData.required} DGLC</strong>
          </p>
        )}
        <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '24px' }}>
          충전 후 이어서 진행할 수 있습니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              setShowDglcModal(false);
              const returnUrl = window.location.pathname + window.location.search;
              navigate(`/dglc/charge?returnUrl=${encodeURIComponent(returnUrl)}`);
            }}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: '12px',
              background: '#1D1D1F', color: '#fff', fontSize: '14px',
              fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            충전하기
          </button>
          <button
            onClick={() => setShowDglcModal(false)}
            style={{
              padding: '14px 20px', borderRadius: '12px',
              background: 'transparent', border: '1px solid rgba(0,0,0,0.08)',
              color: '#6E6E73', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>
      </div>
      </div>
  )}
  {dglcRewardToast && (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '36px',
        maxWidth: '380px', width: '90%', textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        animation: 'fadeInUp 0.4s ease-out',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1F2937, #374151)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(31,41,55,0.3)',
        }}>
          <span style={{ color: '#fff', fontSize: '24px', fontWeight: '800' }}>D</span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1D1D1F', margin: '0 0 8px 0' }}>
          {dglcRewardToast.title}
        </h3>
        <p style={{
          fontSize: '28px', fontWeight: 900, margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          +{dglcRewardToast.amount} DGLC
        </p>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 24px 0' }}>
          {dglcRewardToast.type === 'signup' ? '가입 축하 보너스가 지급되었습니다!' : '오늘의 출석 보너스가 지급되었습니다!'}
        </p>
        <button
          onClick={() => setDglcRewardToast(null)}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: '12px',
            background: '#1D1D1F', color: '#fff', fontSize: '14px',
            fontWeight: 600, border: 'none', cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </div>
  )}

  </>
  );
}





return (
  <div className="app-container">
    <div className="project-detail-layout">
      {/* 사이드바 - 항상 표시 */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile" onClick={() => navigate('/mypage')}>
          <div className="profile-avatar">
            {email ? email[0].toUpperCase() : 'U'}
          </div>
        </div>
        <div className="sidebar-spacer" />
        <button className="sidebar-logout" onClick={() => { navigate('/dglc/charge'); }} title="충전" style={{ marginBottom: '12px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
        </button>
        <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/search'); }} title="검색" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/database'); }} title="데이터베이스" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/dashboard'); }} title="대시보드" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="로그아웃">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </aside>
      <main className="project-detail-main">
        <div className="content-wrapper">

          
          {/* Error Modal */}
          {error && (
            <>
              <div className="modal-overlay" onClick={() => setError(null)} />
              <div className="modal error-modal">
                <p>{error}</p>
                <div className="modal-actions">
                  <button className="button-secondary" onClick={() => setError(null)}>
                    닫기
                  </button>
                  {error.includes('분석 실패') && (
                    <button className="button-primary" onClick={(e) => handleAnalysisSubmit(e)}>
                      재시도
                    </button>
                  )}
                  {error.includes('사전 분석 실패') && (
                    <button className="button-primary" onClick={(e) => handlePreAnalysisSubmit(e)}>
                      재시도
                    </button>
                  )}
                  {error.includes('계획서 생성 실패') && (
                    <button className="button-primary" onClick={handlePlanRequest}>
                      재시도
                    </button>
                  )}
                  {error.includes('첨삭 실패') && (
                    <button className="button-primary" onClick={handleFinalizeCoverLetter}>
                      재시도
                    </button>
                  )}
                </div>
              </div>
            </>
          )} 






      {screen === 'start' && (
        <div
          className={`start-screen ${animationComplete ? 'intro-done' : ''}`}
          onClick={(e) => {
            if (!animationComplete) return;
            const logo = e.target.closest('.final-logo');
            if (logo) handleStartWriting();
          }}
          style={{ position: 'relative', minHeight: '100vh' }}
        >
          <IntroAnimation onComplete={() => setAnimationComplete(true)} />
          {animationComplete && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 'calc(50% + 140px)',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                fontSize: '36px',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: '-apple-system, "SF Pro Display", sans-serif',
                zIndex: 20
              }}
            >
              {['D', 'E', 'E', 'P', 'G', 'L'].map((ch, i) => (
                <span
                  key={i}
                  className="wordmark-letter"
                  style={{
                    background: 'linear-gradient(135deg, #4A5568, #2D3748)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: '#4A5568',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          )}
          {!animationComplete && !skipIntro && (
            <button
              onClick={() => {
                setSkipIntro(true);
                setAnimationComplete(true);
              }}
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#86868B',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.color = '#4A5568';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#86868B';
              }}
            >
              Skip →
            </button>
          )}
          {state.loading && (
            <div
              className="loading-modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              <div
                className="loading-modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  borderRadius: '20px',
                  padding: '48px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  minWidth: '280px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  animation: 'liquidSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <div
                  className="loading-indicator"
                  style={{
                    margin: '0 auto 24px auto',
                    width: '80px',
                    height: '80px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DeepGlLogo size={80} />

                  {/* 첫 번째 파동 링 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '1px solid rgba(107,114,128,0.3)',
                      animation: 'loadingPulse1 2.5s ease-out infinite',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* 두 번째 파동 링 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '1px solid rgba(107,114,128,0.2)',
                      animation: 'loadingPulse2 2.5s ease-out infinite',
                      animationDelay: '0.8s',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* 세 번째 파동 링 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '1px solid rgba(107,114,128,0.15)',
                      animation: 'loadingPulse3 2.5s ease-out infinite',
                      animationDelay: '1.6s',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                <p
                  style={{
                    color: '#1D1D1F',
                    fontSize: '17px',
                    fontWeight: '500',
                    margin: 0
                  }}
                >
                  {currentMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Screen */}
      {screen === 'analysis' && (
        <div className="screen-container">
          <h2>회사 정보 입력</h2>
          <div className="form-container">
            <input
              className="input-field"
              placeholder="지원 회사 (예: 토스)"
              value={state.companyInfo.company}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, company: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <input
              className="input-field"
              placeholder="지원 직무 (예: 인사관리)"
              value={state.companyInfo.jobTitle}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, jobTitle: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="지원 직무에서 하게 될 업무"
              value={state.companyInfo.jobTasks}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, jobTasks: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="지원 직무에서 원하는 인재상 및 강점"
              value={state.companyInfo.jobRequirements}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, jobRequirements: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="자소서에서 묻는 질문 (예: 지원 동기 및 입사 후 포부)"
              value={state.companyInfo.questions}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, questions: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <input
              type="number"
              className="input-field"
              placeholder="최대 글자수 입력 (예: 1000, 기본 1000자)"
              value={state.companyInfo.wordLimit}
              onChange={(e) =>
                dispatch({
                  type: 'SET_PRE_ANALYSIS',
                  companyInfo: { ...state.companyInfo, wordLimit: e.target.value }
                })
              }
              disabled={state.loading}
            />
            <form
              onSubmit={handlePreAnalysisSubmit}
              style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            >
              <button
                type="submit"
                className="button-primary"
                disabled={state.loading || !state.companyInfo.company || !state.companyInfo.jobTitle}
              >
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>딥글에 제출하기</span>
              </button>
            </form>

            {state.loading && (
              <div
                className="loading-modal-overlay"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div
                  className="loading-modal"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '20px',
                    padding: '48px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    minWidth: '280px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: 'liquidSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div
                    className="loading-indicator"
                    style={{
                      margin: '0 auto 24px auto',
                      width: '80px',
                      height: '80px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DeepGlLogo size={80} />

                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.3)',
                        animation: 'loadingPulse1 2.5s ease-out infinite',
                        pointerEvents: 'none'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.2)',
                        animation: 'loadingPulse2 2.5s ease-out infinite',
                        animationDelay: '0.8s',
                        pointerEvents: 'none'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.15)',
                        animation: 'loadingPulse3 2.5s ease-out infinite',
                        animationDelay: '1.6s',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  <p
                    style={{
                      color: '#1D1D1F',
                      fontSize: '17px',
                      fontWeight: '500',
                      margin: 0
                    }}
                  >
                    {currentMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Analysis Review */}
      {screen === 'pre-analysis-review' && (
        <div className="screen-container">
          <h2>딥글이 분석한 초기 역량 확인</h2>
          <p className="description-text">
            딥글이 회사 정보를 분석해서 자소서에 필요한 초기 역량을 골랐습니다. Perplexity 검색 결과를 기반으로
            분석했습니다. 확인하고 이력서를 업로드하세요.
          </p>

          <div className="card-grid">
            {state.preCompetencies.slice(0, state.questionTopics.length).map((comp, index) => (
              <div key={index} className="card">
                <p className="card-title" style={{ fontWeight: 800 }}>
                  {(comp.talentProfile || comp.keyword)} : {comp.keyword}
                </p>
                <p className="card-description">{comp.reason}</p>
              </div>
            ))}
          </div>

          {state.source && state.source.length > 0 && (
            <div className="source-links">
              {state.source.map((url, index) => (
                <a
                  key={index}
                  href={url.startsWith('http') ? url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {url === 'Perplexity 검색' ? 'Perplexity 검색 기반' : `출처 ${index + 1}`}
                </a>
              ))}
            </div>
          )}

          <div className="form-container">
            <label className="file-upload-label">
              <span>이력서 업로드 (PDF)</span>
              <input
                type="file"
                name="resume"
                accept=".pdf"
                className="file-input"
                disabled={state.loading}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_PRE_ANALYSIS',
                    companyInfo: { ...state.companyInfo, resumeFile: e.target.files[0] }
                  })
                }
              />
            </label>

            <form
              onSubmit={handleAnalysisSubmit}
              style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            >
              <button type="submit" className="button-primary" disabled={state.loading || !state.companyInfo.resumeFile}>
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>이력서 제출하고 최종 분석하기</span>
              </button>
            </form>

            {state.loading && (
              <div
                className="loading-modal-overlay"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div
                  className="loading-modal"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '20px',
                    padding: '48px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    minWidth: '280px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: 'liquidSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div
                    className="loading-indicator"
                    style={{
                      margin: '0 auto 24px auto',
                      width: '80px',
                      height: '80px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DeepGlLogo size={80} />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.3)',
                        animation: 'loadingPulse1 2.5s ease-out infinite',
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.2)',
                        animation: 'loadingPulse2 2.5s ease-out infinite',
                        animationDelay: '0.8s',
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid rgba(107,114,128,0.15)',
                        animation: 'loadingPulse3 2.5s ease-out infinite',
                        animationDelay: '1.6s',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  <p
                    style={{
                      color: '#1D1D1F',
                      fontSize: '17px',
                      fontWeight: '500',
                      margin: 0
                    }}
                  >
                    {currentMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Competency Review */}
      {screen === 'competency-review' && (
        <div className="screen-container">
          <h2>딥글이 분석한 최종 역량 확인</h2>
          <p className="description-text">
            딥글이 이력서와 회사 정보를 분석해서 자소서 주제에 맞는 최종 역량을 골랐습니다. 확인하고 다음 단계로
            넘어가세요.
          </p>
          <div className="card-grid">
            {state.selectedForTopics.map((item, index) => (
              <div key={index} className="card selected">
                <p className="card-title">{item.topic}</p>
                <p>
                  <strong>인재상:</strong> {item.talentProfile || '분석 중...'}
                </p>
                <p>
                  <strong>핵심역량:</strong> {item.competency}
                </p>
                <p className="card-description">{item.reason}</p>
              </div>
            ))}
          </div>
          <button className="button-primary" onClick={goToDirectionSelection} disabled={state.loading}>
            <GlassIcon type="arrow" size={20} style={{ marginRight: '8px' }} />
            <span>경험 구체화 방향 선택하러 가기</span>
          </button>
        </div>
      )}

      {screen === 'direction-selection' && (
        <div className="screen-container">
          <h2>구체화 방향성 선택</h2>
          <div className="topic-indicator">
            현재 주제: {state.questionTopics[currentExperienceStep - 1]} ({currentExperienceStep}/{state.questionTopics.length})
          </div>
          <p className="description-text">
            아래에서 자소서에 넣을 경험을 선택하세요 ({state.questionTopics[currentExperienceStep - 1]}용)
          </p>

          {state.selectedExperiences.length === 0 ? (
            <div className="empty-state">
              <p>경험을 찾지 못했습니다. 다시 분석해볼까요?</p>
              <button
                className="button-primary"
                onClick={() => handleDirectionSuggestion(state.resumeId, state.analysisId)}
                disabled={state.loading}
              >
                <GlassIcon type="sparkle" size={20} style={{ marginRight: '8px' }} />
                <span>경험 제안 받기</span>
              </button>
            </div>
          ) : (
            <div className="card-grid">
              {state.selectedExperiences
                .filter((exp) => exp.topic === state.questionTopics[currentExperienceStep - 1])
                .map((exp, index) => (
                  <div
                    key={index}
                    className={`card experience-card ${
                      state.selectedExperiencesIndices[currentExperienceStep - 1] === exp.index ? 'selected' : ''
                    }`}
                    onClick={() => handleScenarioSelect(index)}
                  >
                    {/* 기본 정보 */}
                    <p className="card-title">{exp.company}</p>
                    <p className="card-description">{exp.description}</p>

                    {/* 주제 및 역량 */}
                    <div className="card-section">
                      <h4>매칭 정보</h4>
                      <p>
                        <strong>주제:</strong> {exp.topic}
                      </p>
                      <p>
                        <strong>인재상:</strong> {exp.talentProfile || '분석 중...'}
                      </p>
                      <p>
                        <strong>핵심역량:</strong> {exp.competency}
                      </p>
                    </div>

                    {/* 핵심: whySelected 분석 결과 - 3-Way 분석 구조 */}
                    <div className="card-section">
                      <h4>딥글 분석 결과</h4>
                      <p>
                        <strong>주제-경험:</strong> {exp.whySelected?.['주제-경험'] || '주제 연결성 분석 필요'}
                      </p>
                      <p>
                        <strong>인재상-역량-경험:</strong>{' '}
                        {exp.whySelected?.['인재상-역량-경험'] ||
                          exp.whySelected?.['역량-경험'] ||
                          '역량 증명 분석 필요'}
                      </p>
                      <p>
                        <strong>회사-경험:</strong> {exp.whySelected?.['회사-경험'] || '회사 연결성 분석 필요'}
                      </p>
                    </div>

                    {/* 통합분석 섹션 - integratedAnalysis 필드 사용 */}
                    <div className="card-section">
                      <h4>통합분석</h4>
                      <p>{exp.integratedAnalysis || '통합 분석 생성 중...'}</p>
                    </div>

                    {/* 출처 정보 */}
                    {state.source && state.source.length > 0 && (
                      <div className="card-section">
                        <h4>분석 출처</h4>
                        <p>
                          {state.source.filter((s) => s !== 'Enhanced Perplexity 검색').slice(0, 2).join(', ') ||
                            'Perplexity 검색 기반'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button
              className="button-primary"
              onClick={handleStartExtraction}
              disabled={state.loading || state.selectedExperiencesIndices[currentExperienceStep - 1] === undefined}
            >
              <GlassIcon type="write" size={20} style={{ marginRight: '8px' }} />
              <span>경험 구체화하러 가기</span>
            </button>
          </div>

          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
     )}
      
     {/* 상황 선택 화면 (메인질문 🖐️ 클릭 시) */}
     {showSituationSelection && (
       <div
         style={{
           width: '100%',
           height: 'calc(100vh - 120px)',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           padding: '40px 24px',
           background: 'transparent'
         }}
       >
         <div
           style={{
             width: '100%',
             maxWidth: '600px',
             display: 'flex',
             flexDirection: 'column',
             gap: '24px'
           }}
         >
           {/* 헤더 */}
           <div style={{ textAlign: 'center', marginBottom: '16px' }}>
             <h2 style={{
               fontSize: '24px',
               fontWeight: '700',
               color: '#1D1D1F',
               marginBottom: '12px'
             }}>
               비슷한 경험을 선택해주세요
             </h2>
             <p style={{
               fontSize: '15px',
               color: '#86868B',
               lineHeight: '1.5'
             }}>
               {situationCoreLogic || '아래 중 가장 비슷한 상황을 선택하면, 그에 맞는 질문으로 다시 시작합니다.'}
             </p>
           </div>

           {/* 로딩 상태 */}
           {situationLoading ? (
             <div style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               padding: '60px 0',
               gap: '16px'
             }}>
               <div className="loading-spinner" />
               <p style={{ color: '#86868B', fontSize: '15px' }}>상황을 분석하고 있습니다...</p>
             </div>
           ) : (
             <>
    {/* 상황 선택지 */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {situationOptions.map((situation) => (
                   <div
                     key={situation.id}
                     onClick={() => {
                       if (editingOptionId !== `situation-${situation.id}`) {
                         setSelectedSituationId(situation.id);
                       }
                     }}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '12px',
                       padding: '16px 20px',
                       background: selectedSituationId === situation.id ? 'rgba(74, 85, 104, 0.08)' : 'transparent',
                       borderRadius: '12px',
                       cursor: 'pointer',
                       transition: 'all 0.2s ease',
                       border: selectedSituationId === situation.id ? '2px solid rgba(74, 85, 104, 0.4)' : '2px solid transparent'
                     }}
                     onMouseEnter={(e) => {
                       if (selectedSituationId !== situation.id) {
                         e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                         e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (selectedSituationId !== situation.id) {
                         e.currentTarget.style.boxShadow = 'none';
                         e.currentTarget.style.background = 'transparent';
                       }
                     }}
                   >
                     {/* 텍스트 영역 */}
                     <div style={{ flex: 1 }}>
                       {editingOptionId === `situation-${situation.id}` ? (
                         <input
                           type="text"
                           value={situation.text}
                           onClick={(e) => e.stopPropagation()}
                           onChange={(e) => {
                             const newText = e.target.value;
                             setSituationOptions(prev => prev.map(s => 
                               s.id === situation.id ? { ...s, text: newText } : s
                             ));
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               setEditingOptionId(null);
                             }
                           }}
                           onBlur={() => setEditingOptionId(null)}
                           autoFocus
                           style={{
                             width: '100%',
                             fontSize: '16px',
                             fontWeight: '500',
                             color: '#1D1D1F',
                             lineHeight: '1.5',
                             padding: '8px 12px',
                             border: '1px solid rgba(107, 114, 128, 0.3)',
                             borderRadius: '8px',
                             outline: 'none',
                             background: 'white'
                           }}
                         />
                       ) : (
                         <>
                           <p style={{
                             fontSize: '16px',
                             fontWeight: '500',
                             color: '#1D1D1F',
                             marginBottom: situation.context ? '6px' : '0',
                             lineHeight: '1.5'
                           }}>
                             {situation.text}
                           </p>
                           {situation.context && (
                             <p style={{
                               fontSize: '13px',
                               color: '#86868B'
                             }}>
                               {situation.context}
                             </p>
                           )}
                         </>
                       )}
                     </div>
                     {/* 연필 아이콘 */}
                     {editingOptionId !== `situation-${situation.id}` && (
                       <div
                         onClick={(e) => {
                           e.stopPropagation();
                           setEditingOptionId(`situation-${situation.id}`);
                         }}
                         style={{
                           padding: '8px',
                           cursor: 'pointer',
                           opacity: 0.5,
                           transition: 'opacity 0.2s ease'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                         onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                       >
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                         </svg>
                       </div>
                     )}
                   </div>
                 ))}
               </div>

               {/* 하단 버튼 영역 */}
               <div style={{
                 display: 'flex',
                 justifyContent: 'center',
                 gap: '16px',
                 marginTop: '16px'
               }}>
                 {/* 새로고침 버튼 */}
                 <button
                   onClick={handleSituationRefresh}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     padding: '12px 24px',
                     background: 'transparent',
                     border: '1px solid rgba(107, 114, 128, 0.3)',
                     borderRadius: '12px',
                     fontSize: '15px',
                     fontWeight: '500',
                     color: '#4B5563',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M23 4v6h-6M1 20v-6h6" />
                     <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                   </svg>
                   다른 상황 보기
                 </button>

                 {/* 취소 버튼 */}
                 <button
                   onClick={handleSituationCancel}
                   style={{
                     padding: '12px 24px',
                     background: 'transparent',
                     border: '1px solid rgba(107, 114, 128, 0.3)',
                     borderRadius: '12px',
                     fontSize: '15px',
                     fontWeight: '500',
                     color: '#4B5563',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   돌아가기
                 </button>

                 {/* 선택 완료 버튼 */}
                 <button
                   onClick={() => {
                     if (selectedSituationId !== null) {
                       const selectedSituation = situationOptions.find(s => s.id === selectedSituationId);
                       if (selectedSituation) {
                         handleSituationSelect(selectedSituation);
                         setSelectedSituationId(null);
                       }
                     }
                   }}
                   disabled={selectedSituationId === null}
                   style={{
                     padding: '12px 24px',
                     background: selectedSituationId !== null ? 'rgba(74, 85, 104, 0.9)' : 'rgba(107, 114, 128, 0.3)',
                     border: 'none',
                     borderRadius: '12px',
                     fontSize: '15px',
                     fontWeight: '500',
                     color: 'white',
                     cursor: selectedSituationId !== null ? 'pointer' : 'not-allowed',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     if (selectedSituationId !== null) {
                       e.currentTarget.style.background = 'rgba(74, 85, 104, 1)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (selectedSituationId !== null) {
                       e.currentTarget.style.background = 'rgba(74, 85, 104, 0.9)';
                     }
                   }}
                 >
                   선택 완료
                 </button>
               </div>
             </>
           )}
         </div>
       </div>
     )}

     {/* STAR 객관식 화면 (STAR 🖐️ 클릭 시) */}
     {showStarMcq && (
       <div
         style={{
           width: '100%',
           height: 'calc(100vh - 120px)',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           padding: '40px 24px',
           background: 'transparent'
         }}
       >
         <div
           style={{
             width: '100%',
             maxWidth: '600px',
             display: 'flex',
             flexDirection: 'column',
             gap: '24px'
           }}
         >
           {/* 진행 상황 표시 */}
           <div style={{
             display: 'flex',
             justifyContent: 'center',
             gap: '8px',
             marginBottom: '8px'
           }}>
{starMcqType !== 'PHASE2' && ['S', 'T', 'A', 'R'].map((type) => {
                 const fieldKeyMap = { 'S': 'situation', 'T': 'task', 'A': 'action', 'R': 'result' };
               const hasValue = starInputs[fieldKeyMap[type]]?.trim();
               return (
                 <div
                   key={type}
                   style={{
                     width: '40px',
                     height: '40px',
                     borderRadius: '50%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: '16px',
                     fontWeight: '600',
                     background: hasValue 
                       ? 'rgba(16, 185, 129, 0.2)' 
                       : starMcqType === type 
                         ? 'rgba(107, 114, 128, 0.2)' 
                         : 'rgba(107, 114, 128, 0.08)',
                     color: hasValue
                       ? '#10B981'
                       : starMcqType === type
                         ? '#1D1D1F'
                         : '#86868B',
                     border: starMcqType === type 
                       ? '2px solid rgba(107, 114, 128, 0.4)' 
                       : '1px solid rgba(107, 114, 128, 0.2)',
                     transition: 'all 0.2s ease'
                   }}
                 >
                   {hasValue ? '✓' : type}
                 </div>
               );
             })}
           </div>

{/* 헤더 - v3.0 심화 단계 표시 */}
<div style={{ textAlign: 'center' }}>
    {/* 심화 단계 뱃지 */}
    {!starMcqLoading && currentDepth > 0 && (
      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#3B82F6',
        marginBottom: '8px'
      }}>
        {currentDepth}단계 심화 중
      </div>
    )}
 {/* 💬 이전 맥락 (contextSummary) */}
 {!starMcqLoading && contextSummary && (
      <div style={{
        padding: '12px 16px',
        background: 'rgba(107, 114, 128, 0.08)',
        borderRadius: '12px',
        marginBottom: '12px'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#6B7280',
          margin: 0,
          lineHeight: '1.5'
        }}>
          💬 {contextSummary}
        </p>
      </div>
    )}
    {/* 💡 이 질문의 목적 (purpose) */}
    {!starMcqLoading && starMcqPurpose && (
      <div style={{
        padding: '12px 16px',
        background: 'rgba(59, 130, 246, 0.08)',
        borderRadius: '12px',
        marginBottom: '12px'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#3B82F6',
          margin: 0,
          lineHeight: '1.5'
        }}>
          💡 {starMcqPurpose}
        </p>
      </div>
    )}
  {/* ❓ 현재 질문 (question) - 편집 가능 */}
  <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '12px'
    }}>
      {starMcqLoading || regeneratingOptions ? (
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1D1D1F',
          lineHeight: '1.6',
          margin: 0
        }}>
          {regeneratingOptions 
            ? `[${starMcqType}] 새로운 선택지를 생성하고 있습니다...`
            : `[${starMcqType}] 질문을 준비하고 있습니다...`
          }
        </h2>
      ) : editingStarQuestion ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1D1D1F' 
            }}>
              [{starMcqType}]
            </span>
          </div>
          <textarea
            value={editedStarQuestionText}
            onChange={(e) => setEditedStarQuestionText(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              minHeight: '80px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#1D1D1F',
              lineHeight: '1.6',
              padding: '12px 16px',
              border: '2px solid #3B82F6',
              borderRadius: '12px',
              outline: 'none',
              background: 'white',
              resize: 'vertical'
            }}
            placeholder="질문을 수정하세요..."
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setEditingStarQuestion(false);
                setEditedStarQuestionText('');
              }}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6B7280',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button
              onClick={handleRegenerateStarMcqOptions}
              style={{
                padding: '8px 16px',
                background: '#3B82F6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              보기 재생성
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1D1D1F',
            lineHeight: '1.6',
            margin: 0
          }}>
            {`[${starMcqType}] ${starMcqQuestion || '질문을 불러오는 중...'}`}
          </h2>
          {/* 질문 수정 연필 아이콘 */}
          <div
            onClick={() => {
              setEditingStarQuestion(true);
              setEditedStarQuestionText(starMcqQuestion);
            }}
            style={{
              padding: '6px',
              cursor: 'pointer',
              opacity: 0.5,
              transition: 'opacity 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
            title="질문 수정하기"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
          </div>
                 {/* 질문 재생성 새로고침 아이콘 (S는 제외) */}
                 {starMcqType !== 'S' && <div
            onClick={starMcqType === 'PHASE2' ? handleMainQuestionHelp : handleRegenerateStarQuestion}
            style={{
              padding: '6px',
              cursor: 'pointer',
              opacity: 0.5,
              transition: 'opacity 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
            title="다른 질문으로 변경"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            </div>}
            </>
      )}
    </div>
  </div>

           {/* 로딩 상태 */}
           {(starMcqLoading || starMcqOptions.length === 0) ? (      
                   <div style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               padding: '60px 0',
               gap: '16px'
             }}>
               <div className="loading-spinner" />
               <p style={{ color: '#86868B', fontSize: '15px' }}>선택지를 생성하고 있습니다...</p>
             </div>
           ) : (
             <>
 {/* 선택지 */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {starMcqOptions.map((option) => (
                   <div
                     key={option.id}
                     onClick={() => {
                       if (editingOptionId !== `star-${option.id}`) {
                         setSelectedStarOptionId(option.id);
                       }
                     }}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '12px',
                       padding: '16px 20px',
                       background: selectedStarOptionId === option.id ? 'rgba(74, 85, 104, 0.08)' : 'transparent',
                       borderRadius: '12px',
                       cursor: 'pointer',
                       transition: 'all 0.2s ease',
                       border: selectedStarOptionId === option.id ? '2px solid rgba(74, 85, 104, 0.4)' : '2px solid transparent'
                     }}
                     onMouseEnter={(e) => {
                       if (selectedStarOptionId !== option.id) {
                         e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                         e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (selectedStarOptionId !== option.id) {
                         e.currentTarget.style.boxShadow = 'none';
                         e.currentTarget.style.background = 'transparent';
                       }
                     }}
                   >
                     {/* 텍스트 영역 */}
                     <div style={{ flex: 1 }}>
                       {editingOptionId === `star-${option.id}` ? (
                         <input
                           type="text"
                           value={option.text}
                           onClick={(e) => e.stopPropagation()}
                           onChange={(e) => {
                             const newText = e.target.value;
                             setStarMcqOptions(prev => prev.map(o => 
                               o.id === option.id ? { ...o, text: newText } : o
                             ));
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               setEditingOptionId(null);
                             }
                           }}
                           onBlur={() => setEditingOptionId(null)}
                           autoFocus
                           style={{
                             width: '100%',
                             fontSize: '16px',
                             fontWeight: '500',
                             color: '#1D1D1F',
                             lineHeight: '1.5',
                             padding: '8px 12px',
                             border: '1px solid rgba(107, 114, 128, 0.3)',
                             borderRadius: '8px',
                             outline: 'none',
                             background: 'white'
                           }}
                         />
                       ) : (
                         <p style={{
                           fontSize: '16px',
                           fontWeight: '500',
                           color: '#1D1D1F',
                           lineHeight: '1.5',
                           margin: 0
                         }}>
                           {option.text}
                         </p>
                       )}
                     </div>
                     {/* 연필 아이콘 */}
                     {editingOptionId !== `star-${option.id}` && (
                       <div
                         onClick={(e) => {
                           e.stopPropagation();
                           setEditingOptionId(`star-${option.id}`);
                         }}
                         style={{
                           padding: '8px',
                           cursor: 'pointer',
                           opacity: 0.5,
                           transition: 'opacity 0.2s ease'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                         onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                       >
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                         </svg>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
{/* 하단 버튼 영역 - v3.0 심화형 */}
<div style={{
                 display: 'flex',
                 justifyContent: 'center',
                 gap: '12px',
                 marginTop: '20px',
                 flexWrap: 'wrap'
               }}>
                 {/* 다른 선택지 보기 버튼 */}
                 <button
                   onClick={handleStarMcqRefresh}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     padding: '12px 20px',
                     background: 'transparent',
                     border: '1px solid rgba(107, 114, 128, 0.3)',
                     borderRadius: '12px',
                     fontSize: '14px',
                     fontWeight: '500',
                     color: '#6B7280',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M23 4v6h-6M1 20v-6h6" />
                     <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                   </svg>
                   다른 선택지
                 </button>

                 {/* 돌아가기 버튼 */}
                 <button
                   onClick={handleStarMcqCancel}
                   style={{
                     padding: '12px 20px',
                     background: 'transparent',
                     border: '1px solid rgba(107, 114, 128, 0.3)',
                     borderRadius: '12px',
                     fontSize: '14px',
                     fontWeight: '500',
                     color: '#6B7280',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = 'transparent';
                   }}
                 >
                   돌아가기
                 </button>

                 {/* 더 자세히 버튼 (심화 계속) */}
                 <button
                   onClick={() => {
                     if (selectedStarOptionId !== null) {
                       const selectedOption = starMcqOptions.find(o => o.id === selectedStarOptionId);
                       if (selectedOption) {
                         handleStarMcqSelect(selectedOption);
                         setSelectedStarOptionId(null);
                       }
                     }
                   }}
                   disabled={selectedStarOptionId === null || currentDepth >= 3}
                                      style={{
                     padding: '12px 24px',
                     background: (selectedStarOptionId !== null && currentDepth < 3) ? 'rgba(59, 130, 246, 0.9)' : 'rgba(107, 114, 128, 0.3)',                     border: 'none',
                     borderRadius: '12px',
                     fontSize: '14px',
                     fontWeight: '600',
                     color: 'white',
                     cursor: (selectedStarOptionId !== null && currentDepth < 3) ? 'pointer' : 'not-allowed',
                                          transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     if (selectedStarOptionId !== null) {
                       e.currentTarget.style.background = 'rgba(59, 130, 246, 1)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (selectedStarOptionId !== null) {
                       e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
                     }
                   }}
                 >
                   더 자세히
                 </button>

                 {/* 다음 질문으로 넘어가기 버튼 */}
                 <button
                   onClick={handleStarMcqNextStar}
                   disabled={depthSelections.length === 0}
                   style={{
                     padding: '12px 24px',
                     background: depthSelections.length > 0 ? 'rgba(74, 85, 104, 0.9)' : 'rgba(107, 114, 128, 0.3)',
                     border: 'none',
                     borderRadius: '12px',
                     fontSize: '14px',
                     fontWeight: '600',
                     color: 'white',
                     cursor: depthSelections.length > 0 ? 'pointer' : 'not-allowed',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     if (depthSelections.length > 0) {
                       e.currentTarget.style.background = 'rgba(74, 85, 104, 1)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (depthSelections.length > 0) {
                       e.currentTarget.style.background = 'rgba(74, 85, 104, 0.9)';
                     }
                   }}
                 >
                   다음 질문으로 →
                 </button>
               </div>
             </>
           )}
         </div>
       </div>
     )}

     {/* Experience Extraction (Chat) - Focus Mode 수정 */}
     {screen === 'experience-extraction' && !showSituationSelection && !showStarMcq && (
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'transparent'
          }}
        >
          {/* 플로팅 주제 배지 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
          >
            <div className="topic-indicator">
              현재 주제: {state.questionTopics[currentExperienceStep - 1]} ({currentExperienceStep}/
              {state.questionTopics.length})
            </div>
          </div>

          {/* Focus Mode 대화 영역 - 수정된 부분 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '120px',
              paddingBottom: '24px',
              position: 'relative'
            }}
          >
            {/* 현재 대화만 표시 */}
            <div
              style={{
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '32px',
                animation: 'fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {/* 딥글 로고 - transform 제거 */}
              <div className={state.chatLoading ? 'typing-logo' : ''} style={{ position: 'relative' }}>
                <DeepGlLogo size={120} />
                {state.chatLoading && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '0.5px solid rgba(107,114,128,0.2)',
                        animation: 'pulseRing1 2.4s ease-out infinite',
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '0.5px solid rgba(107,114,128,0.15)',
                        animation: 'pulseRing2 2.4s ease-out infinite',
                        animationDelay: '0.8s',
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '0.5px solid rgba(107,114,128,0.1)',
                        animation: 'pulseRing3 2.4s ease-out infinite',
                        animationDelay: '1.6s',
                        pointerEvents: 'none'
                      }}
                    />
                    
                  </>
                )}
              </div>

              {/* 현재 질문 표시 - 배경 제거 */}
              {!state.chatLoading && chatHistory.length > 0 && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    transform: 'translateX(0)',
                    animation: 'slideInFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both'
                  }}
                >
                  <div
                    className="focus-question-bubble"
                    style={{
                      padding: '20px 24px',
                      fontSize: '17px',
                      lineHeight: '1.6',
                      color: '#1D1D1F',
                      position: 'relative'
                    }}
                  >
     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
     <span style={{ flex: 1 }}>
                        {showHintInBubble && chatHistory[chatHistory.length - 1].hint
                          ? chatHistory[chatHistory.length - 1].hint
                          : chatHistory[chatHistory.length - 1].message}
                      </span>
                      
                      {/* 메인질문 손모양 헬프 아이콘 */}
                      {chatHistory[chatHistory.length - 1].sender === '딥글' && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMainQuestionHelp();
                          }}
                          title="이런 경험이 없다면, 비슷한 상황을 선택해보세요"
                          style={{
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(107, 114, 128, 0.08)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(107, 114, 128, 0.2)',
                            borderRadius: '50%',
                            transition: 'all 0.2s ease',
                            marginTop: '2px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.background = 'rgba(107, 114, 128, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path 
                              d="M18 8.5V8a2 2 0 0 0-4 0v.5M14 8.5V6a2 2 0 0 0-4 0v2.5M10 8.5V7a2 2 0 0 0-4 0v5.5M6 12.5V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-5.5a2 2 0 0 0-4 0M10 8.5V12M14 8.5V12" 
                              stroke="rgba(75, 85, 99, 0.8)" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}

                      {/* 힌트 토글 아이콘 */}
                      {chatHistory[chatHistory.length - 1].sender === '딥글' &&
                        chatHistory[chatHistory.length - 1].hint && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowHintInBubble(!showHintInBubble);
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: showHintInBubble
                                ? 'rgba(74, 85, 104, 0.15)'
                                : 'rgba(74, 85, 104, 0.08)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              border: '1px solid rgba(107, 114, 128, 0.2)',
                              borderRadius: '50%',
                              transition: 'all 0.2s ease',
                              marginTop: '2px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="rgba(74, 85, 104, 0.6)" strokeWidth="2" />
                              <path
                                d="M12 17v-1m0-4v-4"
                                stroke="rgba(74, 85, 104, 0.6)"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <circle cx="12" cy="18" r="0.5" fill="rgba(74, 85, 104, 0.6)" />
                            </svg>
                          </div>
                        )}
                    </div>
                  </div>
                 
                </div>
              )}

             {/* 답변 입력 영역 - v25.3 STAR 모드 추가 */}
             {chatHistory.length > 0 && (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {/* STAR 모드 */}
                  {inputMode === 'star' && inputFields ? (
                    <>
       <STARInputPanel
                        inputFields={inputFields}
                        starInputs={starInputs}
                        setStarInputs={setStarInputs}
                        disabled={state.chatLoading}
                        onModeSwitch={handleModeSwitch}
                        displayTexts={starDisplayTexts}
                        phaseNumber={currentPhaseNumber}
                        onHelpClick={(fieldKey, stakeholderQuestion) => {
                          // fieldKey를 STAR 타입으로 변환: situation -> S, task -> T, action -> A, result -> R
                          const starTypeMap = {
                            'situation': 'S',
                            'task': 'T',
                            'action': 'A',
                            'result': 'R'
                          };
                          const starType = starTypeMap[fieldKey] || 'S';
                          
                          // STAR 객관식 상태 초기화 및 시작
                          setStarMcqSelections([]);
                          setStarMcqAnswers({});
                          handleStarMcqStart(starType);
                        }}
                      />
                      
                     {/* 제출 버튼 + Progress indicator 가로 배치 */}
                     <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}>
                        {/* 왼쪽: Progress indicator */}
                        <div
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(74, 85, 104, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(74, 85, 104, 0.9)'
                          }}>
질문 {questionCount} / 2
       </span>
                        </div>

                        {/* 오른쪽: 제출 버튼 */}
                        <button
                          onClick={handleChatSubmit}
                          disabled={state.chatLoading || !Object.values(starInputs).some(v => v.trim()) || isSubmitting}
                          style={{
                            padding: '14px 36px',
                            borderRadius: '24px',
                            border: 'none',
                            background: Object.values(starInputs).some(v => v.trim())
                              ? 'linear-gradient(135deg, rgba(74, 85, 104, 0.9), rgba(74, 85, 104, 0.8))'
                              : '#E5E5EA',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: Object.values(starInputs).some(v => v.trim()) && !isSubmitting ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            boxShadow: Object.values(starInputs).some(v => v.trim()) 
                              ? '0 4px 12px rgba(74, 85, 104, 0.3)' 
                              : 'none'
                          }}
                        >
                          답변 제출하기 →
                        </button>
                      </div>
                    </>
                  ) : (
                    /* 기존 텍스트 모드 */
                    <>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '800px',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-end'
                        }}
                      >
                        <textarea
                          className="input-field"
                          placeholder="최대한 자세하게 작성해주실수록, 딥글은 더욱 자세한 분석이 가능합니다"
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!state.chatLoading && currentAnswer.trim()) {
                                handleChatSubmit();
                              }
                            }
                          }}
                          disabled={state.chatLoading}
                          style={{
                            flex: 1,
                            minHeight: '50px',
                            maxHeight: '120px',
                            resize: 'none',
                            borderRadius: '24px',
                            padding: '14px 20px',
                            border: '1px solid rgba(74, 85, 104, 0.3)',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                          }}
                        />
                        <button
                          onClick={handleChatSubmit}
                          disabled={state.chatLoading || !currentAnswer.trim() || isSubmitting}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: 'none',
                            background:
                              state.chatLoading || !currentAnswer.trim()
                                ? '#E5E5EA'
                                : 'linear-gradient(135deg, rgba(74, 85, 104, 0.9), rgba(74, 85, 104, 0.8))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            color: 'white',
                            cursor: state.chatLoading || !currentAnswer.trim() || isSubmitting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(74, 85, 104, 0.2)'
                          }}
                        >
                          ↑
                        </button>
                      </div>
                      
                {/* STAR 모드 전환 버튼 (Phase 1 + inputFields가 있을 때만) */}
                {inputFields && currentPhaseNumber < 2 && (
                        <button
                          onClick={() => setInputMode('star')}
                          style={{
                            padding: '10px 16px',
                            fontSize: '15px',
                            color: '#86868B',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#1D1D1F'}
                          onMouseLeave={(e) => e.target.style.color = '#86868B'}
                        >
                          STAR 구조로 입력하기
                        </button>
                      )}
                      {/* Phase 2: 객관식 전환 버튼 */}
                      {currentPhaseNumber === 2 && (
                        <button
                          onClick={() => {
                            setStarMcqSelections([]);
                            handleStarMcqStart('PHASE2');
                          }}
                          style={{
                            padding: '10px 16px',
                            fontSize: '15px',
                            color: '#86868B',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#1D1D1F'}
                          onMouseLeave={(e) => e.target.style.color = '#86868B'}
                        >
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                            <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
                            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                          </svg>
                          객관식으로 입력하기
                                                  </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

           {/* Progress indicator - STAR 모드가 아닐 때만 표시 */}
{!(inputMode === 'star' && inputFields) && (
  <div
    style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderRadius: '24px',
      border: '1px solid rgba(74, 85, 104, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    }}
  >
    <span style={{
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(74, 85, 104, 0.9)'
    }}>
질문 {questionCount} / 2
    </span>
  </div>
)}
          </div>

          {state.loading && <LoadingModal message={currentMessage} />}
          
          {/* 객관식 경험 추출 모달 */}
          <McqModal
            isOpen={showMcqModal}
            onClose={() => setShowMcqModal(false)}
            step={mcqStep}
            question={mcqQuestion}
            options={mcqOptions}
            setOptions={setMcqOptions}
            editingOptionId={editingOptionId}
            setEditingOptionId={setEditingOptionId}
            selectedMcqOptionId={selectedMcqOptionId}
            setSelectedMcqOptionId={setSelectedMcqOptionId}
            loading={mcqLoading}
            showResult={mcqShowResult}
            generatedAnswer={mcqGeneratedAnswer}
            stakeholderQuestion={mcqStakeholderQuestion}
            onSelect={handleMcqSelect}
            onConfirm={handleMcqConfirm}
            onRegenerate={handleMcqRegenerate}
          />
        </div>
      )}
      {/* Episode Review */}
      {screen === 'summarized-episode-review' && (
        <div className="screen-container">
          <h2>완성된 에피소드 확인</h2>
          <p className="description-text">딥글이 구체화한 경험을 요약했습니다. 확인하고 다음 단계로 넘어가세요.</p>
          <div className="card-grid">
          {state.summarizedEpisodes.length > 0 ? (
              state.summarizedEpisodes.map((ep, index) => (
                <div key={index} className="card episode-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p className="card-title" style={{ margin: 0 }}>{ep.topic}</p>
                    {editingEpisodeIndex !== index && (
                      <div
                        onClick={() => {
                          setEditingEpisodeIndex(index);
                          setEditedEpisodeText(ep.episode);
                        }}
                        style={{
                          padding: '6px',
                          cursor: 'pointer',
                          opacity: 0.5,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                        title="에피소드 수정하기"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="episode-content">
                    {editingEpisodeIndex === index ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea
                          value={editedEpisodeText}
                          onChange={(e) => setEditedEpisodeText(e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '200px',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            padding: '12px',
                            border: '2px solid #3B82F6',
                            borderRadius: '8px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingEpisodeIndex(null);
                              setEditedEpisodeText('');
                            }}
                            disabled={savingEpisode}
                            style={{
                              padding: '8px 16px',
                              background: 'transparent',
                              border: '1px solid rgba(107, 114, 128, 0.3)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              color: '#6B7280',
                              cursor: 'pointer'
                            }}
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleUpdateEpisode(index)}
                            disabled={savingEpisode}
                            style={{
                              padding: '8px 16px',
                              background: savingEpisode ? '#9CA3AF' : '#3B82F6',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              cursor: savingEpisode ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {savingEpisode ? (
                              <>
                                <div className="loading-spinner" style={{ width: '14px', height: '14px' }} />
                                저장 중...
                              </>
                            ) : (
                              '수정 완료'
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{ep.episode}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>완성된 에피소드가 없습니다. 채팅 기록이 부족하거나 주제가 맞지 않을 수 있습니다.</p>
            )}
          </div>
          <div className="action-buttons">
          {currentExperienceStep < state.questionTopics.length ? (
              <button
                className="button-primary"
                onClick={() => {
                  setCurrentExperienceStep(currentExperienceStep + 1);
                  setScreen('direction-selection');
                }}
                disabled={state.loading}
              >
                <GlassIcon type="write" size={20} style={{ marginRight: '8px' }} />
                <span>{`${state.questionTopics[currentExperienceStep]} 경험 구체화 하러 가기`}</span>
              </button>
            ) : (
              <button className="button-primary" onClick={handlePlanRequest} disabled={state.loading}>
                <GlassIcon type="document" size={20} style={{ marginRight: '8px' }} />
                <span>계획표 만들러 가기</span>
              </button>
            )}
          </div>
          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}

      {/* Plan View */}
      {screen === 'plan-view' && (
        <div className="screen-container">
          <h2>자소서 계획서</h2>
          <p className="description-text">
            지금까지 경험 {state.questionTopics.length}개를 구체화했습니다. 아래 계획서를 확인하고 자소서를 생성해보세요.
          </p>
          {state.plan ? (
            <>
              <div className="plan-container">{renderPlanTable(state.plan, true)}</div>
              {state.source && state.source.length > 0 && (
                <div className="source-links">
                  {state.source.map((url, index) => (
                    <a
                      key={index}
                      href={url.startsWith('http') ? url : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {url === '사용자 이력서' ? '사용자 이력서' : `출처 ${index + 1}`}
                    </a>
                  ))}
                </div>
              )}
     <div className="action-buttons">
                <button className="button-primary" onClick={handleGenerateCoverLetter} disabled={state.loading}>
                  <GlassIcon type="write" size={20} style={{ marginRight: '8px' }} />
                  <span>자소서 생성하기</span>
                </button>
              </div>
            
            </>
          ) : (
            <p>계획서가 없습니다. 다시 요청해 주세요.</p>
          )}
          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}

{/* Cover Letter View - ✅ 수정됨 (가이드 반영 + 팝업 컴포넌트명 변경) */}
{screen === 'cover-letter-view' && (
        <>
{(isProofreadingComplete || state.showProofreadingPopup || state.loading) && (         
       <aside className="dashboard-sidebar">
              <div className="sidebar-profile" onClick={() => navigate('/mypage')}>
                <div className="profile-avatar">
                  {email ? email[0].toUpperCase() : 'U'}
                </div>
              </div>
              <div className="sidebar-spacer" />
              <button className="sidebar-logout" onClick={() => { navigate('/dglc/charge'); }} title="충전" style={{ marginBottom: '12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
              </button>
              <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/search'); }} title="검색" style={{ marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/database'); }} title="데이터베이스" style={{ marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
              </button>
              <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/dashboard'); }} title="대시보드" style={{ marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </button>
              <button className="sidebar-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="로그아웃">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </aside>
          )}
          <div className="screen-container">
            <h2>{isProofreadingComplete ? '첨삭된 자소서' : '생성된 자소서'}</h2>
          <p className="description-text">
            {isProofreadingComplete
              ? '첨삭이 완료되었습니다. 문단을 클릭해서 직접 수정하거나, 느낌표 아이콘을 눌러 수정 내용을 확인하세요.'
              : '딥글이 자소서를 완성했습니다. 문단을 클릭하여 수정하거나 첨삭을 진행해 주세요.'}
          </p>

          <div className="cover-letter-container">
            {state.coverLetterParagraphs.length > 0 ? (
              state.coverLetterParagraphs.map((paragraph, index) => (
                <section
                  key={paragraph.id}
                  className="card paragraph-card"
                  style={{ position: 'relative' }}
                  onClick={() => {
                    setCurrentParagraphId(paragraph.id);
                    setEditedParagraphText(paragraph.text);
                    setScreen('paragraph-edit');
                  }}
                >
                  <h3 className="paragraph-title">문단 {index + 1}</h3>

                  {paragraph.text
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, lineIndex) => (
                      <p key={lineIndex} className="paragraph-text">
                        {line}
                      </p>
                    ))}

                  {isProofreadingComplete && paragraph.originalCharCount && paragraph.editedCharCount && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#86868B',
                        marginTop: '8px',
                        textAlign: 'right'
                      }}
                    >
                      {paragraph.originalCharCount}자 → {paragraph.editedCharCount}자
                    </p>
                  )}

                  {/* 🔥 NEW: 첨삭 완료 시 수정 내용 보기 아이콘 */}
                  {isProofreadingComplete &&
                    paragraph.editInstructions &&
                    paragraph.editInstructions.length > 0 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditInfoPopup({
                            paragraphId: paragraph.id,
                            editInstructions: paragraph.editInstructions
                          });
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#F3F4F6',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: '1px solid #E5E7EB'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E5E7EB';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F3F4F6';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="수정 내용 보기"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
                          <line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="12"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="12" cy="16" r="1" fill="#9CA3AF" />
                        </svg>
                      </div>
                    )}
                </section>
              ))
            ) : (
              <p className="empty-state">자소서 문단이 없습니다. 다시 생성해 주세요.</p>
            )}
          </div>

          {/* 🔥 NEW: 수정 내용 팝업 (컴포넌트명 변경 버전) */}
          {showEditInfoPopup && (
            <ParagraphEditInfoPopup
              paragraphId={showEditInfoPopup.paragraphId}
              editInstructions={showEditInfoPopup.editInstructions}
              onClose={() => setShowEditInfoPopup(null)}
            />
          )}

          <div className="action-buttons">
            {!isProofreadingComplete && (
              <button
                className="button-primary"
                onClick={handleFinalizeCoverLetter}
                disabled={state.loading || !state.coverLetterParagraphs.length}
              >
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>자소서 확정하고 첨삭받기</span>
              </button>
            )}

            {isProofreadingComplete && (
              <button className="button-primary" onClick={handleCompleteCoverLetter} disabled={state.loading}>
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>자소서 완성버전 보러가기</span>
              </button>
            )}

</div>
          {state.showProofreadingPopup && (
            <>
              <div className="modal-overlay" />
              <div className="modal proofreading-modal">
                <div className="modal-header">
                  <span>첨삭 진행 중</span>
                </div>
                <div className="modal-content">
                  <div className="loading-container">
                    <div className="loading-indicator">
                      <div className="progress-ring"></div>
                    </div>
                    <p>딥글이 자소서를 첨삭하는 중...</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {state.loading && <LoadingModal message={currentMessage} />}
          </div>
        </>
      )}

      {/* Paragraph Edit */}
      {screen === 'paragraph-edit' && (
        <div className="screen-container">
          <h2>문단 수정</h2>
          <p className="description-text">왼쪽 원본을 참고하여 오른쪽에서 문단을 수정해 주세요.</p>
          <div className="edit-container">
            <div className="edit-panel original-panel">
              <h3>원본 문단</h3>
              <div className="original-text" ref={originalTextRef}>
                {(() => {
                  const currentParagraph = state.coverLetterParagraphs.find((p) => p.id === currentParagraphId);
                  if (!currentParagraph) {
                    return <p>문단을 찾을 수 없습니다.</p>;
                  }
                  const lines = currentParagraph.text.split('\n').filter((line) => line.trim());
                  if (lines.length === 0) {
                    return <p>문단 내용이 없습니다.</p>;
                  }
                  const suggestionsForParagraph =
                    state.aiProofreadingSuggestions.length > 0
                      ? state.aiProofreadingSuggestions.find((s) => s.paragraphId === currentParagraphId)?.suggestions || []
                      : state.aiScreeningSuggestions.find((s) => s.paragraphId === currentParagraphId)?.suggestions || [];

                  if (suggestionsForParagraph.length === 0) {
                    return lines.map((line, index) => (
                      <p key={index} className="text-line">
                        수정 제안이 없습니다: {line}
                      </p>
                    ));
                  }

                  return lines.map((line, index) => {
                    const matchingSuggestions = suggestionsForParagraph.filter(
                      (s) =>
                        s.sentence.trim().replace(/\.+$/, '').toLowerCase() ===
                        line.trim().replace(/\.+$/, '').toLowerCase()
                    );
                    const suggestion = matchingSuggestions.length > 0 ? matchingSuggestions[0] : null;

                    return (
                      <p
                        key={index}
                        className={`text-line ${suggestion ? 'has-suggestion' : ''}`}
                        onClick={() => {
                          if (suggestion) {
                            setShowAiSuggestionPopup({ paragraphId: currentParagraphId, sentence: line });
                          }
                        }}
                        id={`sentence-${index}`}
                      >
                        {line}
                        {suggestion && (
                          <span className="suggestion-indicator" style={{ marginLeft: '8px' }}>
                            <GlassIcon type="sparkle" size={16} />
                          </span>
                        )}
                      </p>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="edit-panel">
              <h3>수정 문단</h3>
              <textarea
                className="input-field textarea-field edit-textarea"
                value={editedParagraphText}
                onChange={(e) => setEditedParagraphText(e.target.value)}
                disabled={state.loading}
                ref={editorRef}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="button-primary"
              onClick={() => handleSaveParagraph(currentParagraphId, editedParagraphText)}
              disabled={state.loading || !editedParagraphText.trim()}
            >
              <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
              <span>저장하고 다음 문단 수정하기</span>
            </button>
    
          </div>

          {showAiSuggestionPopup && (
            <>
              <div className="modal-overlay" onClick={() => setShowAiSuggestionPopup(null)} />
              <div className="modal suggestion-modal">
                <div className="modal-header">
                  <span>{state.aiProofreadingSuggestions.length > 0 ? '첨삭 제안' : 'AI 문체 수정 제안'}</span>
                  <button className="modal-close" onClick={() => setShowAiSuggestionPopup(null)}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  {(() => {
                    const suggestions =
                      state.aiProofreadingSuggestions.length > 0 ? state.aiProofreadingSuggestions : state.aiScreeningSuggestions;

                    const suggestion = suggestions
                      .find((s) => s.paragraphId === showAiSuggestionPopup.paragraphId)
                      ?.suggestions.find(
                        (s) =>
                          s.sentence.trim().replace(/\.+$/, '').toLowerCase() ===
                          showAiSuggestionPopup.sentence.trim().replace(/\.+$/, '').toLowerCase()
                      );

                    return suggestion ? (
                      state.aiProofreadingSuggestions.length > 0 ? (
                        <>
                          <p>
                            <strong>문장:</strong> {suggestion.sentence}
                          </p>
                          <p>
                            <strong>카테고리:</strong> {suggestion.category}
                          </p>
                          <p>
                            <strong>문제:</strong> {suggestion.issue}
                          </p>
                          <p>
                            <strong>제안:</strong> {suggestion.suggestion}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>문장:</strong> {suggestion.sentence}
                          </p>
                          <p>
                            <strong>문제점:</strong> {suggestion.reason}
                          </p>
                          <p>
                            <strong>수정 제안:</strong> {suggestion.proposal}
                          </p>
                        </>
                      )
                    ) : (
                      <p>제안 정보를 찾을 수 없습니다.</p>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}

      {/* Cover Letter Completion */}
    {/* Cover Letter Completion */}
{screen === 'cover-letter-completion' && (
  <div className="screen-container">
    <h2>최종 자소서</h2>
    <p className="description-text">딥글이 완성한 최종 자소서를 확인해 주세요.</p>
    <div className="final-letter-container">
      {state.coverLetterText ? (
        <div 
          className="final-letter-content"
          style={{ position: 'relative' }}
        >
          {/* 복사 버튼 */}
          <div
            onClick={() => {
              navigator.clipboard.writeText(state.coverLetterText).then(() => {
                alert('자소서가 클립보드에 복사되었습니다!');
              }).catch(() => {
                alert('복사에 실패했습니다. 직접 선택하여 복사해주세요.');
              });
            }}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '10px',
              border: '1px solid rgba(74, 85, 104, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(74, 85, 104, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
            }}
            title="자소서 복사하기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect 
                x="9" y="9" width="13" height="13" rx="2" 
                stroke="rgba(74, 85, 104, 0.8)" 
                strokeWidth="2"
              />
              <path 
                d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" 
                stroke="rgba(74, 85, 104, 0.8)" 
                strokeWidth="2"
              />
            </svg>
          </div>

          {state.coverLetterText.split('\n').map((line, index) => (
            <p key={index} className="paragraph-text">
              {line}
            </p>
          ))}
        </div>
      ) : (
        <p className="empty-state">자소서가 없습니다. 다시 생성해 주세요.</p>
      )}
    </div>

    {state.loading && <LoadingModal message={currentMessage} />}
  </div>
)}
    </div>

    {/* CSS 애니메이션 */}
    <style>{`
      @keyframes loadingPulse1 {
        0% {
          width: 80px;
          height: 80px;
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        100% {
          width: 160px;
          height: 160px;
          opacity: 0;
        }
      }

      @keyframes loadingPulse2 {
        0% {
          width: 80px;
          height: 80px;
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        100% {
          width: 160px;
          height: 160px;
          opacity: 0;
        }
      }

      @keyframes loadingPulse3 {
        0% {
          width: 80px;
          height: 80px;
          opacity: 0;
        }
        10% {
          opacity: 0.4;
        }
        100% {
          width: 160px;
          height: 160px;
          opacity: 0;
        }
      }

      @keyframes blurFadeIn {
        from {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(4px);
        }
      }

      @keyframes liquidFloat {
        0% {
          transform: translateY(20px) scale(0.8);
          opacity: 0;
        }
        50% {
          transform: translateY(-5px) scale(1.02);
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes liquidMove {
        0%,
        100% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        33% {
          transform: translate(-30%, -60%) rotate(120deg);
        }
        66% {
          transform: translate(-70%, -40%) rotate(240deg);
        }
      }

      @keyframes liquidRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes liquidSlide {
        0% {
          transform: translate(-50%, -60%) scale(0.8);
          opacity: 0;
          border-radius: 50px;
        }
        50% {
          border-radius: 30px;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          border-radius: var(--radius-xl);
        }
      }

      @keyframes messageSlide {
        from {
          transform: translateY(10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 인트로 애니메이션 */
      @keyframes rollInLeft {
        from {
          transform: translateX(-100vw) rotate(-1440deg);
          opacity: 0;
        }
        to {
          transform: translateX(0) rotate(0);
          opacity: 1;
        }
      }

      @keyframes rollInRight {
        from {
          transform: translateX(100vw) rotate(1440deg);
          opacity: 0;
        }
        to {
          transform: translateX(0) rotate(0);
          opacity: 1;
        }
      }

      @keyframes mergeToCenter {
        to {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 0;
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes glow {
        0%,
        100% {
          filter: drop-shadow(0 0 20px rgba(107, 114, 128, 0.4));
        }
        50% {
          filter: drop-shadow(0 0 40px rgba(107, 114, 128, 0.6));
        }
      }

      @keyframes letterFadeIn {
        from {
          opacity: 0;
          transform: translateY(20px) rotateX(90deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }
      }

      @keyframes slideUpFadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 두뇌 애니메이션 */
      @keyframes crossFadeIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* 애니메이션 클래스 */
      .hidden {
        opacity: 0;
        visibility: hidden;
      }

      .roll-in-left {
        animation: rollInLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .roll-in-right {
        animation: rollInRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .brain-left-roll {
        animation: rollInLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .brain-right-roll {
        animation: rollInRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .brain-merge {
        animation: mergeToCenter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .cross-fade-in {
        animation: crossFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .merge-to-center {
        animation: mergeToCenter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
      }

      .fade-in-scale {
        animation: fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .letter-fade-in {
        animation: letterFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .hint-icon-container:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 40px rgba(74, 85, 104, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }

      .hint-icon-container:hover .hint-icon-glow {
        opacity: 1;
      }

      .hint-icon-container:active {
        transform: scale(0.95);
      }

      .button-primary:hover,
      .button-secondary:hover {
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
      }

      .card:hover {
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
      }
 yoobyounghun@MacBook-Pro-2 frontend % sed -n '5385,5395p' src/App.js
      }

      .card:hover {
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
      }





`}</style>
      </main>
    </div>
  </div>
);
}




// 딥글 플로우 컴포넌트
// 딥글 플로우 컴포넌트
const DeepglFlow = ({ project, question, onBack }) => {
  const { userId, email } = useAuth();
    const navigate = useNavigate();
  const [screen, setScreen] = useState('loading');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);
  const [error, setError] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [analysisId, setAnalysisId] = useState('');
  const [reuseData, setReuseData] = useState(null);
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [reuseLoading, setReuseLoading] = useState(false);
  const isInitializedRef = useRef(false);
  // 초기 로딩 - 상태 확인 후 분기
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
  
    const initFlow = async () => {
      setScreen('loading');
      setLoadingMessage('진행 상태를 확인하고 있습니다...');
      
      try {
        // 0. 먼저 기존 진행 상태 확인
        const stateRes = await authFetch(
          `${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/questions/${question.id}/state?projectId=${project.id}`
        );
        const stateData = await stateRes.json();
        console.log('[DEBUG] Question state:', stateData);
        console.log('[DEBUG] stateData.reuse_info:', stateData.reuse_info);
        console.log('[DEBUG] stateData.reuseInfo:', stateData.reuseInfo);
        // 상태에 따라 분기
        if (stateData.success && stateData.status !== 'not_started') {
          // 이미 진행 중인 문항 - 해당 화면으로 복원
          const { status, analysisData, conversationState } = stateData;
          
          setResumeId(analysisData.resumeId || '');
          setAnalysisId(analysisData.analysisId || '');
          console.log('[DEBUG] analysisData:', analysisData);
          setSelectedExperiences(analysisData.selectedExperiences || []);
          
          console.log('[DEBUG] Restoring to status:', status);
          if (status === 'reuse_pending') {
            // 재활용 제안 화면으로 이동
            const reuseInfo = stateData.reuseInfo || stateData.reuse_info || question.reuse_info || project.reuse_info || {};
            const selectedChains = reuseInfo.selectedChains || [];
            const globalStrategy = reuseInfo.globalStrategy || {};
            console.log('[DEBUG] reuse selectedChains:', selectedChains);
            console.log('[DEBUG] globalStrategy:', globalStrategy);
            if (selectedChains.length > 0) {
              setReuseData({
                companyName: project.company,
                selectedChains: selectedChains,
                globalStrategy: globalStrategy,
                targetCompany: project.company,
                questionChains: reuseInfo.questionChains || {}
              });
              setScreen('reuse-selection');
              return;
            }
          }
            
          if (status === 'direction') {
            // 방향성 선택 화면 - 카드 데이터가 없으면 API 호출
            if (!analysisData.selectedExperiences || analysisData.selectedExperiences.length === 0) {
              const directionRes = await authFetch(
                `${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${project.id}/questions/${question.id}/direction?userId=${userId}`
              );
              const directionData = await directionRes.json();
              console.log('[DEBUG] direction API 응답:', directionData);
              
              if (directionData.suggest_direction && directionData.suggest_direction.cards && directionData.suggest_direction.cards.length > 0) {
                setSelectedExperiences(directionData.suggest_direction.cards);
                setResumeId(directionData.resumeId || '');
                setAnalysisId(directionData.analysisId || '');
              }
            }
            setScreen('direction-selection');
            return;
          } else if (status === 'qa') {
            // 문답 진행 중 - localStorage에 저장하고 App.js로 이동
            const savedIndex = analysisData.selectedExperienceIndex ?? 0;
            localStorage.setItem('deepgl_selected_experience', JSON.stringify({
              projectId: project.id,
              questionId: question.id,
              selectedCard: analysisData.selectedExperiences[savedIndex],
              selectedIndex: savedIndex,
              resumeId: analysisData.resumeId,
              analysisId: analysisData.analysisId,
              selectedExperiences: analysisData.selectedExperiences,
              questionTopics: analysisData.questionTopics || [question.text],
              companyInfo: (analysisData.companyInfo && analysisData.companyInfo.company) 
                ? analysisData.companyInfo 
                : {
                  company: project.company,
                  jobTitle: project.jobTitle,
                  jobTasks: project.jobTasks || '',
                  jobRequirements: project.jobRequirements || ''
                },
              // 대화 상태 복원용
              conversationState: conversationState
            }));
            navigate(`/?flow=experience-extraction&projectId=${project.id}&questionId=${question.id}&restore=true`);
            return;
            return;
          } else if (status === 'episode' || status === 'plan' || status === 'letter' || status === 'done') {
            // 에피소드 이후 단계 - App.js로 이동
            const savedIndex = analysisData.selectedExperienceIndex ?? 0;
            localStorage.setItem('deepgl_selected_experience', JSON.stringify({
              projectId: project.id,
              questionId: question.id,
              selectedCard: analysisData.selectedExperiences[savedIndex],
              selectedIndex: savedIndex,
              resumeId: analysisData.resumeId,
              analysisId: analysisData.analysisId,
              selectedExperiences: analysisData.selectedExperiences,
              questionTopics: analysisData.questionTopics || [question.text],
              companyInfo: (analysisData.companyInfo && analysisData.companyInfo.company) ? analysisData.companyInfo : {
                company: project.company,
                jobTitle: project.jobTitle
              },
              restoreStatus: status,
              episodeData: stateData.episodeData,
              planData: stateData.planData,
              coverLetterData: stateData.coverLetterData,
              reviewData: stateData.reviewData
            }));
            navigate(`/?flow=restore&projectId=${project.id}&questionId=${question.id}&status=${status}`);
            return;
          }
        }

      // 새 문항 - DB에서 이미 분석된 데이터 즉시 로드
      setLoadingMessage('경험 카드를 불러오고 있습니다...');

      const directionRes = await authFetch(
        `${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${project.id}/questions/${question.id}/direction?userId=${userId}`
      );
      const directionData = await directionRes.json();
      console.log('[DEBUG] direction 응답:', directionData);

      if (directionData.suggest_direction && directionData.suggest_direction.cards && directionData.suggest_direction.cards.length > 0) {
        setResumeId(directionData.resumeId || '');
        setAnalysisId(directionData.analysisId || '');
        setSelectedExperiences(directionData.suggest_direction.cards);
        setScreen('direction-selection');
      } else {
        setError('추천 경험을 찾지 못했습니다.');
        setScreen('error');
      }

      } catch (err) {
        console.error('딥글 플로우 초기화 실패:', err);
        setError(err.message || '오류가 발생했습니다.');
        setScreen('error');
      }
    };

    initFlow();
  }, [project, question, userId, navigate]);

  // 경험 선택 핸들러
  const handleExperienceSelect = (index) => {
    setSelectedExperienceIndex(index);
  };

  // 로딩 화면
  if (screen === 'loading') {
    return (
      <div className="deepgl-flow-container">
        <div className="deepgl-flow-loading">
          <div className="loading-logo-container">
            <svg width="80" height="80" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="flowLoadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#flowLoadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
              <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
              <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
            </svg>
            <div className="pulse-ring pulse-ring-1"></div>
            <div className="pulse-ring pulse-ring-2"></div>
            <div className="pulse-ring pulse-ring-3"></div>
          </div>
          <p className="loading-message">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (screen === 'error') {
    return (
      <div className="deepgl-flow-container">
        <div className="deepgl-flow-error">
          <p>{error}</p>
          <button className="button-primary" onClick={onBack}>
            프로젝트로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  if (screen === 'reuse-selection') {
    const handleReuseConfirm = async () => {
      setReuseLoading(true);
      try {
        const response = await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/api/generate-reuse-episode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            projectId: project.id,
            questionId: question.id,
            episodeId: reuseData.selectedEpisode?.episodeId || reuseData.questionChains?.[question.id]?.selectedEpisode?.episodeId,
            globalStrategy: reuseData.globalStrategy,
            jobPosting: {
              company: project.company,
              jobTitle: project.jobTitle,
              jobTasks: project.jobTasks || '',
              jobRequirements: project.jobRequirements || ''
            },
            targetQuestion: question.text
          })
        });
        const result = await response.json();
        console.log('[DEBUG] generate-reuse-episode result:', result);
        if (result.success) {
          localStorage.setItem('deepgl_reused_episode', JSON.stringify({
            projectId: project.id,
            questionId: question.id,
            episode: result.episode,
            metadata: result.metadata,
            companyInfo: { company: project.company, jobTitle: project.jobTitle },
            talentProfile: reuseData.globalStrategy?.talentProfile || '',
            coreCompetency: reuseData.globalStrategy?.coreCompetency || '',
            questionText: question.text
          }));
          navigate(`/?flow=reused-episode&projectId=${project.id}&questionId=${question.id}`);
        } else {
          setError(result.error || '에피소드 생성에 실패했습니다.');
        }
      } catch (err) {
        console.error('재활용 에피소드 생성 실패:', err);
        setError('에피소드 생성에 실패했습니다.');
      } finally {
        setReuseLoading(false);
      }
    };
    const handleReuseReject = async () => {
      try {
        // 1. 상태를 direction으로 변경
        await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/api/projects/${project.id}/questions/${question.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, status: 'direction' })
        });
        
        // 2. direction API 호출해서 경험 카드 로드
        const directionRes = await authFetch(
          `${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${project.id}/questions/${question.id}/direction?userId=${userId}`
        );
        const directionData = await directionRes.json();
        
        if (directionData.suggest_direction && directionData.suggest_direction.cards && directionData.suggest_direction.cards.length > 0) {
          setResumeId(directionData.resumeId || '');
          setAnalysisId(directionData.analysisId || '');
          setSelectedExperiences(directionData.suggest_direction.cards);
        }
      } catch (err) {
        console.error('상태 변경 실패:', err);
      }
      setScreen('direction-selection');
    };

    // 로딩 상태일 때 전체화면 로딩 (사이드바 포함)
    if (reuseLoading) {
      return (
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="sidebar-profile" onClick={() => navigate('/mypage')}>
              <div className="profile-avatar">
              {email ? email[0].toUpperCase() : 'U'}               
                        </div>
            </div>
            <div className="sidebar-spacer" />
            <button className="sidebar-logout" onClick={() => { navigate('/dglc/charge'); }} title="충전" style={{ marginBottom: '12px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
            </button>
            <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/search'); }} title="검색" style={{ marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/database'); }} title="데이터베이스" style={{ marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </button>
            <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/dashboard'); }} title="대시보드" style={{ marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <button className="sidebar-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="로그아웃">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </aside>
          <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FBFBFD',
            minHeight: '100vh'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="80" height="80" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="reuseLoadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="80" fill="url(#reuseLoadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
                  <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                  <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                </svg>
                <div className="pulse-ring pulse-ring-1"></div>
                <div className="pulse-ring pulse-ring-2"></div>
                <div className="pulse-ring pulse-ring-3"></div>
              </div>
              <p style={{
                color: '#4B5563',
                fontSize: '17px',
                fontWeight: '500',
                margin: 0
              }}>에피소드를 재구성하고 있습니다...</p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile" onClick={() => navigate('/mypage')}>
            <div className="profile-avatar">
            {email ? email[0].toUpperCase() : 'U'}       
                       </div>
          </div>
          <div className="sidebar-spacer" />
          <button className="sidebar-logout" onClick={() => { navigate('/dglc/charge'); }} title="충전" style={{ marginBottom: '12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
          </button>
          <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/search'); }} title="검색" style={{ marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/database'); }} title="데이터베이스" style={{ marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </button>
          <button className="sidebar-logout" onClick={() => { setScreen('start'); navigate('/dashboard'); }} title="대시보드" style={{ marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <button className="sidebar-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="로그아웃">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </aside>
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#FBFBFD',
          minHeight: '100vh',
          overflow: 'auto',
          padding: '40px 24px'
        }}>
          <div style={{ maxWidth: '640px', width: '100%' }}>
            {/* 헤더 */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1D1D1F',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              재활용 제안서
            </h1>
            
            <p style={{
              fontSize: '15px',
              color: '#86868B',
              marginBottom: '32px',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              이전에 작성한 경험을 <strong style={{ color: '#1D1D1F' }}>{project.company}</strong>에 맞게 재구성합니다
            </p>

            {/* 강조할 역량 */}
            {reuseData?.globalStrategy?.coreCompetency && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#86868B',
                  marginBottom: '8px'
                }}>
                  강조할 역량
                </p>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1D1D1F',
                    margin: 0
                  }}>
                    {reuseData.globalStrategy.coreCompetency}
                  </p>
                </div>
              </div>
            )}

            {/* 맞춰야 할 인재상 */}
            {reuseData?.globalStrategy?.talentProfile && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#86868B',
                  marginBottom: '8px'
                }}>
                  맞춰야 할 인재상
                </p>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <p style={{
                    fontSize: '15px',
                    color: '#1D1D1F',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {reuseData.globalStrategy.talentProfile}
                  </p>
                </div>
              </div>
            )}

            {/* 재구성 방향 */}
            {reuseData?.globalStrategy?.storyAngle && (
              <div style={{ marginBottom: '28px' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#86868B',
                  marginBottom: '8px'
                }}>
                  재구성 방향
                </p>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <p style={{
                    fontSize: '15px',
                    color: '#1D1D1F',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {reuseData.globalStrategy.storyAngle}
                  </p>
                </div>
              </div>
            )}

            {/* 활용할 내 경험 (체인 목록) */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#86868B',
                marginBottom: '12px'
              }}>
                활용할 내 경험 ({reuseData?.selectedChains?.length || 0}개)
              </p>
              
              <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                {reuseData?.selectedChains?.map((chain, index) => (
                  <div 
                    key={chain.chainId || index}
                    style={{
                      padding: '20px',
                      borderBottom: index < reuseData.selectedChains.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {/* 번호 + 회사명 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        background: 'rgba(74, 85, 104, 0.1)',
                        borderRadius: '50%',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#4A5568'
                      }}>
                        {index + 1}
                      </span>
                      {chain.companyName && (
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#86868B'
                        }}>
                          {chain.companyName}
                        </span>
                      )}
                    </div>

                    {/* Chain 흐름: precondition → action → postcondition */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      paddingLeft: '34px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#86868B', minWidth: '16px' }}>•</span>
                        <p style={{ fontSize: '14px', color: '#1D1D1F', margin: 0, lineHeight: '1.5' }}>
                          {chain.precondition}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#4A5568', minWidth: '16px' }}>→</span>
                        <p style={{ fontSize: '14px', color: '#1D1D1F', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                          {chain.action}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#4A5568', minWidth: '16px' }}>→</span>
                        <p style={{ fontSize: '14px', color: '#1D1D1F', margin: 0, lineHeight: '1.5' }}>
                          {chain.postcondition}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {chain.tags && chain.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '12px',
                        paddingLeft: '34px'
                      }}>
                        {chain.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            style={{
                              fontSize: '12px',
                              color: '#4A5568',
                              background: 'rgba(74, 85, 104, 0.08)',
                              padding: '4px 10px',
                              borderRadius: '6px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(!reuseData?.selectedChains || reuseData.selectedChains.length === 0) && (
                  <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#86868B', margin: 0 }}>
                      재활용 가능한 경험이 없습니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <button
                onClick={handleReuseReject}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1D1D1F',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                경험 새롭게 구체화하기
              </button>
              <button
                onClick={handleReuseConfirm}
                disabled={!reuseData?.selectedChains?.length}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: !reuseData?.selectedChains?.length ? '#D1D1D6' : '#1D1D1F',
                  cursor: !reuseData?.selectedChains?.length ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (reuseData?.selectedChains?.length) e.target.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                경험 재구성하기
              </button>
            </div>
          </div>
        </main>
       
      </div>
    );
  }

  // 방향성 선택 화면
  if (screen === 'direction-selection') {
    return (
      <div className="deepgl-flow-container">
        <div className="deepgl-flow-header">
          <button className="back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            돌아가기
          </button>
          <div className="flow-title-section">
            <h1>{question.text}</h1>
            <p>{project.company} / {project.jobTitle} • {question.wordLimit || 1000}자</p>
          </div>
        </div>

        <div className="deepgl-flow-content">
          <h2>구체화 방향성 선택</h2>
          <p className="flow-description">아래에서 자소서에 넣을 경험을 선택하세요</p>

          <div className="experience-cards-grid">
            {selectedExperiences.map((exp, index) => (
              <div
                key={index}
                className={`experience-card ${selectedExperienceIndex === index ? 'selected' : ''}`}
                onClick={() => handleExperienceSelect(index)}
              >
                <p className="card-title">{exp.company}</p>
                <p className="card-description">{exp.description}</p>

                <div className="card-section">
                  <h4>매칭 정보</h4>
                  <p><strong>주제:</strong> {exp.topic}</p>
                  <p><strong>인재상:</strong> {exp.talentProfile || project.overallStrategy?.commonProfile?.talentProfile || '-'}</p>
                  <p><strong>핵심역량:</strong> {exp.competency}</p>
                </div>

                <div className="card-section">
                  <h4>딥글 분석 결과</h4>
                  <p><strong>주제-경험:</strong> {exp.whySelected?.['주제-경험'] || '-'}</p>
                  <p><strong>인재상-역량-경험:</strong> {exp.whySelected?.['인재상-역량-경험'] || exp.whySelected?.['역량-경험'] || '-'}</p>
                  <p><strong>회사-경험:</strong> {exp.whySelected?.['회사-경험'] || '-'}</p>
                </div>

                {exp.integratedAnalysis && (
                  <div className="card-section">
                    <h4>통합분석</h4>
                    <p>{exp.integratedAnalysis}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flow-actions">
            <button
              className="button-primary"
              disabled={selectedExperienceIndex === null}
              onClick={async () => {
                const selectedCard = selectedExperiences[selectedExperienceIndex];
                
        // DB에 선택한 인덱스 저장
        try {
          await authFetch(`${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${project.id}/questions/${question.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              selectedExperienceIndex: selectedExperienceIndex,
              status: 'qa'
            })
          });
        } catch (err) {
          console.error('인덱스 저장 실패:', err);
        }
        
        // 선택된 경험 정보를 localStorage에 저장하고 기존 플로우로 이동
        localStorage.setItem('deepgl_selected_experience', JSON.stringify({
          projectId: project.id,
          questionId: question.id,
          selectedCard,
          selectedIndex: selectedExperienceIndex,
          resumeId: resumeId,
          analysisId: analysisId,
          selectedExperiences: selectedExperiences,
          questionTopics: [selectedCard.topic],
          companyInfo: {
            company: project.company,
            jobTitle: project.jobTitle,
            jobTasks: project.jobTasks || '',
            jobRequirements: project.jobRequirements || ''
          }
        }));
        // 기존 App.js 플로우의 문답 화면으로 이동
        navigate(`/?flow=experience-extraction&projectId=${project.id}&questionId=${question.id}`);
      }}
            >
              경험 구체화하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 채팅 화면 (임시)
  if (screen === 'chat') {
    return (
      <div className="deepgl-flow-container">
        <div className="deepgl-flow-header">
          <button className="back-button" onClick={() => setScreen('direction-selection')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            돌아가기
          </button>
          <div className="flow-title-section">
            <h1>경험 구체화</h1>
            <p>{project.company} / {project.jobTitle}</p>
          </div>
        </div>
        <div className="deepgl-flow-content">
          <p>채팅 화면이 여기에 표시됩니다.</p>
          <p>선택된 경험: {selectedExperiences[selectedExperienceIndex]?.company}</p>
        </div>
      </div>
    );
  }

  // 기본 반환
  return null;
};

// 딥글 플로우 래퍼 컴포넌트
const DeepglFlowWrapper = () => {
  const { projectId, questionId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await authFetch(
          `${process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app'}/projects/${projectId}?userId=${userId}`
        );
        const data = await response.json();
        
        if (data.project) {
          setProjectData(data.project);
          const question = data.questions?.find(q => q.id === questionId);
          if (question) {
            setQuestionData(question);
          } else {
            setError('문항을 찾을 수 없습니다.');
          }
        } else {
          setError('프로젝트를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && projectId) {
      loadData();
    }
  }, [projectId, questionId, userId]);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FBFBFD'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#86868B' }}>불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData || !questionData) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FBFBFD',
        gap: '16px'
      }}>
        <p style={{ color: '#FF3B30' }}>{error || '데이터를 찾을 수 없습니다.'}</p>
        <button 
          className="button-primary"
          onClick={() => navigate(`/project/${projectId}`)}
        >
          프로젝트로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <DeepglFlow 
      project={projectData} 
      question={questionData}
      onBack={() => navigate(`/project/${projectId}`)}
    />
  );
};

export default App;