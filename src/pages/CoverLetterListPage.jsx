import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../lib/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

const CoverLetterListPage = () => {
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName);
  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();

  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({ content: '' });
  const [addLoading, setAddLoading] = useState(false);

  const loadCoverLetters = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await authFetch(`${API_BASE_URL}/api/user-database/${userId}/${encodeURIComponent(decodedCompanyName)}/cover-letters`);
      const data = await response.json();
      setCoverLetters(data.coverLetters || []);
    } catch (err) {
      console.error('자소서 로드 실패:', err);
      setError('자소서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoverLetters();
  }, [userId, decodedCompanyName]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleAddSubmit = async () => {
    if (!addFormData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    setAddLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/manual/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          companyName: decodedCompanyName,
          contentText: addFormData.content
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setAddFormData({ content: '' });
        loadCoverLetters();
      } else {
        setError(data.message || '저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('자소서 추가 실패:', err);
      setError('저장에 실패했습니다.');
    } finally {
      setAddLoading(false);
    }
  };

  if (showAddModal) {
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
          <button className="sidebar-logout" onClick={() => navigate('/database')} title="데이터베이스" style={{ marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
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
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '600px', width: '100%', padding: '0 24px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1D1D1F',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              자소서 추가
            </h1>
            
            <p style={{
              fontSize: '15px',
              color: '#86868B',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              {decodedCompanyName}에 새로운 자소서를 등록하세요
            </p>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1D1D1F' 
              }}>
                내용
              </label>
              <textarea
                value={addFormData.content}
                onChange={(e) => setAddFormData({ ...addFormData, content: e.target.value })}
                placeholder="자소서 내용을 입력하세요..."
                style={{ 
                  width: '100%', 
                  minHeight: '300px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  background: 'white'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#FF3B30', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddFormData({ content: '' });
                  setError('');
                }}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1D1D1F',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                취소
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={addLoading}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: addLoading ? '#D1D1D6' : '#1D1D1F',
                  cursor: addLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!addLoading) e.target.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {addLoading ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <button className="sidebar-logout" onClick={() => navigate('/database')} title="데이터베이스" style={{ marginBottom: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
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
          <button className="back-button" onClick={() => navigate(`/database/${companyName}`)} style={{ marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {decodedCompanyName}으로 돌아가기
          </button>
          <h1>{decodedCompanyName} 자기소개서</h1>
          <p className="dashboard-subtitle">저장된 자기소개서 목록</p>
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
              <svg width="80" height="80" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="clLoadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#clLoadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
                <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
              </svg>
              <div className="pulse-ring pulse-ring-1"></div>
              <div className="pulse-ring pulse-ring-2"></div>
              <div className="pulse-ring pulse-ring-3"></div>
            </div>
            <p>자소서 불러오는 중...</p>
          </div>
        ) : (
          <div className="project-grid">
            {/* 자소서 추가하기 카드 */}
            <div
              className="project-card new-project-card"
              onClick={() => setShowAddModal(true)}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '120px'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span style={{ color: '#86868B', fontSize: '15px', fontWeight: '500' }}>자소서 추가하기</span>
              </div>
            </div>

            {coverLetters.map((coverLetter) => (
              <div
                key={coverLetter.id}
                className="project-card"
                onClick={() => navigate(`/database/${companyName}/cover-letters/${coverLetter.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-card-header">
                  <h3 className="project-title">{coverLetter.title || coverLetter.question || '제목 없음'}</h3>
                </div>
                <div style={{ marginTop: '8px' }}>
                  {coverLetter.jobTitle && (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: 'rgba(74, 85, 104, 0.1)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#4A5568',
                      marginRight: '8px'
                    }}>
                      {coverLetter.jobTitle}
                    </span>
                  )}
                  {coverLetter.wordCount && (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#10B981'
                    }}>
                      {coverLetter.wordCount}자
                    </span>
                  )}
                </div>
                <p style={{ 
                  marginTop: '12px', 
                  fontSize: '13px', 
                  color: '#86868B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
{(coverLetter.content || coverLetter.content_text || coverLetter.contentText || '').substring(0, 100) || '내용 없음'}...
                </p>
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#86868B' }}>
                  {coverLetter.createdAt ? new Date(coverLetter.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CoverLetterListPage;