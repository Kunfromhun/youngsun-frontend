import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../lib/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

const SearchPage = () => {
  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 디바운스 검색
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await authFetch(`${API_BASE_URL}/api/search?userId=${userId}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
        } else {
          setError('검색에 실패했습니다.');
        }
      } catch (err) {
        console.error('검색 실패:', err);
        setError('검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, userId]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleResultClick = (type, item) => {
    switch (type) {
      case 'project':
        navigate(`/project/${item.id}`);
        break;
      case 'question':
        navigate(`/project/${item.projectId}/question/${item.id}`);
        break;
      case 'episode':
        navigate(`/database/${encodeURIComponent(item.companyName)}/episodes/${item.id}`);
        break;
      case 'coverLetter':
        navigate(`/database/${encodeURIComponent(item.companyName)}/cover-letters/${item.id}`);
        break;
      default:
        break;
    }
  };

  const getTotalCount = () => {
    if (!results) return 0;
    return (results.projects?.length || 0) + 
           (results.questions?.length || 0) + 
           (results.episodes?.length || 0) + 
           (results.coverLetters?.length || 0);
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
        <button className="sidebar-logout" onClick={() => navigate('/dglc/charge')} title="충전" style={{ marginBottom: '12px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
        </button>
        <button className="sidebar-logout" onClick={() => navigate('/search')} title="검색" style={{ marginBottom: '12px', background: 'rgba(0,0,0,0.05)' }}>
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
          <h1>My DeepGL Search</h1>
          <p className="dashboard-subtitle">프로젝트, 문항, 에피소드, 자소서를 검색하세요</p>
        </div>

        {/* 검색 입력창 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요 (최소 2글자)"
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '17px',
                color: '#1D1D1F',
                background: 'transparent'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#86868B'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#86868B' }}>
            <p>검색 중...</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!loading && results && (
          <div>
            <p style={{ color: '#86868B', fontSize: '14px', marginBottom: '24px' }}>
              총 {getTotalCount()}개의 결과
            </p>

            {/* 프로젝트 */}
            {results.projects?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#1D1D1F', 
                  marginBottom: '12px' 
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  프로젝트 ({results.projects.length}개)
                </h3>
                <div className="project-grid">
                  {results.projects.map((item) => (
                    <div
                      key={item.id}
                      className="project-card"
                      onClick={() => handleResultClick('project', item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="project-title">{item.company} / {item.jobTitle}</h3>
                      <p style={{ fontSize: '13px', color: '#86868B', marginTop: '8px' }}>
                        {item.status === 'analyzing' ? '분석 중' : item.status === 'analyzed' ? '분석 완료' : '진행 중'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 문항 */}
            {results.questions?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#1D1D1F', 
                  marginBottom: '12px' 
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  문항 ({results.questions.length}개)
                </h3>
                <div className="project-grid">
                  {results.questions.map((item) => (
                    <div
                      key={item.id}
                      className="project-card"
                      onClick={() => handleResultClick('question', item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="project-title">{item.questionText}</h3>
                      <p style={{ fontSize: '13px', color: '#86868B', marginTop: '8px' }}>
                        {item.company} · 문항 {item.questionIndex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 에피소드 */}
            {results.episodes?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#1D1D1F', 
                  marginBottom: '12px' 
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  에피소드 ({results.episodes.length}개)
                </h3>
                <div className="project-grid">
                  {results.episodes.map((item) => (
                    <div
                      key={item.id}
                      className="project-card"
                      onClick={() => handleResultClick('episode', item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="project-title">{item.title || '제목 없음'}</h3>
                      <p style={{ fontSize: '13px', color: '#86868B', marginTop: '8px' }}>
                        {item.companyName}
                      </p>
                      {item.preview && (
                        <p style={{ 
                          fontSize: '13px', 
                          color: '#86868B', 
                          marginTop: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.preview}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자소서 */}
            {results.coverLetters?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#1D1D1F', 
                  marginBottom: '12px' 
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  자소서 ({results.coverLetters.length}개)
                </h3>
                <div className="project-grid">
                  {results.coverLetters.map((item) => (
                    <div
                      key={item.id}
                      className="project-card"
                      onClick={() => handleResultClick('coverLetter', item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="project-title">{item.title || '제목 없음'}</h3>
                      <p style={{ fontSize: '13px', color: '#86868B', marginTop: '8px' }}>
                        {item.companyName}
                      </p>
                      {item.preview && (
                        <p style={{ 
                          fontSize: '13px', 
                          color: '#86868B', 
                          marginTop: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.preview}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 결과 없음 */}
            {getTotalCount() === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#86868B' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.5 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p>'{query}'에 대한 검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        )}

        {/* 초기 상태 */}
        {!loading && !results && query.length < 2 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#86868B' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p>검색어를 입력하세요</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;