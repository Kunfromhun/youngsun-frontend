import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#888', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        돌아가기
      </button>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1d1d1f', marginBottom: '8px' }}>서비스 이용약관</h1>
      <p style={{ fontSize: '13px', color: '#999', marginBottom: '48px' }}>시행일: 2025년 2월 1일</p>

      <Section title="① 서비스 내용">
        <Li>AI 기반 자기소개서 작성 지원 서비스</Li>
        <Li>이력서 분석, 경험 수집, 자소서 초안 생성, 첨삭 기능 제공</Li>
      </Section>

      <Section title="② AI 생성물 면책">
        <Li>본 서비스는 AI를 활용하여 자기소개서를 생성합니다</Li>
        <Li>AI가 생성한 내용의 정확성, 적합성을 100% 보장하지 않습니다</Li>
        <Li>최종 자기소개서의 내용 확인 및 수정 책임은 이용자에게 있습니다</Li>
        <Li>AI 생성 자소서 사용으로 인한 채용 결과에 대해 책임지지 않습니다</Li>
      </Section>

      <Section title="③ 생성물 소유권">
        <Li>서비스를 통해 생성된 자기소개서 및 에피소드의 소유권은 이용자에게 있습니다</Li>
        <Li>회사는 서비스 개선 목적으로 비식별화된 데이터를 활용할 수 있습니다</Li>
      </Section>

      <Section title="④ 이용자 의무">
        <Li>타인의 개인정보를 도용하여 서비스를 이용하지 않을 것</Li>
        <Li>서비스를 비정상적인 방법으로 이용하지 않을 것</Li>
        <Li>생성된 자소서에 허위 사실을 추가하지 않을 것 (권고)</Li>
      </Section>

      <Section title="⑤ 유료 서비스 및 결제">
        <Li>크레딧 차감 방식의 요금 체계</Li>
        <Li>미사용 크레딧은 전액 환불 가능</Li>
        <Li>일부 사용 시 잔여 크레딧만 환불</Li>
        <Li>사용한 크레딧은 환불 불가</Li>
      </Section>

      <Section title="⑥ 서비스 변경/중단">
        <Li>서비스 내용을 사전 고지 후 변경할 수 있음</Li>
        <Li>천재지변, 시스템 장애 등 불가피한 경우 사전 고지 없이 중단 가능</Li>
        <Li>서비스 중단으로 인한 손해에 대해 책임 제한</Li>
      </Section>

      <Section title="⑦ 계정 정지/탈퇴">
        <Li>이용약관 위반 시 서비스 이용이 제한될 수 있음</Li>
        <Li>이용자는 언제든지 탈퇴 가능</Li>
        <Li>탈퇴 시 모든 데이터 삭제 (복구 불가)</Li>
      </Section>

      <Section title="⑧ 분쟁 해결">
        <Li>준거법: 대한민국 법률</Li>
        <Li>관할 법원: 회사 소재지 관할 법원</Li>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f', marginBottom: '12px' }}>{title}</h2>
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>{children}</ul>
  </div>
);

const Li = ({ children }) => (
  <li style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, paddingLeft: '14px', position: 'relative' }}>
    <span style={{ position: 'absolute', left: 0, color: '#ccc' }}>·</span>
    {children}
  </li>
);

export default TermsPage;