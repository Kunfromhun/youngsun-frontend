import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PRIVACY_POLICY = `[개인정보 수집·이용 동의]

1. 수집하는 개인정보 항목
- 이메일 주소, 비밀번호(암호화 저장)
- 이력서에 포함된 경력, 학력, 경험 정보
- 자기소개서 작성 과정에서 입력한 정보

2. 수집·이용 목적
- 회원 식별 및 서비스 제공
- AI 기반 자기소개서 작성 지원
- 사용자 경험 분석 및 맞춤형 서비스 제공

3. 보유 및 이용 기간
- 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)
- 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지 보존

4. 동의 거부 권리
- 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
- 다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한됩니다.`;

const TERMS_OF_SERVICE = `[서비스 이용약관]

제1조 (목적)
본 약관은 DeepGL(이하 "서비스")이 제공하는 AI 기반 자기소개서 작성 서비스의 이용 조건 및 절차를 규정합니다.

제2조 (서비스 내용)
- 채용공고 분석 및 사용자 경험 매칭
- AI 기반 자기소개서 문답, 에피소드 생성, 계획서 작성, 자소서 생성 및 첨삭
- 경험 데이터베이스 관리

제3조 (AI 생성물에 대한 책임)
- 서비스가 생성한 자기소개서 및 콘텐츠는 참고 자료이며, 최종 내용에 대한 책임은 사용자에게 있습니다.
- 생성된 콘텐츠의 정확성, 적합성을 서비스가 보증하지 않습니다.

제4조 (이용 제한)
- 일반회원은 24시간 내 프로젝트 1개 생성으로 제한됩니다.
- 서비스를 부정한 목적으로 이용하는 경우 이용이 제한될 수 있습니다.

제5조 (지적재산권)
- 사용자가 입력한 정보의 지적재산권은 사용자에게 귀속됩니다.
- AI가 생성한 콘텐츠의 지적재산권은 사용자에게 귀속됩니다.

제6조 (서비스 변경 및 중단)
- 서비스는 운영상 필요한 경우 사전 공지 후 서비스를 변경하거나 중단할 수 있습니다.`;

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreePrivacy || !agreeTerms) {
      setError('필수 약관에 모두 동의해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-logo">
            <h1 className="logo-text" style={{ color: 'var(--success-color)' }}>가입 완료!</h1>
            <p className="logo-subtitle">이메일 인증 링크를 확인해주세요.</p>
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <h1 className="logo-text">회원가입</h1>
          <p className="logo-subtitle">DeepGL과 함께 시작하세요</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

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
              placeholder="6자 이상 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="agreePrivacy"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1D1D1F' }}
              />
              <label htmlFor="agreePrivacy" style={{ fontSize: '14px', color: '#1D1D1F', cursor: 'pointer' }}>
                <span style={{ color: '#E34850', marginRight: '4px' }}>[필수]</span>
                개인정보 수집·이용에 동의합니다.
              </label>
              <button
                type="button"
                onClick={() => setShowPrivacy(!showPrivacy)}
                style={{
                  background: 'none', border: 'none', color: '#6E6E73',
                  fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto'
                }}
              >
                {showPrivacy ? '접기' : '보기'}
              </button>
            </div>
            {showPrivacy && (
              <div style={{
                background: '#F5F5F7', borderRadius: '8px', padding: '16px',
                fontSize: '12px', color: '#6E6E73', lineHeight: 1.7,
                maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap'
              }}>
                {PRIVACY_POLICY}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1D1D1F' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '14px', color: '#1D1D1F', cursor: 'pointer' }}>
                <span style={{ color: '#E34850', marginRight: '4px' }}>[필수]</span>
                서비스 이용약관에 동의합니다.
              </label>
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                style={{
                  background: 'none', border: 'none', color: '#6E6E73',
                  fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto'
                }}
              >
                {showTerms ? '접기' : '보기'}
              </button>
            </div>
            {showTerms && (
              <div style={{
                background: '#F5F5F7', borderRadius: '8px', padding: '16px',
                fontSize: '12px', color: '#6E6E73', lineHeight: 1.7,
                maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap'
              }}>
                {TERMS_OF_SERVICE}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="button-primary login-button"
            disabled={loading || !agreePrivacy || !agreeTerms}
            style={{ marginTop: '24px', opacity: (!agreePrivacy || !agreeTerms) ? 0.4 : 1 }}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-links">
          <span style={{ color: 'var(--text-secondary)' }}>이미 계정이 있으신가요?</span>
          <Link to="/login" className="login-link" style={{ marginLeft: '8px' }}>로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;