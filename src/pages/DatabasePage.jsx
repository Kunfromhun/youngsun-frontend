import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';
const DatabasePage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(`${API_BASE_URL}/api/user-database/${userId}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });        const data = await response.json();
        if (data.success) {
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCompanyClick = (companyName) => {
    navigate(`/database/${encodeURIComponent(companyName)}`);
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
        <button className="sidebar-logout" onClick={() => navigate('/search')} title="검색" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={() => navigate('/dashboard')} title="대시보드" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button className="sidebar-logout" onClick={handleLogout} title="로그아웃">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-header">
        <h1>My <span translate="no">DeepGL</span> Database</h1>
                  <p className="dashboard-subtitle">자기소개서와 에피소드를 관리하세요</p>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="loading-spinner" />
            </div>
            <p style={{ marginTop: '16px', color: '#86868B' }}>데이터 불러오는 중...</p>
          </div>
        ) : (
          <div className="project-grid">
            {companies.length === 0 ? (
              <div className="empty-state">
                <p>저장된 데이터가 없습니다</p>
                <p style={{ fontSize: '14px', color: '#86868B', marginTop: '8px' }}>
                  딥글 세션을 완료하면 자동으로 저장됩니다
                </p>
              </div>
            ) : (
              companies.map((company) => (
                <div
                  key={company.companyName}
                  className="project-card"
                  onClick={() => handleCompanyClick(company.companyName)}
                >
                  <div className="project-card-header">
                    <h3 className="project-title">
                      {company.companyName}
                    </h3>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    fontSize: '14px',
                    color: '#86868B',
                    marginTop: '12px'
                  }}>
                    <span>에피소드 {company.episodeCount || 0}개</span>
                    <span>자소서 {company.coverLetterCount || 0}개</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DatabasePage;