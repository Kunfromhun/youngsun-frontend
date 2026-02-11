import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
};

const DGLCChargePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(null);

  // 충전
  const [krwInput, setKrwInput] = useState('');
  const [dglc, setDglc] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [chargeLoading, setChargeLoading] = useState(false);
  const [chargeError, setChargeError] = useState('');

  // 환전
  const [refundInput, setRefundInput] = useState('');
  const [refundKrw, setRefundKrw] = useState(0);
  const [refundFee, setRefundFee] = useState(0);
  const [refundFinal, setRefundFinal] = useState(0);
  const [isRefundFocused, setIsRefundFocused] = useState(false);
  const [refundableBalance, setRefundableBalance] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState('');

  const RATE = 100;
  const FEE_RATE = 0.035;

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      setUserId(session.user.id);
      setEmail(session.user.email || '');
      fetchBalance(session.user.id);
    };
    init();
  }, [navigate]);

  const fetchBalance = async (uid) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/dglc/balance?userId=${uid}`, { headers });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        if (data.refundable_balance !== undefined) setRefundableBalance(data.refundable_balance);
      }
    } catch (e) { console.error(e); }
  };

  // 충전 계산
  useEffect(() => {
    const num = parseInt(krwInput.replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setDglc(Math.round((num / RATE) * 10) / 10);
    } else {
      setDglc(0);
    }
  }, [krwInput]);

  // 환전 계산
  useEffect(() => {
    const num = parseFloat(refundInput.replace(/,/g, ''));
    if (!isNaN(num) && num > 0) {
      const krw = Math.round(num * RATE);
      const fee = Math.round(krw * FEE_RATE);
      setRefundKrw(krw);
      setRefundFee(fee);
      setRefundFinal(krw - fee);
    } else {
      setRefundKrw(0);
      setRefundFee(0);
      setRefundFinal(0);
    }
  }, [refundInput]);

  const formatKRW = (val) => {
    const num = val.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString('ko-KR');
  };

  const handleChange = (e) => setKrwInput(formatKRW(e.target.value));

  const handleRefundChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 1) return;
    setRefundInput(val);
  };

  const formatDGLC = (val) => {
    if (val === 0) return '0';
    return Number.isInteger(val) ? val.toLocaleString() : val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  // 충전 버튼 클릭
  const handleCharge = async () => {
    if (dglc === 0 || chargeLoading) return;
    setChargeError('');
    setChargeLoading(true);
    try {
      const krwAmount = parseInt(krwInput.replace(/,/g, ''), 10);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/dglc/charge/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ userId, krwAmount }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '주문 생성 실패');

      const tossPayments = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: userId });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: data.amount },
        orderId: data.orderId,
        orderName: data.orderName,
        successUrl: `${window.location.origin}/dglc/success${window.location.search}`,
        failUrl: `${window.location.origin}/dglc/fail`,
      });
    } catch (e) {
      setChargeError(e.message || '결제 요청에 실패했습니다.');
    } finally {
      setChargeLoading(false);
    }
  };

  // 환전 버튼 클릭
  const handleRefund = async () => {
    if (refundFinal === 0 || refundLoading || (refundableBalance !== null && parseFloat(refundInput) > refundableBalance)) return;
    setRefundError('');
    setRefundSuccess('');
    setRefundLoading(true);
    try {
      const dglcAmount = parseFloat(refundInput);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/dglc/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ userId, dglcAmount }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '환전 실패');
      setRefundSuccess(`환전 완료! 실수령액: ₩${(data.refundKrw || refundFinal).toLocaleString()}`);
      setRefundInput('');
      fetchBalance(userId);
    } catch (e) {
      setRefundError(e.message || '환전 요청에 실패했습니다.');
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile" onClick={() => navigate('/mypage')}>
          <div className="profile-avatar">
            {email ? email[0].toUpperCase() : 'U'}
          </div>
        </div>
        <div className="sidebar-spacer" />
        <button className="sidebar-logout" onClick={() => navigate('/dglc/charge')} title="충전" style={{ marginBottom: '12px', background: 'rgba(0,0,0,0.05)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
        </button>
        <button className="sidebar-logout" onClick={() => navigate('/search')} title="검색" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => navigate('/database')} title="데이터베이스" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => navigate('/dashboard')} title="대시보드" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="로그아웃">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </aside>
    <div style={{
      minHeight: '100vh', background: '#FBFBFD',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '20px', flex: 1,
    }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes coinSpin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(31, 41, 55, 0.1); } 50% { box-shadow: 0 0 0 8px rgba(31, 41, 55, 0.05); } }
        .exchange-container { display: flex; flex-direction: row; align-items: stretch; gap: 0; margin-bottom: 24px; }
        .exchange-side { flex: 1; padding: 28px 24px; }
        .exchange-divider-col { display: flex; align-items: center; justify-content: center; padding: 0 4px; }
        .exchange-divider-row { display: none; align-items: center; justify-content: center; padding: 8px 0; }
        @media (max-width: 540px) {
          .exchange-container { flex-direction: column; }
          .exchange-divider-col { display: none; }
          .exchange-divider-row { display: flex; }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '640px', animation: 'fadeInUp 0.6s ease-out' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', animation: 'coinSpin 3s ease-in-out infinite',
            boxShadow: '0 8px 32px rgba(31, 41, 55, 0.2)',
          }}>
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>D</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>DGLC 충전</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0, fontWeight: '500' }}>DeepGL Credit</p>
          {balance !== null && (
            <p style={{ fontSize: '14px', color: '#374151', marginTop: '12px', fontWeight: '700' }}>
              보유 잔액: {formatDGLC(balance)} DGLC
            </p>
          )}
        </div>

        {/* ========== 충전 카드 ========== */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          <div className="exchange-container">
            <div className="exchange-side" style={{
              background: isFocused ? '#fff' : '#F9FAFB', borderRadius: '20px',
              border: isFocused ? '2px solid #1F2937' : '2px solid transparent',
              transition: 'all 0.2s ease', animation: isFocused ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', margin: '0 0 12px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>충전 금액</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937' }}>₩</span>
                <input type="text" value={krwInput} onChange={handleChange}
                  onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="0"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '32px', fontWeight: '800', color: '#1F2937',
                    background: 'transparent', fontFamily: "'Pretendard', sans-serif", width: '100%', minWidth: 0 }} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#9CA3AF', margin: '8px 0 0 0' }}>KRW</p>
            </div>

            <div className="exchange-divider-col">
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(31,41,55,0.2)', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </div>
            </div>
            <div className="exchange-divider-row">
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(31,41,55,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="exchange-side" style={{
              background: dglc > 0 ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)' : '#F3F4F6',
              borderRadius: '20px', transition: 'all 0.4s ease', border: '2px solid transparent',
            }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: dglc > 0 ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: '0 0 12px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>받을 크레딧</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: dglc > 0 ? '#fff' : '#D1D5DB', lineHeight: 1, transition: 'all 0.3s ease' }}>{formatDGLC(dglc)}</span>
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: dglc > 0 ? 'rgba(255,255,255,0.6)' : '#9CA3AF', margin: '8px 0 0 0' }}>DGLC</p>
            </div>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700' }}>i</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0', lineHeight: '1.5' }}>
                  자소서 한 편당 대략 <span style={{ color: '#1F2937', fontWeight: '800' }}>20 DGLC</span>가 소모됩니다.
                </p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 2px 0', lineHeight: '1.5' }}>100원 = 1 DGLC</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>DGLC는 언제든지 원화로 환전할 수 있습니다. 환전 시 PG사 수수료(3.5%)가 차감됩니다.</p>
              </div>
            </div>
          </div>

          {chargeError && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{chargeError}</p>}

          <button disabled={dglc === 0 || chargeLoading} onClick={handleCharge}
            style={{
              width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
              background: dglc > 0 ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)' : '#E5E7EB',
              color: dglc > 0 ? '#fff' : '#9CA3AF', fontSize: '16px', fontWeight: '700',
              cursor: dglc > 0 && !chargeLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease', fontFamily: "'Pretendard', sans-serif",
              boxShadow: dglc > 0 ? '0 8px 24px rgba(31,41,55,0.2)' : 'none', opacity: chargeLoading ? 0.6 : 1,
            }}>
            {chargeLoading ? '결제 준비 중...' : dglc > 0 ? `${formatDGLC(dglc)} DGLC 충전하기` : '충전할 금액을 입력하세요'}
          </button>
        </div>

        {/* ========== 환전 카드 ========== */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)', marginTop: '24px',
        }}>
        <p style={{ fontSize: '18px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>DGLC 환전</p>
          {refundableBalance !== null && (
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0' }}>
              환전 가능: <span style={{ fontWeight: '700', color: '#1F2937' }}>{formatDGLC(refundableBalance)} DGLC</span>
            </p>
          )}
          {refundableBalance !== null && parseFloat(refundInput) > refundableBalance && (
            <p style={{ fontSize: '13px', color: '#EF4444', margin: '0 0 16px 0' }}>환전 가능 잔액을 초과했습니다.</p>
          )}

          <div className="exchange-container">
            <div className="exchange-side" style={{
              background: isRefundFocused ? '#fff' : '#F9FAFB', borderRadius: '20px',
              border: isRefundFocused ? '2px solid #1F2937' : '2px solid transparent',
              transition: 'all 0.2s ease', animation: isRefundFocused ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', margin: '0 0 12px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>환전할 크레딧</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <input type="text" value={refundInput} onChange={handleRefundChange}
                  onFocus={() => setIsRefundFocused(true)} onBlur={() => setIsRefundFocused(false)} placeholder="0"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '32px', fontWeight: '800', color: '#1F2937',
                    background: 'transparent', fontFamily: "'Pretendard', sans-serif", width: '100%', minWidth: 0 }} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#9CA3AF', margin: '8px 0 0 0' }}>DGLC</p>
            </div>

            <div className="exchange-divider-col">
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(31,41,55,0.2)', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </div>
            </div>
            <div className="exchange-divider-row">
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(31,41,55,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="exchange-side" style={{
              background: refundFinal > 0 ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)' : '#F3F4F6',
              borderRadius: '20px', transition: 'all 0.4s ease', border: '2px solid transparent',
            }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: refundFinal > 0 ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: '0 0 12px 0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>받을 금액</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: refundFinal > 0 ? 'rgba(255,255,255,0.7)' : '#D1D5DB' }}>₩</span>
                <span style={{ fontSize: '32px', fontWeight: '900', color: refundFinal > 0 ? '#fff' : '#D1D5DB', lineHeight: 1, transition: 'all 0.3s ease' }}>{refundFinal.toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: refundFinal > 0 ? 'rgba(255,255,255,0.6)' : '#9CA3AF', margin: '8px 0 0 0' }}>KRW</p>
            </div>
          </div>

          {refundFinal > 0 && (
            <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>환전 금액</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>₩{refundKrw.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>PG사 수수료 (3.5%)</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#EF4444' }}>-₩{refundFee.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', background: '#E5E7EB', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937' }}>실수령액</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#1F2937' }}>₩{refundFinal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {refundError && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{refundError}</p>}
          {refundSuccess && <p style={{ color: '#10B981', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{refundSuccess}</p>}

          <button disabled={refundFinal === 0 || refundLoading || (refundableBalance !== null && parseFloat(refundInput) > refundableBalance)} onClick={handleRefund}
            style={{
              width: '100%', padding: '18px', borderRadius: '16px',
              background: refundFinal > 0 ? '#fff' : '#E5E7EB',
              color: refundFinal > 0 ? '#1F2937' : '#9CA3AF',
              fontSize: '16px', fontWeight: '700',
              cursor: refundFinal > 0 && !refundLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease', fontFamily: "'Pretendard', sans-serif",
              boxShadow: refundFinal > 0 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              border: refundFinal > 0 ? '2px solid #1F2937' : '2px solid transparent',
              opacity: refundLoading ? 0.6 : 1,
            }}>
            {refundLoading ? '환전 처리 중...' : refundFinal > 0 ? `₩${refundFinal.toLocaleString()} 환전하기` : '환전할 크레딧을 입력하세요'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '20px' }}>© DeepGL. All rights reserved.</p>
        </div>
    </div>
    </div>
  );
};
export default DGLCChargePage;
