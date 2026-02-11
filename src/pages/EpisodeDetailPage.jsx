import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../lib/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

const EpisodeDetailPage = () => {
  const { companyName, episodeId } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName);
  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const loadEpisode = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await authFetch(`${API_BASE_URL}/api/user-database/episode/${episodeId}?userId=${userId}`);
        const data = await response.json();
        if (data.episode) {
          setEpisode(data.episode);
          setEditedContent(data.episode.contentText || '');
          setOriginalContent(data.episode.contentText || '');
        } else {
          setError('에피소드를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('에피소드 로드 실패:', err);
        setError('에피소드를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadEpisode();
  }, [userId, episodeId]);
  const handleTitleSave = async () => {
    if (!editedTitle.trim()) return;
    try {
      const response = await authFetch(`${API_BASE_URL}/api/user-database/episode/${episodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: editedTitle.trim() })
      });
      if (response.ok) {
        setEpisode(prev => ({ ...prev, title: editedTitle.trim() }));
        setEditingTitle(false);
        setSuccessMessage('제목이 변경되었습니다.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('제목 변경 실패:', err);
      setError('제목 변경에 실패했습니다.');
    }
  };
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const response = await authFetch(`${API_BASE_URL}/api/user-database/episode/${episodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentText: editedContent
        })
      });

      if (response.ok) {
        setOriginalContent(editedContent);
        setSuccessMessage('저장되었습니다.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('저장 실패');
      }
    } catch (err) {
      console.error('에피소드 저장 실패:', err);
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = () => {
    setEditedContent(originalContent);
  };
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await authFetch(`${API_BASE_URL}/api/user-database/episode/${episodeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        navigate(`/database/${companyName}/episodes`);
      } else {
        throw new Error('삭제 실패');
      }
    } catch (err) {
      console.error('에피소드 삭제 실패:', err);
      setError('삭제에 실패했습니다.');
    }
  };


  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const hasChanges = editedContent !== originalContent;

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
          <button className="back-button" onClick={() => navigate(`/database/${companyName}/episodes`)} style={{ marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            에피소드 목록으로 돌아가기
          </button>
          <h1>{decodedCompanyName} 에피소드</h1>
          <p className="dashboard-subtitle">에피소드를 확인하고 편집하세요</p>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            color: '#10B981',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {successMessage}
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
                  <linearGradient id="edLoadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#edLoadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
                <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
              </svg>
              <div className="pulse-ring pulse-ring-1"></div>
              <div className="pulse-ring pulse-ring-2"></div>
              <div className="pulse-ring pulse-ring-3"></div>
            </div>
            <p>에피소드 불러오는 중...</p>
          </div>
        ) : episode ? (
          <div className="project-card" style={{ padding: '24px' }}>
            {/* 메타 정보 */}
            <div style={{ marginBottom: '20px' }}>
            {editingTitle ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') setEditingTitle(false); }}
                    autoFocus
                    style={{
                      flex: 1, fontSize: '20px', fontWeight: '600', color: '#1D1D1F',
                      padding: '4px 8px', border: '2px solid #3B82F6', borderRadius: '8px', outline: 'none'
                    }}
                  />
                  <button onClick={handleTitleSave} style={{ padding: '6px 12px', background: '#3B82F6', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>저장</button>
                  <button onClick={() => setEditingTitle(false)} style={{ padding: '6px 12px', background: 'rgba(107,114,128,0.1)', border: 'none', borderRadius: '8px', fontSize: '13px', color: '#6B7280', cursor: 'pointer' }}>취소</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1D1D1F', margin: 0 }}>
                    {episode.title || episode.topic || '제목 없음'}
                  </h2>
                  <div
                    onClick={() => { setEditingTitle(true); setEditedTitle(episode.title || episode.topic || ''); }}
                    style={{ padding: '4px', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                    title="제목 수정"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {episode.talentProfile && (
                  <span style={{
                    padding: '6px 12px',
                    background: 'rgba(74, 85, 104, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#4A5568'
                  }}>
                    {episode.talentProfile}
                  </span>
                )}
                {episode.coreCompetency && (
                  <span style={{
                    padding: '6px 12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#3B82F6'
                  }}>
                    {episode.coreCompetency}
                  </span>
                )}
              </div>
            </div>

            {/* 편집 영역 */}
            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '16px',
                  fontSize: '15px',
                  lineHeight: '1.8',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  background: '#FAFAFA'
                }}
              />
            </div>

 {/* 버튼 영역 */}
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleRestore}
                disabled={!hasChanges}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1D1D1F',
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  opacity: hasChanges ? 1 : 0.5,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => hasChanges && (e.target.style.background = 'rgba(0,0,0,0.05)')}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                원본으로 복원
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1D1D1F',
                  cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                  opacity: hasChanges && !saving ? 1 : 0.5,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => hasChanges && !saving && (e.target.style.background = 'rgba(0,0,0,0.05)')}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#FF3B30',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,59,48,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                삭제하기
              </button>
            </div>
          </div>
        ) : (
          <div className="project-card" style={{ padding: '40px', textAlign: 'center', color: '#86868B' }}>
            에피소드를 찾을 수 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};

export default EpisodeDetailPage;