import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
};

const DGLCSuccessPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [chargedDglc, setChargedDglc] = useState(0);
  const [newBalance, setNewBalance] = useState(0);

  useEffect(() => {
    const confirm = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
          setStatus('error');
          setMessage('결제 정보가 올바르지 않습니다.');
          return;
        }

        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/dglc/charge/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setChargedDglc(data.chargedDglc || Math.round((Number(amount) / 100) * 10) / 10);
          setNewBalance(data.newBalance || 0);
        } else {
          setStatus('error');
          setMessage(data.error || '결제 승인에 실패했습니다.');
        }
      } catch (e) {
        setStatus('error');
        setMessage('결제 승인 중 오류가 발생했습니다.');
      }
    };
    confirm();
  }, []);

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
        @keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '480px', animation: 'fadeInUp 0.6s ease-out',
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '48px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)', textAlign: 'center',
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #E5E7EB',
              borderTopColor: '#1F2937', margin: '0 auto 24px',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>결제 승인 중...</p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>잠시만 기다려주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', animation: 'checkPop 0.5s ease-out',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>충전 완료!</p>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: '0 0 24px 0' }}>
              <span style={{ fontWeight: '800', color: '#1F2937' }}>{chargedDglc} DGLC</span>가 충전되었습니다.
            </p>
            {newBalance > 0 && (
              <div style={{
                background: '#F9FAFB', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>현재 잔액</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#1F2937' }}>{newBalance} DGLC</span>
                </div>
              </div>
            )}
          <button onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const returnUrl = params.get('returnUrl');
              navigate(returnUrl || '/dashboard');
            }}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                fontFamily: "'Pretendard', sans-serif", boxShadow: '0 8px 24px rgba(31,41,55,0.2)',
              }}>
        {new URLSearchParams(window.location.search).get('returnUrl') ? '이어서 진행하기' : '대시보드로 이동'}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', animation: 'checkPop 0.5s ease-out',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>충전 실패</p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>{message}</p>
            <button onClick={() => navigate('/dglc/charge')}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                fontFamily: "'Pretendard', sans-serif", boxShadow: '0 8px 24px rgba(31,41,55,0.2)',
              }}>
              다시 시도하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DGLCSuccessPage;
