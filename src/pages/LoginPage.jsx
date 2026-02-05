import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showIntro, setShowIntro] = useState(false);

  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // 로그인 성공 시 인트로 애니메이션 표시
        setShowIntro(true);
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');

    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setResetMessage('비밀번호 재설정 이메일을 발송했습니다.');
        setTimeout(() => {
          setShowResetModal(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      } else {
        setResetMessage(result.error || '이메일 발송에 실패했습니다.');
      }
    } catch (err) {
      setResetMessage('오류가 발생했습니다.');
    }
  };

  // 인트로 애니메이션 표시
  if (showIntro) {
    return <IntroAnimation onComplete={onLoginSuccess} />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 로고 */}
        <div className="login-logo">
          <div className="logo-icon">
            <svg width="80" height="80" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#loginLogoGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
              <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
              <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
            </svg>
          </div>
          <h1 className="logo-text">DeepGL</h1>
          <p className="logo-subtitle">Cover Letter, Democratized</p>
        </div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="button-primary login-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="login-links">
          <Link to="/signup" className="login-link">회원가입</Link>
          <span className="login-divider">|</span>
          <button
            type="button"
            className="login-link-button"
            onClick={() => setShowResetModal(true)}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
      {showResetModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowResetModal(false)} />
          <div className="modal reset-modal">
            <div className="modal-header">
              <span>비밀번호 재설정</span>
              <button
                className="modal-close"
                onClick={() => setShowResetModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>
              <form onSubmit={handleResetPassword}>
                <input
                  type="email"
                  className="input-field"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                />
                {resetMessage && (
                  <p style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    color: resetMessage.includes('실패') || resetMessage.includes('오류')
                      ? 'var(--error-color)'
                      : 'var(--success-color)'
                  }}>
                    {resetMessage}
                  </p>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setShowResetModal(false)}
                  >
                    취소
                  </button>
                  <button type="submit" className="button-primary">
                    이메일 발송
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 인트로 애니메이션 컴포넌트
const BrainCrossLogo = ({ size = 200, showCross = true }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#loginLogoGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
    {showCross && (
      <>
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </>
    )}
  </svg>
);

const IntroAnimation = ({ onComplete }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

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
    if (animationComplete && onComplete) {
      onComplete();
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
        .login-circle-element { opacity: 0; }
        .login-circle-element.active {
          animation: rollFromLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;
        }
        .login-cross-element { opacity: 0; }
        .login-cross-element.active {
          animation: rollFromRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards, hideElement 0.2s ease 2.5s forwards;
        }
        .login-cross-combined { opacity: 0; }
        .login-cross-combined.active {
          animation: fadeIn 0.2s ease 2.5s forwards, fastSpin 3s cubic-bezier(0.25, 0.8, 0.8, 1) 3s forwards, hideElement 0.3s ease 6s forwards;
        }
        .login-final-logo { opacity: 0; cursor: pointer; }
        .login-final-logo.active {
          animation: fadeIn 0.5s ease 6s forwards, glow 2s ease-in-out 6.5s infinite;
        }
        .login-deepgl-letter {
          opacity: 0;
          display: inline-block;
          background: linear-gradient(135deg, #4A5568, #2D3748);
          background-clip: text;
          -webkit-background-clip: text;
          color: #4A5568;
          -webkit-text-fill-color: transparent;
          z-index: 10;
        }
        .login-deepgl-letter-1.active { animation: letterFadeIn 0.4s ease 5.2s forwards; }
        .login-deepgl-letter-2.active { animation: letterFadeIn 0.4s ease 5.4s forwards; }
        .login-deepgl-letter-3.active { animation: letterFadeIn 0.4s ease 5.6s forwards; }
        .login-deepgl-letter-4.active { animation: letterFadeIn 0.4s ease 5.8s forwards; }
        .login-deepgl-letter-5.active { animation: letterFadeIn 0.4s ease 6.0s forwards; }
        .login-deepgl-letter-6.active { animation: letterFadeIn 0.4s ease 6.2s forwards; }
        .login-start-hint { opacity: 0; }
        .login-start-hint.active {
          animation: slideUp 0.6s ease 6.5s forwards;
        }
        @keyframes loginSoftPulse {
          0% { transform: translate3d(-50%, -50%, 0) scale(0.88); opacity: 0; }
          8% { opacity: .25; }
          22% { transform: translate3d(-50%, -50%, 0) scale(0.98); opacity: .38; }
          38% { transform: translate3d(-50%, -50%, 0) scale(1.06); opacity: .22; }
          58% { transform: translate3d(-50%, -50%, 0) scale(1.14); opacity: .12; }
          78% { transform: translate3d(-50%, -50%, 0) scale(1.22); opacity: .06; }
          100% { transform: translate3d(-50%, -50%, 0) scale(1.28); opacity: 0; }
        }
        .login-final-logo::before {
          content: "";
          position: absolute;
          left: 50%; top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.88);
          width: 220px; height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(0,0,0,0) 58%, rgba(107,114,128,0.28) 60%, rgba(107,114,128,0.18) 70%, rgba(0,0,0,0) 75%);
          opacity: 0;
          animation: loginSoftPulse 3.6s ease-out infinite;
        }
        .login-final-logo::after {
          content: "";
          position: absolute;
          left: 50%; top: 50%;
          transform: translate3d(-50%, -50%, 0) scale(0.92);
          width: 220px; height: 220px;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(0,0,0,0) 62%, rgba(107,114,128,0.22) 64%, rgba(107,114,128,0.12) 74%, rgba(0,0,0,0) 79%);
          opacity: 0;
          animation: loginSoftPulse 3.6s ease-out infinite;
          animation-delay: 1.8s;
        }
        .login-final-logo:hover {
          transform: translate(-50%, -50%) scale(1.04) !important;
        }
      `}</style>

      <svg
        className={`login-circle-element${animationStarted ? ' active' : ''}`}
        width="200" height="200" viewBox="0 0 200 200"
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <circle cx="100" cy="100" r="80" fill="rgba(156, 163, 175, 0.3)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
      </svg>

      <svg
        className={`login-cross-element${animationStarted ? ' active' : ''}`}
        width="200" height="200" viewBox="0 0 200 200"
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </svg>

      <div
        className={`login-cross-combined${animationStarted ? ' active' : ''}`}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px' }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transformOrigin: 'center center' }}>
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
          <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.9)" rx="8"/>
          <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.9)" rx="8"/>
        </svg>
      </div>

      <div
        className={`login-final-logo${animationStarted ? ' active' : ''}`}
        onClick={handleLogoClick}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
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
            className={`login-deepgl-letter login-deepgl-letter-${i + 1}${animationStarted ? ' active' : ''}`}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className={`login-start-hint${animationStarted ? ' active' : ''}`} style={{
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

export default LoginPage;