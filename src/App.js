/// Section 1: Initial Setup and State Management for App.js (딥글 글래스모피즘 버전)
// This section includes imports, initial state, reducer, and state declarations
// Attach this section first when reconstructing App.js
import React, { useState, useReducer, useRef, useEffect } from 'react';
import './App.css';

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
      <style jsx>{`
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

// 글래스모피즘 아이콘 컴포넌트 (이모티콘 대체)
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
        companyInfo: action.companyInfo || state.companyInfo,
        competencies: action.competencies || state.competencies,
        selectedExperiences: action.selectedExperiences || state.selectedExperiences,
        selectedExperiencesIndices: action.selectedExperiencesIndices || state.selectedExperiencesIndices,
        questionTopics: action.questionTopics || state.questionTopics,
        selectedForTopics: action.selectedForTopics || state.selectedForTopics
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

// ✅ 동적 로딩 메시지 시스템 (엔드포인트별 interval 포함)
const LOADING_STAGES = {
  'pre-analyze': {
    messages: [
      '{company}의 채용 공고 정보 수집 중...',
      '{company}의 직무 요구사항 분석 중...',
      '{company}가 원하는 인재상 파악 중...',
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
      '{company} 연결성 전략 최적화 중...'
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

// ✅ 동적 로딩 메시지 커스텀 훅
const useLoadingMessage = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const timerRef = useRef(null);
  const stageIndexRef = useRef(0);

  const formatMessage = (template, context) => {
    return template
      .replace('{company}', context.company || '회사')
      .replace('{topic}', context.topic || '주제');
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [screen, setScreen] = useState('start');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
 
  // Process step tracking
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const PROCESS_STEPS = ['회사정보', '이력서분석', '경험구체화 및 에피소드생성', '계획서 생성', '자소서작성', '최종검토'];
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [showPlanTransitionPopup, setShowPlanTransitionPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentExperienceStep, setCurrentExperienceStep] = useState(1);
  const [currentParagraphId, setCurrentParagraphId] = useState(null);
  const [editedParagraphText, setEditedParagraphText] = useState('');
  const [showAiSuggestionPopup, setShowAiSuggestionPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 새로 추가: 첨삭 완료 상태 추적
  const [isProofreadingComplete, setIsProofreadingComplete] = useState(false);

  // 힌트 관련 state
  const [currentQuestionHint, setCurrentQuestionHint] = useState('');
  const [showHintTooltip, setShowHintTooltip] = useState(false);
  const [hintTooltipPosition, setHintTooltipPosition] = useState({ x: 0, y: 0 });
 
  // Simplified popup positions
  const [aiSuggestionPopupPosition, setAiSuggestionPopupPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 });
  const planPopupRef = useRef(null);
  const chatBoxRef = useRef(null);
  const aiSuggestionPopupRef = useRef(null);
  const originalTextRef = useRef(null);
  const editorRef = useRef(null);
  const proofreadingPopupRef = useRef(null);

  // ✅ 동적 로딩 메시지 훅 사용
  const { currentMessage, startLoading, stopLoading } = useLoadingMessage();

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

  // ✅ 수정: handlePreAnalysisSubmit
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
    
    startLoading('pre-analyze', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      const response = await fetch('https://youngsun-xi.vercel.app/pre-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: state.companyInfo.company,
          jobTitle: state.companyInfo.jobTitle,
          jobTasks: state.companyInfo.jobTasks,
          jobRequirements: state.companyInfo.jobRequirements,
          questions: state.companyInfo.questions
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
        goToPreAnalysisReview();
      }
    } catch (error) {
      setError(`서버에 문제가 생겼습니다: ${error.message}`);
    }
    
    stopLoading();
    dispatch({ type: 'SET_LOADING', loading: false, message: '' });
  };

  // ✅ 수정: handleAnalysisSubmit
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
      const response = await fetch('https://youngsun-xi.vercel.app/analyze-all', {
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
        companyInfo: updatedCompanyInfo,
        competencies: data.competencies,
        selectedExperiences: reindexedExperiences,
        selectedExperiencesIndices: Array(data.questionTopics.length).fill(null),
        questionTopics: data.questionTopics,
        selectedForTopics: data.selectedForTopics || []
      });
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
   
      const response = await fetch('https://youngsun-xi.vercel.app/suggest-direction', {
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
     
      const response = await fetch('https://youngsun-xi.vercel.app/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          selectedExperienceIndices: state.selectedExperiencesIndices,
          chatHistory: [],
          questionTopics: state.questionTopics,
          topicIndex: currentTopicIndex,
          step: 1
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
      const response = await fetch('https://youngsun-xi.vercel.app/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          previousAnswer: answer || '',
          selectedExperienceIndices: state.selectedExperiencesIndices,
          chatHistory,
          questionTopics: state.questionTopics,
          topicIndex: currentExperienceStep - 1,
          step: currentStep
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
    if (!currentAnswer.trim() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    const userAnswer = currentAnswer;
    setCurrentAnswer('');
    
    const currentBubble = document.querySelector('.focus-question-bubble');
    if (currentBubble) {
      currentBubble.style.animation = 'slideOutToRight 0.6s ease-in-out forwards';
      
      setTimeout(() => {
        const currentStep = questionCount;
        if (currentStep === 3) {
          handleGenerateQuestion(userAnswer, 3);
        } else {
          handleGenerateQuestion(userAnswer, currentStep + 1);
        }
        setIsSubmitting(false);
      }, 600);
    } else {
      setIsSubmitting(false);
    }
  };

  const goToPlanView = () => {
    console.log(`[${new Date().toISOString()}] Transitioning to plan-view screen`);
    if (!state.analysisId || !state.resumeId) {
      setError('분석 데이터가 없습니다. 처음부터 다시 시작해주세요.');
      setScreen('start');
      return;
    }
    setCurrentProcessStep(3);
    setShowPlanTransitionPopup(false);
    setScreen('plan-view');
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
      const response = await fetch('https://youngsun-xi.vercel.app/generate-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          chatHistory,
          questionTopics: state.questionTopics,
          currentTopic,
          selectedExperienceIndices: state.selectedExperiencesIndices
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
        keywords: data.keywords || []
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

  // ✅ 수정: handlePlanRequest
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
      if (!state.analysisId) {
        throw new Error('분석 데이터가 없습니다. 다시 시도해주세요.');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);
      const response = await fetch('https://youngsun-xi.vercel.app/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: state.resumeId,
          analysisId: state.analysisId,
          companyInfo: state.companyInfo,
          chatHistory,
          questionTopics: state.questionTopics,
          summarizedEpisodes: state.summarizedEpisodes
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
     
        dispatch({
          type: 'SET_PLAN',
          plan: data.plan,
          source: sourceArray,
          processing: data.processing,
          nextStep: data.nextStep,
          summarizedExperiences: data.summarizedExperiences
        });
        setChatHistory([...chatHistory, { sender: '딥글', message: '계획서가 준비되었습니다. 확인해보세요.' }]);
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

  // ✅ 수정: handleGenerateCoverLetter
  const handleGenerateCoverLetter = async () => {
    console.log(`[${new Date().toISOString()}] Before /generate-cover-letter:`, {
      resumeId: state.resumeId,
      analysisId: state.analysisId,
      plan: state.plan
    });
    
    startLoading('generate-cover-letter', { company: state.companyInfo.company });
    dispatch({ type: 'SET_LOADING', loading: true, message: '' });
    
    try {
      if (!state.plan || !state.resumeId || !state.analysisId) {
        throw new Error('계획서 또는 분석 데이터가 없습니다. 다시 시도해주세요.');
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      const response = await fetch('https://youngsun-xi.vercel.app/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterInstructions: state.plan.paragraphInstructions
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
      const updatedParagraphs = state.coverLetterParagraphs.map((paragraph =>
        paragraph.id === paragraphId ? { ...paragraph, text: editedText } : paragraph
      ));
      dispatch({
        type: 'SET_COVER_LETTER',
        paragraphs: updatedParagraphs
      });
      localStorage.setItem(`coverLetter_${state.resumeId}`, JSON.stringify(updatedParagraphs));
      setChatHistory([...chatHistory, { sender: '딥글', message: `문단 ${paragraphId} 저장 완료` }]);
      goToCoverLetterView();
    } catch (error) {
      setError(`문단 저장 실패: ${error.message}`);
      setChatHistory([...chatHistory, { sender: '딥글', message: '문단 저장에 문제가 생겼습니다...' }]);
    }
  };

  // ✅ 수정: handleFinalizeCoverLetter
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
      
      const response = await fetch('https://youngsun-xi.vercel.app/edit-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphs: state.coverLetterParagraphs
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
      
      const editedParagraphs = data.paragraphs.map(p => {
        console.log(`[DEBUG] 문단 ${p.id}: original=${p.original?.substring(0, 50)}..., edited=${p.edited?.substring(0, 50)}...`);
        return {
          id: p.id,
          text: p.edited,
          originalText: p.original,
          originalCharCount: p.originalCharCount,
          editedCharCount: p.editedCharCount
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

  // ✅ 수정: 글래스모피즘 LoadingModal
  const LoadingModal = ({ message }) => (
    <div className="loading-modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="loading-modal" style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        minWidth: '320px',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div className="loading-indicator" style={{
          margin: '0 auto 24px auto',
          width: '80px',
          height: '80px',
          position: 'relative',
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
            border: '1px solid rgba(255, 255, 255, 0.4)',
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
            border: '1px solid rgba(255, 255, 255, 0.3)',
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'loadingPulse3 2.5s ease-out infinite',
            animationDelay: '1.6s',
            pointerEvents: 'none'
          }} />
        </div>
        
        <p style={{
          color: '#FFFFFF',
          fontSize: '17px',
          fontWeight: '500',
          margin: 0,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        }}>{message}</p>
      </div>
    </div>
  );


  // End of Section 1


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

// 힌트 표시 상태 관리
const [showHintInBubble, setShowHintInBubble] = useState(false);

//////1234/////


// 안전한 렌더링 헬퍼 함수
const safeRender = (value, fallback = '정보 없음') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object') return JSON.stringify(value);
  return fallback;
};

const renderNewPlanStructure = (plan) => {
  console.log(`[${new Date().toISOString()}] Rendering enhanced plan structure with episode utilization v4.5 (Master Instructions):`, plan);
  
  // 🔥 Master Instructions 구조 체크 (v4.5)
  const isMasterInstructions = plan?.version === '4.5-master-instructions' || plan?.paragraphInstructions;
  
  // Topic-Enforced 구조 체크 (안전한 접근)
  const isTopicEnforced = plan?.metadata?.features?.topicEnforced || false;
  const questionTopic = plan?.metadata?.questionTopic || '';
  const topicIncludedInCore = plan?.metadata?.topicIncludedInCore || false;
  
  // 🔥 NEW: 에피소드 활용 시스템 체크
  const hasEpisodeStrategy = plan?.metadata?.features?.episodeUtilizationStrategy || false;
  const hasSessionMemory = plan?.metadata?.features?.sessionMemorySystem || false;
  const sessionId = plan?.metadata?.sessionId || plan?.sessionId || '';
  
  // 🔥 NEW v4.2: 수치 데이터 + 회사 연결성 시스템 체크
  const hasQuantitativeData = plan?.metadata?.features?.quantitativeDataAnalysis || false;
  const hasCompanyConnection = plan?.metadata?.features?.companyConnectionStrategy || false;
  const hasNaturalValidation = plan?.metadata?.features?.naturalConnectionValidation || false;
  
  // Topic 상태 계산 함수
  const getTopicStatus = () => {
    if (topicIncludedInCore) {
      return { 
        status: 'success', 
        text: '성공적으로 포함됨',
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        icon: '✅'
      };
    }
    if (questionTopic && !topicIncludedInCore) {
      return { 
        status: 'warning', 
        text: '자동 보정 예정',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: '⚠️'
      };
    }
    return { 
      status: 'info', 
      text: 'Topic 분석 불가',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: 'ℹ️'
    };
  };

  const topicStatus = getTopicStatus();
  
  return (
    <>
      {/* 🔥 NEW v4.5: Master Instructions 시스템 상태 배너 */}
      {isMasterInstructions && (
        <div className="section-card" style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>🎯</span>
            Master Instructions System v4.5
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>✅</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>120개 분석 통합</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>🎯</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>문단별 완전 지침</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>⚡</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>GPT-4.1 생성</div>
            </div>
          </div>
          {sessionId && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 12px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              세션 ID: {sessionId} | v4.5 Master Instructions (GPT-4.1)
            </div>
          )}
        </div>
      )}

      {/* 🔥 v4.2: 시스템 상태 배너 (기존 유지) */}
      {!isMasterInstructions && (
        <div className="section-card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>🚀</span>
            Enhanced Planning System v4.2
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                {isTopicEnforced ? '✅' : '❌'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Topic 강제 포함</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                {hasEpisodeStrategy ? '🎯' : '❌'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>에피소드 활용 전략</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                {hasSessionMemory ? '🧠' : '❌'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>세션 메모리</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                {hasQuantitativeData ? '📊' : '❌'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>수치 데이터 분석</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                {hasCompanyConnection ? '🏢' : '❌'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>회사 연결성 전략</div>
            </div>
          </div>
          {sessionId && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 12px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              세션 ID: {sessionId} | v4.2 Enhanced with Quantitative Data & Company Connection Strategy
            </div>
          )}
        </div>
      )}

      {/* 🔥 NEW v4.5: Master Instructions 문단별 상세 (최우선 표시) */}
      {isMasterInstructions && plan?.paragraphInstructions && Array.isArray(plan.paragraphInstructions) && (
        <div className="section-card" style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
          border: '3px solid #f59e0b'
        }}>
          <h3>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📋</span>
            Master Instructions (GPT-4.1 생성)
            <span style={{ 
              marginLeft: '12px', 
              fontSize: '12px', 
              background: '#dc2626', 
              color: 'white',
              padding: '4px 8px', 
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              v4.5 완전 통합 지침
            </span>
          </h3>
          
          <div style={{ 
            marginBottom: '15px', 
            padding: '12px', 
            background: 'rgba(245, 158, 11, 0.2)', 
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.5)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#92400e' }}>
              🎯 Master Instructions 시스템 특징
            </h4>
            <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
              • 120개 이상의 분석 결과를 하나의 완전한 지침으로 통합<br/>
              • GPT가 즉시 실행 가능한 상세한 작성 가이드<br/>
              • 각 문단마다 1000~1500자 분량의 완벽한 지침<br/>
              • 섹션5에서 이 지침만 GPT에게 전달
            </div>
          </div>

          {plan.paragraphInstructions.map((inst, idx) => (
            <div key={idx} style={{ 
              marginBottom: '20px',
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              border: '2px solid #fbbf24',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: '0', color: '#92400e', fontSize: '18px' }}>
                  📝 문단 {inst.paragraphId} Master Instruction
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#f59e0b', 
                    color: 'white', 
                    padding: '4px 10px', 
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    목표: {inst.targetLength}자
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#dc2626', 
                    color: 'white', 
                    padding: '4px 10px', 
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    {inst.lengthRange}
                  </span>
                </div>
              </div>

              <details open style={{ marginTop: '15px' }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  color: '#92400e',
                  fontSize: '15px',
                  marginBottom: '10px',
                  padding: '10px',
                  background: '#fef3c7',
                  borderRadius: '6px',
                  border: '1px solid #fbbf24'
                }}>
                  📋 완전한 Master Instruction 보기 ({inst.masterInstruction?.length || 0}자)
                </summary>
                <pre style={{ 
                  marginTop: '10px',
                  background: '#fffbeb',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#78350f',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #fde68a',
                  maxHeight: '600px',
                  overflow: 'auto'
                }}>
{inst.masterInstruction || '지침 없음'}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      {/* Topic 검증 상태 배너 (기존 유지) */}
      {isTopicEnforced && questionTopic && (
        <div className="section-card" style={{ 
          background: topicStatus.bgColor,
          border: `2px solid ${topicStatus.color}`,
          borderRadius: '8px'
        }}>
          <h3>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>
              {topicStatus.icon}
            </span>
            Topic 강제 포함 시스템
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <p><strong>감지된 핵심 주제:</strong> "{questionTopic}"</p>
            <p><strong>포함 상태:</strong> 
              <span style={{ color: topicStatus.color, fontWeight: 'bold', marginLeft: '8px' }}>
                {topicStatus.text}
              </span>
            </p>
          </div>
          {topicStatus.status === 'warning' && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px', 
              background: 'rgba(245, 158, 11, 0.2)', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              자소서 생성 시 "{questionTopic}" 주제가 자동으로 포함됩니다.
            </div>
          )}
        </div>
      )}

      {/* 🔥 NEW v4.2: 에피소드 활용 전략 요약 섹션 (수치 데이터 + 회사 연결성 포함) */}
      {plan?.dynamicEpisodeUtilizationSummary && Array.isArray(plan.dynamicEpisodeUtilizationSummary) && (
        <div className="section-card" style={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '2px solid #0ea5e9'
        }}>
          <h3>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🎯</span>
            완전 동적 에피소드 활용 전략 v4.2 (수치 데이터 + 회사 연결성 통합)
          </h3>
          
          {/* 전략 요약 */}
          <div style={{ 
            marginBottom: '15px', 
            padding: '12px', 
            background: 'rgba(14, 165, 233, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#0c4a6e' }}>v4.2 통합 활용 전략 개요</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', fontSize: '13px' }}>
              <span><strong>총 전략:</strong> {plan.dynamicEpisodeUtilizationSummary.length}개</span>
              <span><strong>STAR 분산:</strong> 문단별 최적화</span>
              <span><strong>🔢 수치 데이터:</strong> {hasQuantitativeData ? '통합됨' : '미포함'}</span>
              <span><strong>🏢 회사 연결성:</strong> {hasCompanyConnection ? '활성화' : '기본 모드'}</span>
            </div>
          </div>
          
          {/* 문단별 에피소드 전략 (v4.2 확장) */}
          {plan.dynamicEpisodeUtilizationSummary.map((strategy, idx) => (
            <div key={idx} style={{ 
              marginBottom: '12px',
              padding: '15px',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #bae6fd',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', color: '#0c4a6e', fontSize: '16px' }}>
                  문단 {strategy.paragraphId} 전략
                </h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#0ea5e9', 
                    color: 'white', 
                    padding: '3px 8px', 
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    STAR: {strategy.starFocus || 'ALL'}
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#64748b', 
                    color: 'white', 
                    padding: '3px 8px', 
                    borderRadius: '12px'
                  }}>
                    {strategy.utilizationMethod || '활용방법'}
                  </span>
                  {/* 🔥 NEW v4.2: 수치 데이터 뱃지 */}
                  {strategy.quantitativeDataUsage && strategy.quantitativeDataUsage !== '수치 데이터 미포함' && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#22c55e', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      📊 수치포함
                    </span>
                  )}
                  {/* 🔥 NEW v4.2: 회사 연결 뱃지 */}
                  {strategy.companyConnectionStrategy && strategy.companyConnectionStrategy !== '기본 회사 연결' && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#8b5cf6', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      🏢 회사연결
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                <p><strong>주요 에피소드:</strong> {strategy.primaryEpisode || '미정'}</p>
                <p><strong>활용 방법:</strong> {strategy.utilizationMethod || '전체활용'}</p>
                <p><strong>예상 내용:</strong> 
                  <span style={{ color: '#64748b', fontStyle: 'italic', marginLeft: '8px' }}>
                    {strategy.expectedContent || '구체적 경험과 성과 중심'}
                  </span>
                </p>
                
                {/* 🔥 NEW v4.2: 수치 데이터 활용 정보 */}
                {strategy.quantitativeDataUsage && strategy.quantitativeDataUsage !== '수치 데이터 미포함' && (
                  <p><strong>🔢 수치 데이터 활용:</strong> 
                    <span style={{ color: '#059669', fontWeight: 'bold', marginLeft: '8px' }}>
                      {strategy.quantitativeDataUsage}
                    </span>
                  </p>
                )}
                
                {/* 🔥 NEW v4.2: 회사 연결성 정보 */}
                {strategy.companyConnectionStrategy && strategy.companyConnectionStrategy !== '기본 회사 연결' && (
                  <p><strong>🏢 회사 연결 전략:</strong> 
                    <span style={{ color: '#7c3aed', fontWeight: 'bold', marginLeft: '8px' }}>
                      {strategy.companyConnectionStrategy}
                    </span>
                  </p>
                )}
                
                {/* 🔥 NEW v4.2: 자연스러운 연결 검증 */}
                {strategy.naturalConnectionValidation && strategy.naturalConnectionValidation !== '검증 없음' && (
                  <p><strong>✅ 연결 자연스러움:</strong> 
                    <span style={{ color: '#0891b2', fontStyle: 'italic', marginLeft: '8px' }}>
                      {strategy.naturalConnectionValidation}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 FALLBACK: 기존 에피소드 활용 전략 요약 섹션 (하위 호환성) */}
      {!plan?.dynamicEpisodeUtilizationSummary && plan?.episodeUtilizationSummary && Array.isArray(plan.episodeUtilizationSummary) && (
        <div className="section-card" style={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '2px solid #0ea5e9'
        }}>
          <h3>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🎯</span>
            에피소드 활용 전략 (STAR 방법론)
          </h3>
          
          {/* 전략 요약 */}
          <div style={{ 
            marginBottom: '15px', 
            padding: '12px', 
            background: 'rgba(14, 165, 233, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#0c4a6e' }}>활용 전략 개요</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '13px' }}>
              <span><strong>총 전략:</strong> {plan.episodeUtilizationSummary.length}개</span>
              <span><strong>STAR 분산:</strong> 문단별 최적화</span>
              <span><strong>중복 방지:</strong> 활성화됨</span>
            </div>
          </div>
          
          {/* 문단별 에피소드 전략 */}
          {plan.episodeUtilizationSummary.map((strategy, idx) => (
            <div key={idx} style={{ 
              marginBottom: '12px',
              padding: '15px',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #bae6fd',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', color: '#0c4a6e', fontSize: '16px' }}>
                  문단 {strategy.paragraphId} 전략
                </h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#0ea5e9', 
                    color: 'white', 
                    padding: '3px 8px', 
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    STAR: {strategy.starFocus || 'ALL'}
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#64748b', 
                    color: 'white', 
                    padding: '3px 8px', 
                    borderRadius: '12px'
                  }}>
                    {strategy.utilizationMethod || '활용방법'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                <p><strong>주요 에피소드:</strong> {strategy.primaryEpisode || '미정'}</p>
                <p><strong>활용 방법:</strong> {strategy.utilizationMethod || '전체활용'}</p>
                <p><strong>예상 내용:</strong> 
                  <span style={{ color: '#64748b', fontStyle: 'italic', marginLeft: '8px' }}>
                    {strategy.expectedContent || '구체적 경험과 성과 중심'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Topic 전략 섹션 (안전한 접근으로 개선) */}
      {plan?.topicStrategy && (
        <div className="section-card">
          <h3>
            <GlassIcon type="strategy" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            Topic-Enforced 전략
          </h3>
          <p><strong>핵심 메시지:</strong> {safeRender(plan.topicStrategy.coreMessage, '정보 없음')}</p>
          
          {plan.topicStrategy.supportingStrategy && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>지원 전략</h4>
              <p><strong>주요 증거:</strong> {safeRender(plan.topicStrategy.supportingStrategy.primaryEvidence, '정보 없음')}</p>
              <p><strong>차별화 포인트:</strong> {safeRender(plan.topicStrategy.supportingStrategy.differentiationPoint, '정보 없음')}</p>
              <p><strong>회사 연결점:</strong> {safeRender(plan.topicStrategy.supportingStrategy.connectionToCompany, '정보 없음')}</p>
            </div>
          )}
          
          {plan.topicStrategy.episodeUtilization && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>에피소드 활용 계획</h4>
              <p><strong>주 활용 에피소드:</strong> {safeRender(plan.topicStrategy.episodeUtilization.primaryEpisode, '정보 없음')}</p>
              <p><strong>보조 에피소드:</strong> {
                Array.isArray(plan.topicStrategy.episodeUtilization.supportingEpisodes) 
                  ? plan.topicStrategy.episodeUtilization.supportingEpisodes.join(', ') 
                  : '정보 없음'
              }</p>
              <p><strong>활용 방법:</strong> {safeRender(plan.topicStrategy.episodeUtilization.utilizationMethod, '정보 없음')}</p>
            </div>
          )}
        </div>
      )}

      {/* 개인 프로파일 분석 섹션 (안전한 접근으로 개선) */}
      {plan?.personalProfile && (
        <div className="section-card">
          <h3>
            <GlassIcon type="user" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            개인 캐릭터 프로파일
          </h3>
          
          {/* characterProfile 섹션 */}
          {plan.personalProfile.characterProfile && (
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>핵심 캐릭터성</h4>
              <p><strong>업무 성격:</strong> {safeRender(plan.personalProfile.characterProfile.workPersonality, '분석 중')}</p>
              <p><strong>행동 원칙:</strong> {safeRender(plan.personalProfile.characterProfile.actionPrinciples, '분석 중')}</p>
              <p><strong>가치관:</strong> {safeRender(plan.personalProfile.characterProfile.worldView, '분석 중')}</p>
              <p><strong>개인 브랜딩:</strong> {safeRender(plan.personalProfile.characterProfile.personalBranding, '분석 중')}</p>
            </div>
          )}
          
          {/* applicationStrategy 섹션 */}
          {plan.personalProfile.applicationStrategy && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>자소서 적용 전략</h4>
              <p><strong>서술 방식:</strong> {safeRender(plan.personalProfile.applicationStrategy.narrativeApproach, '표준 방식')}</p>
              <p><strong>어투 가이드:</strong> {safeRender(plan.personalProfile.applicationStrategy.toneGuidelines, '일반적 어조')}</p>
              <p><strong>차별화 포인트:</strong> {safeRender(plan.personalProfile.applicationStrategy.differentiationPoints, '개인적 특성')}</p>
            </div>
          )}
          
          {/* 🔥 NEW: 데이터 품질 평가 */}
          {plan.personalProfile.dataQualityAssessment && (
            <div style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid #e5e7eb',
              background: '#f8fafc',
              padding: '10px',
              borderRadius: '6px'
            }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>분석 품질 평가</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <span><strong>데이터 풍부함:</strong> 
                  <span style={{ 
                    marginLeft: '4px',
                    color: plan.personalProfile.dataQualityAssessment.resumeDataRichness === '상' ? '#059669' : 
                           plan.personalProfile.dataQualityAssessment.resumeDataRichness === '중' ? '#d97706' : '#dc2626'
                  }}>
                    {plan.personalProfile.dataQualityAssessment.resumeDataRichness || '중'}
                  </span>
                </span>
                <span><strong>분석 신뢰도:</strong> 
                  <span style={{ 
                    marginLeft: '4px',
                    color: plan.personalProfile.dataQualityAssessment.analysisConfidence === '상' ? '#059669' : 
                           plan.personalProfile.dataQualityAssessment.analysisConfidence === '중' ? '#d97706' : '#dc2626'
                  }}>
                    {plan.personalProfile.dataQualityAssessment.analysisConfidence || '중'}
                  </span>
                </span>
                <span><strong>데이터 소스:</strong> {safeRender(plan.personalProfile.dataQualityAssessment.dataSource, '구조화된 데이터')}</span>
              </div>
              {plan.personalProfile.dataQualityAssessment.dataLength && (
                <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                  분석 데이터 길이: {plan.personalProfile.dataQualityAssessment.dataLength}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 구조 정보 섹션 (Perplexity 강조 개선) */}
      {plan?.structure && (
        <div className="section-card">
          <h3>
            <GlassIcon type="document" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            최적화된 자소서 구조
            {plan.structure.source === 'perplexity' ? (
              <span style={{ 
                marginLeft: '12px', 
                fontSize: '12px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white',
                padding: '4px 8px', 
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                🔍 실시간 AI 검색
              </span>
            ) : plan.structure.source === 'master-instructions-v4.5' ? (
              <span style={{ 
                marginLeft: '12px', 
                fontSize: '12px', 
                background: '#f59e0b', 
                color: 'white',
                padding: '4px 8px', 
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                🎯 Master Instructions
              </span>
            ) : (
              <span style={{ 
                marginLeft: '12px', 
                fontSize: '12px', 
                background: '#f3f4f6', 
                color: '#374151',
                padding: '4px 8px', 
                borderRadius: '12px' 
              }}>
                📋 기본 템플릿
              </span>
            )}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <p><strong>문단 수:</strong> {plan.structure.optimalParagraphCount || 3}개</p>
            <p><strong>구조 출처:</strong> {
              plan.structure.source === 'perplexity' ? 'Perplexity AI' : 
              plan.structure.source === 'master-instructions-v4.5' ? 'Master Instructions (GPT-4.1)' :
              '내장 템플릿'
            }</p>
          </div>
          
          <p><strong>구조 전략:</strong> {plan.structure.flowStrategy || plan.structure.rationale || '표준 3단 구조'}</p>
          
          {/* 문단별 역할 (개선된 레이아웃) */}
          {plan.structure.paragraphRoles && Array.isArray(plan.structure.paragraphRoles) && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#374151' }}>문단별 역할 및 비중</h4>
              {plan.structure.paragraphRoles.map((role, idx) => (
                <div key={idx} style={{ 
                  marginBottom: '10px', 
                  padding: '12px', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#1e293b' }}>문단 {role.paragraphId}: {role.role}</strong>
                    <span style={{ 
                      fontSize: '12px', 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '10px' 
                    }}>
                      {role.approximateLength || 300}자
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                    <strong>초점:</strong> {role.focusArea || '내용 구성'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🔥 ENHANCED v4.5: 문단별 상세 계획 섹션 (Master Instructions 우선) */}
      {!isMasterInstructions && plan?.instructions && Array.isArray(plan.instructions) && plan.instructions.length > 0 && (
        <div className="section-card">
          <h3>
            <GlassIcon type="document" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            문단별 상세 실행 계획 v4.2
            <span style={{ 
              marginLeft: '12px', 
              fontSize: '12px', 
              background: hasEpisodeStrategy ? '#22c55e' : '#6b7280', 
              color: 'white',
              padding: '4px 8px', 
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              {hasEpisodeStrategy ? '🎯 에피소드 전략 포함' : '📋 기본 계획'}
            </span>
            {(hasQuantitativeData || hasCompanyConnection) && (
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '12px', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: 'white',
                padding: '4px 8px', 
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                {hasQuantitativeData && hasCompanyConnection ? '📊🏢 수치+회사연결' : 
                 hasQuantitativeData ? '📊 수치데이터' : '🏢 회사연결'}
              </span>
            )}
          </h3>
          {plan.instructions.map((inst) => (
            <div key={inst.paragraphId} style={{ 
              marginBottom: '20px', 
              padding: '20px', 
              backgroundColor: '#fafbfc', 
              borderRadius: '12px',
              border: '1px solid #e1e5e9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: '0', color: '#2d3748', fontSize: '18px' }}>
                  문단 {inst.paragraphId}: {inst.role}
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {inst.paragraphId === 1 && questionTopic && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}>
                      Topic 필수
                    </span>
                  )}
                  {inst.episodeUtilization && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#8b5cf6', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}>
                      에피소드 전략
                    </span>
                  )}
                  {/* 🔥 NEW v4.2: 수치 데이터 뱃지 */}
                  {inst.quantitativeDataUsage && inst.quantitativeDataUsage !== '수치 데이터 미포함' && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#22c55e', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}>
                      📊 수치포함
                    </span>
                  )}
                  {/* 🔥 NEW v4.2: 회사 연결성 뱃지 */}
                  {inst.companyConnectionStrategy && inst.companyConnectionStrategy !== '기본 회사 연결' && (
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#0891b2', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}>
                      🏢 회사연결
                    </span>
                  )}
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#6b7280', 
                    color: 'white', 
                    padding: '3px 8px', 
                    borderRadius: '8px' 
                  }}>
                    {inst.targetLength || 300}자
                  </span>
                </div>
              </div>
              
              {/* 기본 계획 정보 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '15px' }}>
                <p><strong>핵심 메시지:</strong> {inst.mainMessage || inst.focusArea || '내용 구성'}</p>
                <p><strong>초점 영역:</strong> {inst.focusArea || '해당 문단 역할'}</p>
                <p><strong>차별화 포인트:</strong> {inst.differentiationPoint || '개인적 특성 강조'}</p>
                <p><strong>연결 전략:</strong> {inst.connectionStrategy || '자연스러운 흐름'}</p>
                {inst.paragraphId === 1 && questionTopic && (
                  <p style={{ color: '#ef4444', fontWeight: 'bold' }}>
                    <strong>Topic 처리:</strong> "{questionTopic}" 반드시 포함
                  </p>
                )}
                
                {/* 🔥 NEW v4.2: 수치 데이터 활용 정보 */}
                {inst.quantitativeDataUsage && inst.quantitativeDataUsage !== '수치 데이터 미포함' && (
                  <p style={{ color: '#059669', fontWeight: 'bold' }}>
                    <strong>📊 수치 데이터 활용:</strong> {inst.quantitativeDataUsage}
                  </p>
                )}
                
                {/* 🔥 NEW v4.2: 회사 연결성 정보 */}
                {inst.companyConnectionStrategy && inst.companyConnectionStrategy !== '기본 회사 연결' && (
                  <p style={{ color: '#0891b2', fontWeight: 'bold' }}>
                    <strong>🏢 회사 연결 전략:</strong> {inst.companyConnectionStrategy}
                  </p>
                )}
              </div>
              
              {/* 🔥 NEW: 에피소드 활용 상세 정보 */}
              {inst.episodeUtilization && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <h5 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#0c4a6e', 
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    🎯 에피소드 활용 전략
                  </h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <p><strong>주요 에피소드:</strong> {inst.episodeUtilization.primaryEpisode || '미정'}</p>
                    <p><strong>활용 방법:</strong> {inst.episodeUtilization.utilizationMethod || '전체활용'}</p>
                    <p><strong>STAR 초점:</strong> 
                      <span style={{ 
                        marginLeft: '8px',
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {inst.episodeUtilization.starFocus || 'ALL'}
                      </span>
                    </p>
                    <p><strong>통합 스타일:</strong> {inst.episodeUtilization.integrationStyle || '자연스러운 통합'}</p>
                  </div>
                  
                  <p><strong>예상 내용:</strong> 
                    <span style={{ color: '#64748b', fontStyle: 'italic', marginLeft: '8px' }}>
                      {inst.episodeUtilization.expectedContent || '구체적 경험과 성과 중심'}
                    </span>
                  </p>
                  
                  {/* 🔥 NEW v4.2: 수치 데이터 통합 정보 */}
                  {inst.quantitativeDataIntegration && inst.quantitativeDataIntegration !== '수치 데이터 미포함' && (
                    <p style={{ marginTop: '8px' }}><strong>📊 수치 데이터 통합:</strong> 
                      <span style={{ color: '#059669', fontStyle: 'italic', marginLeft: '8px' }}>
                        {inst.quantitativeDataIntegration}
                      </span>
                    </p>
                  )}
                  
                  {/* 🔥 NEW v4.2: 회사 연결성 통합 정보 */}
                  {inst.companyConnectionIntegration && inst.companyConnectionIntegration !== '기본 회사 연결' && (
                    <p style={{ marginTop: '8px' }}><strong>🏢 회사 연결성 통합:</strong> 
                      <span style={{ color: '#0891b2', fontStyle: 'italic', marginLeft: '8px' }}>
                        {inst.companyConnectionIntegration}
                      </span>
                    </p>
                  )}
                  
                  {/* 🔥 NEW v4.2: 회피 지침 */}
                  {inst.avoidConnectionGuidelines && inst.avoidConnectionGuidelines.length > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '12px' }}>
                      <strong>⚠️ 연결 회피 지침:</strong>
                      <ul style={{ marginTop: '4px', paddingLeft: '20px', color: '#dc2626' }}>
                        {inst.avoidConnectionGuidelines.map((guideline, idx) => (
                          <li key={idx}>{guideline}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 🔥 NEW: 글자수 배분 정보 */}
                  {inst.episodeUtilization.lengthAllocation && (
                    <div style={{ marginTop: '10px', fontSize: '13px' }}>
                      <strong>글자수 배분:</strong>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span>에피소드: {inst.episodeUtilization.lengthAllocation.episodeContent || '60%'}</span>
                        <span>회사연결: {inst.episodeUtilization.lengthAllocation.companyConnection || '25%'}</span>
                        <span>개인성찰: {inst.episodeUtilization.lengthAllocation.personalInsight || '15%'}</span>
                        {/* 🔥 NEW v4.2: 수치 데이터 비중 */}
                        {inst.episodeUtilization.lengthAllocation.quantitativeData && inst.episodeUtilization.lengthAllocation.quantitativeData !== '0%' && (
                          <span style={{ color: '#059669', fontWeight: 'bold' }}>수치데이터: {inst.episodeUtilization.lengthAllocation.quantitativeData}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 🔥 NEW: 활용할 구체적 요소들 */}
                  {inst.episodeUtilization.specificElements && (
                    <div style={{ marginTop: '10px', fontSize: '12px' }}>
                      <strong>활용 요소:</strong>
                      <div style={{ marginTop: '4px', color: '#64748b' }}>
                        {inst.episodeUtilization.specificElements.situations?.length > 0 && (
                          <span>상황: {inst.episodeUtilization.specificElements.situations.slice(0, 2).join(', ')} </span>
                        )}
                        {inst.episodeUtilization.specificElements.actions?.length > 0 && (
                          <span>행동: {inst.episodeUtilization.specificElements.actions.slice(0, 2).join(', ')} </span>
                        )}
                        {inst.episodeUtilization.specificElements.results?.length > 0 && (
                          <span>결과: {inst.episodeUtilization.specificElements.results.slice(0, 2).join(', ')}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 🔥 NEW v4.2: 상세 지침 표시 */}
                  {inst.detailedEpisodeInstructions && inst.detailedEpisodeInstructions.dynamicInstructions && (
                    <details style={{ marginTop: '12px' }}>
                      <summary style={{ 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        color: '#0c4a6e',
                        fontSize: '13px'
                      }}>
                        📋 상세 작성 지침 보기 (v4.2)
                      </summary>
                      <pre style={{ 
                        marginTop: '8px',
                        background: '#f8fafc',
                        padding: '10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        color: '#374151',
                        whiteSpace: 'pre-wrap',
                        border: '1px solid #e2e8f0'
                      }}>
                        {inst.detailedEpisodeInstructions.dynamicInstructions}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 회사 정보 섹션 (🔧 객체 안전 렌더링으로 수정) */}
      <div className="section-card">
        <h3>
          <GlassIcon type="company" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
          타겟 회사 정보
        </h3>
        
        {/* 기본 정보 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          marginBottom: '15px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <p><strong>회사명:</strong> {state?.companyInfo?.company || '정보 없음'}</p>
          <p><strong>직무명:</strong> {state?.companyInfo?.jobTitle || '정보 없음'}</p>
          <p><strong>최대 글자수:</strong> {state?.companyInfo?.wordLimit || 1000}자</p>
          <p><strong>질문 유형:</strong> {questionTopic || '일반'}</p>
        </div>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>자소서 질문:</strong> 
          <span style={{ marginLeft: '8px', fontStyle: 'italic', color: '#4a5568' }}>
            {state?.companyInfo?.questions || '정보 없음'}
          </span>
        </p>
        
        {/* 🔧 회사 분석 정보 - 객체 안전 렌더링 */}
        {plan?.companyInfo && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#374151' }}>회사 분석 결과</h4>
            <p><strong>핵심 가치:</strong> {safeRender(plan.companyInfo.companyEssence, '분석 중')}</p>
            <p><strong>직무 요구사항:</strong> {safeRender(plan.companyInfo.jobRequirements, '분석 중')}</p>
            <p><strong>인재상:</strong> {safeRender(plan.companyInfo.talentProfile, '분석 중')}</p>
            <p><strong>업계 트렌드:</strong> {safeRender(plan.companyInfo.industryContext, '분석 중')}</p>
          </div>
        )}
      </div>

      {/* 🔥 ENHANCED: 에피소드 섹션 (활용 전략 정보 포함) */}
      <div className="section-card">
        <h3>
          <GlassIcon type="episodes" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
          활용 가능 에피소드 & 전략 v4.2
          <span style={{ 
            marginLeft: '12px', 
            fontSize: '12px', 
            color: '#6b7280' 
          }}>
            ({plan?.episodes?.length || plan?.sourceEpisodes?.length || 0}개)
          </span>
        </h3>
        
        {(plan?.episodes || plan?.sourceEpisodes) && (
          <>
            {/* 개별 에피소드 (v4.2 활용 전략 정보 포함) */}
            {(plan.episodes || plan.sourceEpisodes || []).map((ep, index) => {
              // 해당 에피소드가 어느 문단에서 활용되는지 찾기 (v4.2 업데이트)
              const utilizationInfo = plan?.dynamicEpisodeUtilizationSummary?.find(
                summary => summary.primaryEpisode === (ep.topic || ep.title)
              ) || plan?.episodeUtilizationSummary?.find(
                summary => summary.primaryEpisode === (ep.topic || ep.title)
              );
              
              return (
                <div key={index} style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  background: ep.source === 'cached' ? '#f0fdf4' : '#fefce8',
                  borderRadius: '10px',
                  border: `2px solid ${ep.source === 'cached' ? '#bbf7d0' : '#fde68a'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <strong style={{ color: '#1f2937', fontSize: '16px' }}>{ep.topic || ep.title || '제목 없음'}</strong>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {ep.source && (
                        <span style={{ 
                          fontSize: '11px', 
                          background: ep.source === 'cached' ? '#22c55e' : '#f59e0b',
                          color: 'white',
                          padding: '3px 8px', 
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}>
                          {ep.source === 'cached' ? '캐시됨' : '폴백'}
                        </span>
                      )}
                      {ep.enhanced && (
                        <span style={{ 
                          fontSize: '11px', 
                          background: '#8b5cf6',
                          color: 'white',
                          padding: '3px 8px', 
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}>
                          강화됨
                        </span>
                      )}
                      {utilizationInfo && (
                        <span style={{ 
                          fontSize: '11px', 
                          background: '#0ea5e9',
                          color: 'white',
                          padding: '3px 8px', 
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}>
                          문단 {utilizationInfo.paragraphId}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p style={{ 
                    margin: '0', 
                    color: '#4b5563', 
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {((ep.episode || ep.content || ep.fullContent || '내용 없음').length > 400 
                      ? `${(ep.episode || ep.content || ep.fullContent).substring(0, 400)}...` 
                      : (ep.episode || ep.content || ep.fullContent || '내용 없음')
                    )}
                  </p>
                  
                  <div style={{ 
                    marginTop: '10px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {ep.competency && (
                      <span><strong>핵심 역량:</strong> {ep.competency}</span>
                    )}
                    {ep.company && (
                      <span><strong>경험 회사:</strong> {ep.company}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
        
        {!plan?.episodes && !plan?.sourceEpisodes && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#6b7280',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            에피소드 정보가 없습니다. 에피소드를 먼저 생성해주세요.
          </div>
        )}
      </div>

      {/* 🔥 ENHANCED v4.5: 메타데이터 및 시스템 상태 */}
      {plan?.metadata && (
        <div className="section-card">
          <h3>
            <GlassIcon type="chart" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
            시스템 상태 및 생성 정보 {isMasterInstructions ? 'v4.5' : 'v4.2'}
          </h3>
          
          {/* 기본 성능 정보 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '12px', 
            marginBottom: '15px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '6px'
          }}>
            <p><strong>버전:</strong> {plan.version || plan.metadata.version || 'v4.2'}</p>
            <p><strong>처리 시간:</strong> {plan.metadata.processingTimeMs}ms</p>
            <p><strong>생성 일시:</strong> {
              plan.metadata.generatedAt 
                ? new Date(plan.metadata.generatedAt).toLocaleString('ko-KR')
                : '정보 없음'
            }</p>
          </div>
          
          {/* 🔥 NEW: 세션 정보 */}
          {sessionId && (
            <div style={{ 
              marginBottom: '15px',
              padding: '12px',
              background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
              borderRadius: '8px',
              border: '1px solid #d8b4fe'
            }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#7c3aed' }}>
                🧠 세션 메모리 시스템 {isMasterInstructions ? 'v4.5' : 'v4.2'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <span><strong>세션 ID:</strong> <code style={{ fontSize: '11px' }}>{sessionId}</code></span>
                <span><strong>상태:</strong> 
                  <span style={{ color: '#059669', fontWeight: 'bold', marginLeft: '4px' }}>활성화</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const renderPlanTable = (plan, showSummarizedExperiences = true) => {
  console.log(`[${new Date().toISOString()}] Rendering plan table for topics:`, state.questionTopics);
  console.log(`[${new Date().toISOString()}] Received plan:`, typeof plan, plan);
 
  if (typeof plan === 'object' && plan !== null) {
    // 🔥 v4.5: Master Instructions 우선 체크
    if (plan.paragraphInstructions || plan.version === '4.5-master-instructions') {
      console.log(`[${new Date().toISOString()}] Using Master Instructions structure v4.5`);
      return renderNewPlanStructure(plan);
    }
    // 기존 구조 체크
    if (plan.structure || plan.assemblyGuide || plan.analysis) {
      console.log(`[${new Date().toISOString()}] Using new plan structure`);
      return renderNewPlanStructure(plan);
    } else {
      console.log(`[${new Date().toISOString()}] Plan is object but missing expected properties`);
      return (
        <div className="error-section">
          <p>계획서 형식을 인식할 수 없습니다. 다시 생성해 주세요.</p>
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
        <h3><GlassIcon type="chart" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>회사 및 직무 분석</h3>
        {companyJobAnalysisSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="arrow" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>자소서 방향성</h3>
        {directionSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="company" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>회사 정보</h3>
        {companyInfoSection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="document" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>사용자 이력서</h3>
        {resumeSummarySection.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim() || '내용 없음'}</p>
        ))}
      </div>
      <div className="section-card">
        <h3><GlassIcon type="episodes" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>적용할 주제와 에피소드</h3>
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

// Smooth auto scroll on new chat messages - Focus Mode에서는 필요없음
useEffect(() => {
  // Focus Mode에서는 스크롤 불필요
}, [chatHistory]);

// Initialize localStorage on app start
useEffect(() => {
  localStorage.removeItem('resumeId');
  localStorage.removeItem('trends');
  dispatch({ type: 'SET_ANALYSIS', resumeId: '', analysisId: '' });
}, []);

// Load initial experiences when entering direction-selection
useEffect(() => {
  if (screen === 'direction-selection' && state.resumeId && state.analysisId && state.selectedExperiences.length === 0) {
    console.log(`[${new Date().toISOString()}] Loading initial experiences for resumeId=${state.resumeId}, analysisId=${state.analysisId}`);
    handleDirectionSuggestion(state.resumeId, state.analysisId);
  }
}, [screen, state.resumeId, state.analysisId, state.selectedExperiences.length, ]);


return (
  <div className="app-container">
    <div className="content-wrapper">
      {/* Progress Indicator */}
      {screen !== 'start' && (
        <div className="progress-indicator">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index === currentProcessStep ? 'active' : ''} ${index < currentProcessStep ? 'completed' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Error Modal */}
      {error && (
        <>
          <div className="modal-overlay" onClick={() => setError(null)} />
          <div className="modal error-modal">
            <p>{error}</p>
            <div className="modal-actions">
              <button className="button-secondary" onClick={() => setError(null)}>닫기</button>
              {error.includes('분석 실패') && <button className="button-primary" onClick={(e) => handleAnalysisSubmit(e)}>재시도</button>}
              {error.includes('사전 분석 실패') && <button className="button-primary" onClick={(e) => handlePreAnalysisSubmit(e)}>재시도</button>}
              {error.includes('계획서 생성 실패') && <button className="button-primary" onClick={handlePlanRequest}>재시도</button>}
              {error.includes('첨삭 실패') && <button className="button-primary" onClick={handleFinalizeCoverLetter}>재시도</button>}
            </div>
          </div>
        </>
      )}

      {screen === 'start' && (
        <div className={`start-screen ${animationComplete ? 'intro-done' : ''}`}
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
              {['D','E','E','P','G','L'].map((ch, i) => (
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
            <div className="loading-modal-overlay" style={{
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
            }}>
              <div className="loading-modal" style={{
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
              }}>
                <div className="loading-indicator" style={{
                  margin: '0 auto 24px auto',
                  width: '80px',
                  height: '80px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
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
                
                <p style={{
                  color: '#1D1D1F',
                  fontSize: '17px',
                  fontWeight: '500',
                  margin: 0
                }}>{currentMessage}</p>
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
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, company: e.target.value } })}
              disabled={state.loading}
            />
            <input
              className="input-field"
              placeholder="지원 직무 (예: 인사관리)"
              value={state.companyInfo.jobTitle}
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, jobTitle: e.target.value } })}
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="지원 직무에서 하게 될 업무"
              value={state.companyInfo.jobTasks}
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, jobTasks: e.target.value } })}
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="지원 직무에서 원하는 인재상 및 강점"
              value={state.companyInfo.jobRequirements}
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, jobRequirements: e.target.value } })}
              disabled={state.loading}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="자소서에서 묻는 질문 (예: 지원 동기 및 입사 후 포부)"
              value={state.companyInfo.questions}
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, questions: e.target.value } })}
              disabled={state.loading}
            />
            <input
              type="number"
              className="input-field"
              placeholder="최대 글자수 입력 (예: 1000, 기본 1000자)"
              value={state.companyInfo.wordLimit}
              onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, wordLimit: e.target.value } })}
              disabled={state.loading}
            />
            <form onSubmit={handlePreAnalysisSubmit} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
              <div className="loading-modal-overlay" style={{
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
              }}>
                <div className="loading-modal" style={{
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
                }}>
                  <div className="loading-indicator" style={{
                    margin: '0 auto 24px auto',
                    width: '80px',
                    height: '80px',
                    position: 'relative',
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
                      border: '1px solid rgba(107,114,128,0.3)',
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
                      border: '1px solid rgba(107,114,128,0.2)',
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
                      border: '1px solid rgba(107,114,128,0.15)',
                      animation: 'loadingPulse3 2.5s ease-out infinite',
                      animationDelay: '1.6s',
                      pointerEvents: 'none'
                    }} />
                  </div>
                  
                  <p style={{
                    color: '#1D1D1F',
                    fontSize: '17px',
                    fontWeight: '500',
                    margin: 0
                  }}>{currentMessage}</p>
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
          <p className="description-text">딥글이 회사 정보를 분석해서 자소서에 필요한 초기 역량을 골랐습니다. Perplexity 검색 결과를 기반으로 분석했습니다. 확인하고 이력서를 업로드하세요.</p>
          <div className="card-grid">
            {state.preCompetencies.slice(0, state.questionTopics.length).map((comp, index) => (
              <div key={index} className="card">
                <p className="card-title">{comp.keyword}</p>
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
                onChange={(e) => dispatch({ type: 'SET_PRE_ANALYSIS', companyInfo: { ...state.companyInfo, resumeFile: e.target.files[0] } })}
              />
            </label>
            <form onSubmit={handleAnalysisSubmit} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button
                type="submit"
                className="button-primary"
                disabled={state.loading || !state.companyInfo.resumeFile}
              >
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>이력서 제출하고 최종 분석하기</span>
              </button>
            </form>
            {state.loading && (
            <div className="loading-modal-overlay" style={{
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
            }}>
              <div className="loading-modal" style={{
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
              }}>
                <div className="loading-indicator" style={{
                  margin: '0 auto 24px auto',
                  width: '80px',
                  height: '80px',
                  position: 'relative',
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
                    border: '1px solid rgba(107,114,128,0.3)',
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
                    border: '1px solid rgba(107,114,128,0.2)',
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
                    border: '1px solid rgba(107,114,128,0.15)',
                    animation: 'loadingPulse3 2.5s ease-out infinite',
                    animationDelay: '1.6s',
                    pointerEvents: 'none'
                  }} />
                </div>
                
                <p style={{
                  color: '#1D1D1F',
                  fontSize: '17px',
                  fontWeight: '500',
                  margin: 0
                }}>{currentMessage}</p>
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
          <p className="description-text">딥글이 이력서와 회사 정보를 분석해서 자소서 주제에 맞는 최종 역량을 골랐습니다. 확인하고 다음 단계로 넘어가세요.</p>
          <div className="card-grid">
            {state.selectedForTopics.map((item, index) => (
              <div key={index} className="card selected">
                <p className="card-title">{item.topic}</p>
                <p>역량: {item.competency}</p>
                <p className="card-description">{item.reason}</p>
              </div>
            ))}
          </div>
          <button
            className="button-primary"
            onClick={goToDirectionSelection}
            disabled={state.loading}
          >
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
    <p className="description-text">아래에서 자소서에 넣을 경험을 선택하세요 ({state.questionTopics[currentExperienceStep - 1]}용)</p>
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
          .filter(exp => exp.topic === state.questionTopics[currentExperienceStep - 1])
          .map((exp, index) => (
            <div
              key={index}
              className={`card experience-card ${state.selectedExperiencesIndices[currentExperienceStep - 1] === exp.index ? 'selected' : ''}`}
              onClick={() => handleScenarioSelect(index)}
            >
              {/* 기본 정보 */}
              <p className="card-title">{exp.company}</p>
              <p className="card-description">{exp.description}</p>
           
              {/* 주제 및 역량 */}
              <div className="card-section">
                <h4>매칭 정보</h4>
                <p><strong>주제:</strong> {exp.topic}</p>
                <p><strong>목표 역량:</strong> {exp.competency}</p>
              </div>
           
              {/* 핵심: whySelected 분석 결과 - 새로운 필드 구조 */}
              <div className="card-section">
                <h4>딥글 분석 결과</h4>
                <p><strong>주제-경험:</strong> {exp.whySelected?.["주제-경험"] || '주제 연결성 분석 필요'}</p>
                <p><strong>역량-경험:</strong> {exp.whySelected?.["역량-경험"] || '역량 증명 분석 필요'}</p>
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
                  <p>{state.source.filter(s => s !== 'Enhanced Perplexity 검색').slice(0, 2).join(', ') || 'Perplexity 검색 기반'}</p>
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


      {/* Experience Extraction (Chat) - Focus Mode 수정 */}
      {screen === 'experience-extraction' && (
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
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}>
            <div className="topic-indicator">
              현재 주제: {state.questionTopics[currentExperienceStep - 1]} ({currentExperienceStep}/{state.questionTopics.length})
            </div>
          </div>
       
          {/* Focus Mode 대화 영역 - 수정된 부분 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '120px',  // 80px → 120px로 변경
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
              <div 
                className={state.chatLoading ? "typing-logo" : ""}
                style={{ 
                  position: 'relative'
                }}
              >
                <DeepGlLogo size={120} />
                {state.chatLoading && (
                  <>
                    {/* 첫 번째 파동 링 */}
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
                    {/* 두 번째 파동 링 */}
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
                    {/* 세 번째 파동 링 */}
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
                    <style jsx>{`
                      @keyframes pulseRing1 {
                        0% {
                          width: 120px;
                          height: 120px;
                          opacity: 0;
                        }
                        10% {
                          opacity: 0.8;
                        }
                        100% {
                          width: 240px;
                          height: 240px;
                          opacity: 0;
                        }
                      }
                      
                      @keyframes pulseRing2 {
                        0% {
                          width: 120px;
                          height: 120px;
                          opacity: 0;
                        }
                        10% {
                          opacity: 0.6;
                        }
                        100% {
                          width: 240px;
                          height: 240px;
                          opacity: 0;
                        }
                      }

                      @keyframes pulseRing3 {
                        0% {
                          width: 120px;
                          height: 120px;
                          opacity: 0;
                        }
                        10% {
                          opacity: 0.4;
                        }
                        100% {
                          width: 240px;
                          height: 240px;
                          opacity: 0;
                        }
                      }
                    `}</style>
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
             
                    {/* 질문 텍스트와 인라인 힌트 아이콘 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ flex: 1 }}>
                        {showHintInBubble && chatHistory[chatHistory.length - 1].hint ? 
                          chatHistory[chatHistory.length - 1].hint : 
                          chatHistory[chatHistory.length - 1].message}
                      </span>
                      
                      {/* 힌트 아이콘 - 텍스트 끝에 인라인 */}
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
                              ? 'linear-gradient(135deg, rgba(74, 85, 104, 0.15), rgba(74, 85, 104, 0.1))'
                              : 'linear-gradient(135deg, rgba(74, 85, 104, 0.08), rgba(74, 85, 104, 0.05))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            transition: 'all 0.2s ease',
                            marginTop: '2px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 85, 104, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle cx="12" cy="12" r="9" stroke="rgba(74, 85, 104, 0.6)" strokeWidth="2"/>
                            <path d="M12 17v-1m0-4v-4" stroke="rgba(74, 85, 104, 0.6)" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="18" r="0.5" fill="rgba(74, 85, 104, 0.6)"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <style jsx>{`
                    @keyframes slideInFromLeft {
                      0% {
                        transform: translateX(-100%);
                        opacity: 0;
                      }
                      100% {
                        transform: translateX(0);
                        opacity: 1;
                      }
                    }
                  `}</style>
                </div>
              )}
              
              {/* 답변 입력 영역 - 입력창 버그 수정 */}
              {chatHistory.length > 0 && (
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
                      background: state.chatLoading || !currentAnswer.trim()
                        ? '#E5E5EA'
                        : 'linear-gradient(135deg, rgba(74, 85, 104, 0.9), rgba(74, 85, 104, 0.8))',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: 'white',
                      cursor: (state.chatLoading || !currentAnswer.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
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
              )}
            </div>
            
            {/* Progress dots - 하단 중앙 */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px'
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === questionCount ? 'rgba(74, 85, 104, 0.8)' : 'rgba(74, 85, 104, 0.2)',
                    transform: i === questionCount ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
          {state.loading && <LoadingModal message={currentMessage} />}
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
                  <p className="card-title">{ep.topic}</p>
                  <div className="episode-content">
                    <p>{ep.episode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>완성된 에피소드가 없습니다. 채팅 기록이 부족하거나 주제가 맞지 않을 수 있습니다.</p>
            )}
          </div>
          <div className="action-buttons">
            {currentExperienceStep < state.questionTopics.length ? (
              <>
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
                <button
                  className="button-secondary"
                  onClick={() => goToExperienceExtraction()}
                  disabled={state.loading}
                >
                  뒤로 가기
                </button>
              </>
            ) : (
              <>
                <button
                  className="button-primary"
                  onClick={handlePlanRequest}
                  disabled={state.loading}
                >
                  <GlassIcon type="document" size={20} style={{ marginRight: '8px' }} />
                  <span>계획표 만들러 가기</span>
                </button>
                <button
                  className="button-secondary"
                  onClick={() => goToExperienceExtraction()}
                  disabled={state.loading}
                >
                  뒤로 가기
                </button>
              </>
            )}
          </div>
          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}

      {/* Plan View */}
      {screen === 'plan-view' && (
        <div className="screen-container">
          <h2>자소서 계획서</h2>
          <p className="description-text">지금까지 경험 {state.questionTopics.length}개를 구체화했습니다. 아래 계획서를 확인하고 자소서를 생성해보세요.</p>
          {state.plan ? (
            <>
              <div className="plan-container">{renderPlanTable(state.plan, true)}</div>
              {state.source && state.source.length > 0 && (
                <div className="source-links">
                  {state.source.map((url, index) => (
                    <a key={index} href={url.startsWith('http') ? url : '#'} target="_blank" rel="noopener noreferrer" className="source-link">
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
                <button className="button-tertiary" onClick={goToSummarizedEpisodeReview} disabled={state.loading}>
                  뒤로 가기
                </button>
              </div>
            </>
          ) : (
            <p>계획서가 없습니다. 다시 요청해 주세요.</p>
          )}
          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}

      {/* Cover Letter View - ✅ 수정됨 */}
      {screen === 'cover-letter-view' && (
        <div className="screen-container">
          <h2>{isProofreadingComplete ? '첨삭된 자소서' : '생성된 자소서'}</h2>
          <p className="description-text">
            {isProofreadingComplete 
              ? '첨삭이 완료되었습니다. 문단을 클릭해서 직접 수정해보세요.' 
              : '딥글이 자소서를 완성했습니다. 문단을 클릭하여 수정하거나 첨삭을 진행해 주세요.'}
          </p>
          <div className="cover-letter-container">
            {state.coverLetterParagraphs.length > 0 ? (
              state.coverLetterParagraphs.map((paragraph, index) => (
                <section
                  key={paragraph.id}
                  className="card paragraph-card"
                  onClick={() => {
                    setCurrentParagraphId(paragraph.id);
                    setEditedParagraphText(paragraph.text);
                    setScreen('paragraph-edit');
                  }}
                >
                  <h3 className="paragraph-title">문단 {index + 1}</h3>
                  {paragraph.text.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                    <p key={lineIndex} className="paragraph-text">
                      {line}
                    </p>
                  ))}
                  {/* ✅ 첨삭 완료 시 글자수 변화 표시 */}
                  {isProofreadingComplete && paragraph.originalCharCount && paragraph.editedCharCount && (
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#86868B', 
                      marginTop: '8px',
                      textAlign: 'right'
                    }}>
                      {paragraph.originalCharCount}자 → {paragraph.editedCharCount}자
                    </p>
                  )}
                </section>
              ))
            ) : (
              <p className="empty-state">자소서 문단이 없습니다. 다시 생성해 주세요.</p>
            )}
          </div>
          <div className="action-buttons">
            {/* ✅ 첨삭 전에만 첨삭 버튼 표시 */}
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
            {/* ✅ 첨삭 후에만 완성버전 보기 버튼 표시 */}
            {isProofreadingComplete && (
              <button
                className="button-primary"
                onClick={handleCompleteCoverLetter}
                disabled={state.loading}
              >
                <GlassIcon type="check" size={20} style={{ marginRight: '8px' }} />
                <span>자소서 완성버전 보러가기</span>
              </button>
            )}
            <button
              className="button-secondary"
              onClick={goToPlanView}
              disabled={state.loading}
            >
              뒤로 가기
            </button>
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
                  const currentParagraph = state.coverLetterParagraphs.find(p => p.id === currentParagraphId);
                  if (!currentParagraph) {
                    return <p>문단을 찾을 수 없습니다.</p>;
                  }
                  const lines = currentParagraph.text.split('\n').filter(line => line.trim());
                  if (lines.length === 0) {
                    return <p>문단 내용이 없습니다.</p>;
                  }
                  const suggestionsForParagraph = state.aiProofreadingSuggestions.length > 0
                    ? state.aiProofreadingSuggestions.find(s => s.paragraphId === currentParagraphId)?.suggestions || []
                    : state.aiScreeningSuggestions.find(s => s.paragraphId === currentParagraphId)?.suggestions || [];
               
                  if (suggestionsForParagraph.length === 0) {
                    return lines.map((line, index) => <p key={index} className="text-line">수정 제안이 없습니다: {line}</p>);
                  }
                  return lines.map((line, index) => {
                    const matchingSuggestions = suggestionsForParagraph.filter(s =>
                      s.sentence.trim().replace(/\.+$/, '').toLowerCase() === line.trim().replace(/\.+$/, '').toLowerCase()
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
            <button
              className="button-secondary"
              onClick={() => setScreen('cover-letter-view')}
              disabled={state.loading}
            >
              뒤로 가기
            </button>
          </div>
          {showAiSuggestionPopup && (
            <>
              <div className="modal-overlay" onClick={() => setShowAiSuggestionPopup(null)} />
              <div className="modal suggestion-modal">
                <div className="modal-header">
                  <span>{state.aiProofreadingSuggestions.length > 0 ? '첨삭 제안' : 'AI 문체 수정 제안'}</span>
                  <button className="modal-close" onClick={() => setShowAiSuggestionPopup(null)}>×</button>
                </div>
                <div className="modal-content">
                  {(() => {
                    const suggestions = state.aiProofreadingSuggestions.length > 0
                      ? state.aiProofreadingSuggestions
                      : state.aiScreeningSuggestions;
                    const suggestion = suggestions
                      .find(s => s.paragraphId === showAiSuggestionPopup.paragraphId)?.suggestions
                      .find(s => s.sentence.trim().replace(/\.+$/, '').toLowerCase() === showAiSuggestionPopup.sentence.trim().replace(/\.+$/, '').toLowerCase());
                 
                    return suggestion ? (
                      state.aiProofreadingSuggestions.length > 0 ? (
                        <>
                          <p><strong>문장:</strong> {suggestion.sentence}</p>
                          <p><strong>카테고리:</strong> {suggestion.category}</p>
                          <p><strong>문제:</strong> {suggestion.issue}</p>
                          <p><strong>제안:</strong> {suggestion.suggestion}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>문장:</strong> {suggestion.sentence}</p>
                          <p><strong>문제점:</strong> {suggestion.reason}</p>
                          <p><strong>수정 제안:</strong> {suggestion.proposal}</p>
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
      {screen === 'cover-letter-completion' && (
        <div className="screen-container">
          <h2>최종 자소서</h2>
          <p className="description-text">딥글이 완성한 최종 자소서를 확인해 주세요.</p>
          <div className="final-letter-container">
            {state.coverLetterText ? (
              <div className="final-letter-content">
                {state.coverLetterText.split('\n').map((line, index) => (
                  <p key={index} className="paragraph-text">{line}</p>
                ))}
              </div>
            ) : (
              <p className="empty-state">자소서가 없습니다. 다시 생성해 주세요.</p>
            )}
          </div>
          <div className="action-buttons">
            <button
              className="button-secondary"
              onClick={() => setScreen('cover-letter-view')}
              disabled={state.loading}
            >
              뒤로 가기
            </button>
          </div>
          {state.loading && <LoadingModal message={currentMessage} />}
        </div>
      )}
    </div>
    
    {/* CSS 애니메이션 */}
    <style jsx>{`
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
        0%, 100% {
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
        0%, 100% {
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
     
      /* 기존 애니메이션 유지 */
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
     
      /* 버튼 호버 효과 강화 */
      .button-primary:hover,
      .button-secondary:hover {
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
      }
     
      /* 카드 호버 효과 */
      .card:hover {
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
      }
    `}</style>
  </div>
);
}

export default App;
// End of Section 3//