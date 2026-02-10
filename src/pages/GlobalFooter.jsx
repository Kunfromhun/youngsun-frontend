import React from 'react';
import { Link } from 'react-router-dom';

const GlobalFooter = ({ dark }) => {
  const textColor = dark ? 'rgba(255,255,255,0.35)' : '#999';
  const borderColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const linkHover = dark ? 'rgba(255,255,255,0.6)' : '#666';

  return (
    <footer style={{
      padding: '32px 24px',
      borderTop: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '11px', color: textColor, lineHeight: 1.8 }}>
      DeepGL (딥글) | 대표: 유병훈 | 사업자등록번호: 12345678 | 통신판매업 신고번호: 123445678
        <br />
        주소: 서울특별시 용산구 | 연락처: 010-1234-5678
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/privacy" style={{ fontSize: '11px', color: textColor, textDecoration: 'none' }}>개인정보 처리방침</Link>
        <Link to="/terms" style={{ fontSize: '11px', color: textColor, textDecoration: 'none' }}>이용약관</Link>
      </div>
      <p style={{ fontSize: '11px', color: textColor }} translate="no">© 2025 DeepGL. All rights reserved.</p>
    </footer>
  );
};

export default GlobalFooter;