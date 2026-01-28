import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resumeApi } from '../lib/api';

const MyPage = () => {
  const { user, email, signOut, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  // 닉네임 상태
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  
  // 비밀번호 변경 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // 이력서 상태
// 이력서 상태
const [resumes, setResumes] = useState([]);
const [uploadingResume, setUploadingResume] = useState(false);
const [resumeError, setResumeError] = useState('');
const [editingResumeId, setEditingResumeId] = useState(null);
const [editingResumeName, setEditingResumeName] = useState('');
  
  const userId = user?.id;

  // 닉네임 로드 (localStorage에서)
  useEffect(() => {
    const savedNickname = localStorage.getItem(`nickname_${userId}`);
    if (savedNickname) {
      setNickname(savedNickname);
      setNicknameInput(savedNickname);
    }
  }, [userId]);

  // 이력서 목록 로드
  useEffect(() => {
    const loadResumes = async () => {
      if (!userId) return;
      try {
        const data = await resumeApi.getList(userId);
        setResumes(data.resumes || []);
      } catch (err) {
        console.error('이력서 로드 실패:', err);
      }
    };
    loadResumes();
  }, [userId]);

  // 닉네임 저장
  const handleSaveNickname = () => {
    if (nicknameInput.trim()) {
      localStorage.setItem(`nickname_${userId}`, nicknameInput.trim());
      setNickname(nicknameInput.trim());
      setIsEditingNickname(false);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setPasswordSuccess('비밀번호가 변경되었습니다.');
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(result.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setPasswordError('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  // 이력서 업로드
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // PDF 파일 확인
    if (file.type !== 'application/pdf') {
      setResumeError('PDF 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      setResumeError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setUploadingResume(true);
    setResumeError('');

    try {
      const versionName = `v${resumes.length + 1}`;
      const result = await resumeApi.upload(userId, file, versionName);
      if (result.resume) {
        setResumes([...resumes, result.resume]);
      }
    } catch (err) {
      setResumeError(err.message || '이력서 업로드에 실패했습니다.');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  // 이력서 삭제
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('이력서를 삭제하시겠습니까?')) return;

    try {
      await resumeApi.delete(resumeId, userId);
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (err) {
      setResumeError('이력서 삭제에 실패했습니다.');
    }
  };

  // 이력서 이름 수정
  const handleEditResumeName = (resume) => {
    setEditingResumeId(resume.id);
    setEditingResumeName(resume.fileName || '이력서');
  };

  const handleSaveResumeName = async (resumeId) => {
    try {
      await resumeApi.update(resumeId, userId, { fileName: editingResumeName });
      setResumes(resumes.map(r => 
        r.id === resumeId ? { ...r, fileName: editingResumeName } : r
      ));
      setEditingResumeId(null);
      setEditingResumeName('');
    } catch (err) {
      setResumeError('이력서 이름 수정에 실패했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingResumeId(null);
    setEditingResumeName('');
  };

  // 로그아웃
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="mypage-layout">
      {/* 사이드바 */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile" onClick={() => navigate('/dashboard')}>
          <div className="profile-avatar">
            {nickname ? nickname[0].toUpperCase() : (email ? email[0].toUpperCase() : 'U')}
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

      {/* 메인 콘텐츠 */}
      <main className="mypage-main">
        <div className="mypage-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            대시보드로 돌아가기
          </button>
          <h1>마이페이지</h1>
          <p className="mypage-subtitle">계정 정보 및 이력서를 관리하세요</p>
        </div>

        {/* 프로필 섹션 */}
        <section className="mypage-section">
          <h2>프로필</h2>
          <div className="mypage-card">
            <div className="profile-row">
              <div className="profile-avatar-large">
                {nickname ? nickname[0].toUpperCase() : (email ? email[0].toUpperCase() : 'U')}
              </div>
              <div className="profile-info">
                {isEditingNickname ? (
                  <div className="nickname-edit">
                    <input
                      type="text"
                      className="input-field"
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      placeholder="닉네임 입력"
                      maxLength={20}
                    />
                    <button className="button-primary" onClick={handleSaveNickname}>저장</button>
                    <button className="button-secondary" onClick={() => {
                      setIsEditingNickname(false);
                      setNicknameInput(nickname);
                    }}>취소</button>
                  </div>
                ) : (
                  <div className="nickname-display">
                    <h3>{nickname || '닉네임 없음'}</h3>
                    <button className="edit-button" onClick={() => setIsEditingNickname(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="email-display">{email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 보안 섹션 */}
        <section className="mypage-section">
          <h2>보안</h2>
          <div className="mypage-card">
            <div className="security-row">
              <div>
                <h4>비밀번호</h4>
                <p>계정 비밀번호를 변경합니다</p>
              </div>
              <button className="button-secondary" onClick={() => setShowPasswordModal(true)}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </section>

        {/* 이력서 섹션 */}
        <section className="mypage-section">
          <h2>이력서 관리</h2>
          <div className="mypage-card">
            {resumeError && (
              <div className="resume-error">
                {resumeError}
                <button onClick={() => setResumeError('')}>×</button>
              </div>
            )}

            <div className="resume-upload-area">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-upload" className="resume-upload-button">
                {uploadingResume ? (
                  <span>업로드 중...</span>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>PDF 이력서 업로드</span>
                  </>
                )}
              </label>
              <p className="upload-hint">PDF 파일만 지원 (최대 10MB)</p>
            </div>

            {resumes.length > 0 ? (
              <div className="resume-list">
                {resumes.map((resume) => (
                  <div key={resume.id} className="resume-item">
                    <div className="resume-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="resume-info">
                      {editingResumeId === resume.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            value={editingResumeName}
                            onChange={(e) => setEditingResumeName(e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #E5E7EB',
                              fontSize: '14px'
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveResumeName(resume.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10B981' }}
                            title="저장"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                            title="취소"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <h4>{resume.fileName || '이력서'}</h4>
                      )}
                      <p>{resume.versionName}</p>
                    </div>
                    <button
                      className="resume-edit-btn"
                      onClick={() => handleEditResumeName(resume)}
                      title="이름 수정"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', marginRight: '8px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button 
                      className="resume-delete-btn"
                      onClick={() => handleDeleteResume(resume.id)}
                      title="삭제"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="resume-empty">
                <p>업로드된 이력서가 없습니다</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)} />
          <div className="modal password-modal">
            <div className="modal-header">
              <span>비밀번호 변경</span>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handlePasswordChange}>
                {passwordError && <div className="login-error">{passwordError}</div>}
                {passwordSuccess && <div className="login-success">{passwordSuccess}</div>}

                <div className="input-group">
                  <label>새 비밀번호</label>
                  <input
                    type="password"
                    className="input-field"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="6자 이상 입력"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>새 비밀번호 확인</label>
                  <input
                    type="password"
                    className="input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 다시 입력"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="button-secondary" onClick={() => setShowPasswordModal(false)}>
                    취소
                  </button>
                  <button type="submit" className="button-primary">
                    변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;