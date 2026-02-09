import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PRIVACY_POLICY = `[개인정보 수집·이용 동의]

1. 수집하는 개인정보 항목
- 이메일 주소, 비밀번호(암호화 저장)
- 이력서에 포함된 경력, 학력, 경험 정보
- 자기소개서 작성 과정에서 입력한 정보
- 결제 시 PG사를 통해 처리되는 결제 정보(카드번호 일부, 결제 승인번호 등)

2. 수집·이용 목적
- 회원 식별 및 서비스 제공
- AI 기반 자기소개서 작성 지원
- 크레딧 충전 및 결제 처리
- 사용자 경험 분석 및 맞춤형 서비스 제공

3. 개인정보의 제3자 제공
- 결제 처리를 위해 PG사(포트원, 토스페이먼츠 등)에 결제 정보가 전달됩니다.
- 제공 항목: 결제 수단 정보(카드번호 일부, 결제 승인번호)
- 제공 목적: 결제 처리 및 환불 처리
- PG사의 개인정보 보유 기간은 해당 PG사의 정책을 따릅니다.

4. 개인정보 처리 위탁
- 결제 처리: 포트원(PortOne) / 토스페이먼츠
- 클라우드 서비스: Supabase 등

5. 보유 및 이용 기간
- 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)
- 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지 보존
  · 계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)
  · 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)
  · 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)

6. 개인정보의 파기 절차
- 회원 탈퇴 요청 시 개인정보는 즉시 파기합니다.
- 법령에 따라 보존이 필요한 정보는 별도 분리하여 해당 기간 동안 보관 후 파기합니다.

7. 동의 거부 권리
- 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
- 다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한됩니다.

8. 개인정보 보호책임자
- 성명: 유병훈
- 이메일: hyochanggongwon@naver.com`;

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
- 서비스는 운영상 필요한 경우 사전 공지 후 서비스를 변경하거나 중단할 수 있습니다.

제7조 (크레딧 및 결제)
1. 서비스는 크레딧(포인트) 충전 방식으로 유료 기능을 제공합니다.
2. 크레딧의 단가, 차감 기준은 서비스 내 안내 페이지에 게시합니다.
3. 결제는 PG사(결제대행사)를 통해 처리되며, 서비스는 사용자의 카드 정보를 직접 저장하지 않습니다.
4. 충전된 크레딧은 마지막 충전일로부터 5년간 유효하며, 유효기간 만료 30일 전 이메일로 안내합니다.

제8조 (환불 정책)
1. 미사용 크레딧은 결제일로부터 7일 이내 전액 환불이 가능합니다.
2. 일부 사용한 경우, 미사용 크레딧에서 결제수수료(10%)를 차감한 금액을 환불합니다.
3. 무상 지급된 크레딧(이벤트, 보상 등)은 환불 대상에서 제외됩니다.
4. 환불은 원래 결제 수단으로 처리되며, 3~7영업일이 소요될 수 있습니다.

제9조 (청약철회의 제한)
1. 전자상거래법 제17조에 따라 다음의 경우 청약철회가 제한됩니다:
   - 크레딧을 사용하여 AI 분석, 자소서 생성 등이 이루어진 경우
   - 사용자의 요청에 따라 개별적으로 생성된 디지털 콘텐츠인 경우
2. 청약철회 제한 사유는 결제 전 고지하며, 사용자의 동의를 받습니다.

제10조 (서비스 이용 제한 및 계약 해지)
1. 다음의 경우 이용이 제한되거나 계약이 해지될 수 있습니다:
   - 타인의 정보를 도용한 경우
   - 서비스의 정상적 운영을 방해한 경우
   - 크레딧을 부정한 방법으로 취득하거나 타인에게 양도한 경우
2. 계약 해지 시 잔여 유상 크레딧은 환불 정책에 따라 처리합니다.

제11조 (면책)
1. 천재지변, 서버 장애 등 불가항력으로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
2. 사용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임지지 않습니다.
3. AI 생성 콘텐츠의 신뢰성, 정확성을 보증하지 않으며, 이로 인한 손해에 대해 책임지지 않습니다.

제12조 (분쟁 해결)
1. 서비스 이용 관련 분쟁은 대한민국 법령을 적용합니다.
2. 분쟁 발생 시 서울중앙지방법원을 관할 법원으로 합니다.

제13조 (약관의 변경)
1. 약관 변경 시 적용일 7일 전까지 서비스 내 공지합니다.
2. 사용자에게 불리한 변경의 경우 30일 전까지 공지합니다.`;

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