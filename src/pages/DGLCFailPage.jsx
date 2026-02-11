import React from 'react';
import { useNavigate } from 'react-router-dom';

const DGLCFailPage = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code') || '';
  const message = searchParams.get('message') || '결제가 취소되었거나 실패했습니다.';

  return (
    <div style={{
      minHeight: '100vh', background: '#FBFBFD',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '20px',
    }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shakePop { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 70% { transform: scale(0.95) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '480px', animation: 'fadeInUp 0.6s ease-out',
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '48px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)', textAlign: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', animation: 'shakePop 0.5s ease-out',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <p style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>결제 실패</p>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>{message}</p>
        {code && <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 24px 0' }}>오류 코드: {code}</p>}
        {!code && <div style={{ height: '16px' }} />}

        <button onClick={() => navigate('/dglc/charge')}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            fontFamily: "'Pretendard', sans-serif", boxShadow: '0 8px 24px rgba(31,41,55,0.2)',
            marginBottom: '12px',
          }}>
          다시 시도하기
        </button>

        <button onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: '#fff', color: '#1F2937',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            fontFamily: "'Pretendard', sans-serif",
            border: '2px solid #1F2937',
          }}>
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default DGLCFailPage;