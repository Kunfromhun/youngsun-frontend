import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrainCrossLogo = ({ size = 200, showCross = true }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
    {showCross && (
      <>
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </>
    )}
  </svg>
);

const IntroPage = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setAnimationStarted(true);
    }, 50);
    
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 6000);

    const safetyTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 8000);
    
    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleLogoClick = () => {
    if (animationComplete) {
      navigate('/dashboard');
    }
  };

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
      
      <style>{`
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

        .circle-element { opacity: 0; }
        .circle-element.active {
          animation: rollFromLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;
        }

        .cross-element { opacity: 0; }
        .cross-element.active {
          animation: rollFromRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;
        }

        .cross-combined { opacity: 0; }
        .cross-combined.active {
          animation: fadeIn 0.2s ease 2.5s forwards, fastSpin 3s cubic-bezier(0.25, 0.8, 0.8, 1) 3s forwards, hideElement 0.3s ease 6s forwards;
        }

        .final-logo { opacity: 0; cursor: pointer; }
        .final-logo.active {
          animation: fadeIn 0.5s ease 6s forwards, glow 2s ease-in-out 6.5s infinite;
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
        .deepgl-letter-1.active { animation: letterFadeIn 0.4s ease 5.2s forwards; }
        .deepgl-letter-2.active { animation: letterFadeIn 0.4s ease 5.4s forwards; }
        .deepgl-letter-3.active { animation: letterFadeIn 0.4s ease 5.6s forwards; }
        .deepgl-letter-4.active { animation: letterFadeIn 0.4s ease 5.8s forwards; }
        .deepgl-letter-5.active { animation: letterFadeIn 0.4s ease 6.0s forwards; }
        .deepgl-letter-6.active { animation: letterFadeIn 0.4s ease 6.2s forwards; }

        .start-hint { opacity: 0; }
        .start-hint.active {
          animation: slideUp 0.6s ease 6.5s forwards;
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

        .final-logo::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.88);
          width: 220px;
          height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(0,0,0,0) 58%, rgba(107,114,128,0.28) 60%, rgba(107,114,128,0.18) 70%, rgba(0,0,0,0) 75%);
          opacity: 0;
          animation: softPulse 3.6s ease-out infinite;
        }

        .final-logo::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.92);
          width: 220px;
          height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(0,0,0,0) 62%, rgba(107,114,128,0.22) 64%, rgba(107,114,128,0.12) 74%, rgba(0,0,0,0) 79%);
          opacity: 0;
          animation: softPulse 3.6s ease-out infinite;
          animation-delay: 1.8s;
        }

        .final-logo:hover {
          transform: translate(-50%, -50%) scale(1.04) !important;
        }
      `}</style>
      
      <svg
        className={`circle-element${animationStarted ? ' active' : ''}`}
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
      
      <svg
        className={`cross-element${animationStarted ? ' active' : ''}`}
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
      
      <div
        className={`cross-combined${animationStarted ? ' active' : ''}`}
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
      
      <div
        className={`final-logo${animationStarted ? ' active' : ''}`}
        onClick={handleLogoClick}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <BrainCrossLogo size={200} showCross={true} />
      </div>
      
      <div
        translate="no"
        style={{
          position: 'absolute',
          top: 'calc(50% + 140px)',
          left: '50%',
          transform: 'translateX(-50%)',
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
            className={`deepgl-letter deepgl-letter-${i + 1}${animationStarted ? ' active' : ''}`}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className={`start-hint${animationStarted ? ' active' : ''}`} style={{
        position: 'absolute',
        bottom: '80px',
        color: '#86868B',
        fontSize: '14px'
      }}>
        로고를 클릭하여 시작하세요
      </p>
    </div>
  );
};

export default IntroPage;
