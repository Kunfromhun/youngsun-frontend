import React, { useState } from 'react';
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
          <h1 className="logo-text">DEEPGL</h1>
          <p className="logo-subtitle">AI 자기소개서 도우미</p>
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
const IntroAnimation = ({ onComplete }) => {
  const [animationStarted, setAnimationStarted] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="intro-animation-page">
      <style>{`
        .intro-animation-page {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FBFBFD;
          position: relative;
          overflow: hidden;
        }
        
        @keyframes rollFromLeft {
          0% { transform: translateX(-400px) rotate(-720deg); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        
        @keyframes rollFromRight {
          0% { transform: translateX(400px) rotate(720deg); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        @keyframes letterFadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .circle-element {
          position: absolute;
          opacity: 0;
          ${animationStarted ? 'animation: rollFromLeft 2s ease-out 0.5s forwards, fadeOut 0.3s ease 2.5s forwards;' : ''}
        }
        
        .cross-element {
          position: absolute;
          opacity: 0;
          ${animationStarted ? 'animation: rollFromRight 2s ease-out 0.5s forwards, fadeOut 0.3s ease 2.5s forwards;' : ''}
        }
        
        .final-logo {
          opacity: 0;
          cursor: pointer;
          transition: transform 0.2s ease;
          ${animationStarted ? 'animation: fadeIn 0.5s ease 2.8s forwards;' : ''}
        }
        
        .final-logo:hover {
          transform: scale(1.05);
        }
        
        .deepgl-text {
          position: absolute;
          bottom: 120px;
          display: flex;
          gap: 12px;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }
        
        .deepgl-letter {
          opacity: 0;
          background: linear-gradient(135deg, #4A5568, #2D3748);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .deepgl-letter:nth-child(1) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.0s forwards;' : ''} }
        .deepgl-letter:nth-child(2) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.1s forwards;' : ''} }
        .deepgl-letter:nth-child(3) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.2s forwards;' : ''} }
        .deepgl-letter:nth-child(4) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.3s forwards;' : ''} }
        .deepgl-letter:nth-child(5) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.4s forwards;' : ''} }
        .deepgl-letter:nth-child(6) { ${animationStarted ? 'animation: letterFadeIn 0.4s ease 3.5s forwards;' : ''} }
        
        .start-hint {
          position: absolute;
          bottom: 60px;
          opacity: 0;
          color: #86868B;
          font-size: 14px;
          ${animationStarted ? 'animation: fadeIn 0.5s ease 3.8s forwards;' : ''}
        }
      `}</style>

      {/* 왼쪽에서 굴러오는 원 */}
      <svg className="circle-element" width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="rgba(156, 163, 175, 0.3)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
      </svg>

      {/* 오른쪽에서 굴러오는 십자가 */}
      <svg className="cross-element" width="200" height="200" viewBox="0 0 200 200">
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </svg>

      {/* 최종 로고 (클릭 가능) */}
      <div className="final-logo" onClick={onComplete}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
          <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
          <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        </svg>
      </div>

      {/* DEEPGL 텍스트 */}
      <div className="deepgl-text">
        {['D','E','E','P','G','L'].map((letter, i) => (
          <span key={i} className="deepgl-letter">{letter}</span>
        ))}
      </div>

      {/* 클릭 힌트 */}
      <p className="start-hint">로고를 클릭하여 시작하세요</p>
    </div>
  );
};

export default LoginPage;