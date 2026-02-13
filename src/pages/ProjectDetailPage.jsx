import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectApi } from '../lib/api';

const STEP_LABELS = ['공고 분석', '문항 분석', '역량 모델링', '이력서 매칭', '경험 카드 생성', '방향성 확정', '크레딧 정산'];
const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { userId, email } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  
  // 6단계 진행률 state
  const [analysisSteps, setAnalysisSteps] = useState(
    STEP_LABELS.map((label, i) => ({ step: i + 1, label, status: 'pending' }))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [failedStep, setFailedStep] = useState(null);
  const isMountedRef = useRef(true);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const loadProject = async () => {
    if (!userId || !projectId) return;
    
    try {
      setLoading(true);
      const data = await projectApi.getOne(projectId, userId);
      setProject({
        ...data.project,
        questions: data.questions || []
      });
      setAnalysisStatus(data.project.analysis_status || 'analyzed');      
    } catch (err) {
      console.error('프로젝트 로드 실패:', err);
      setError('프로젝트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId, userId]);

  // 분석 상태가 analyzing/pending이면 순차 호출 시작
  useEffect(() => {
    if (!loading && analysisStatus && (analysisStatus === 'analyzing' || analysisStatus === 'pending')) {
      runSteps();
    }
  }, [loading, analysisStatus]);

  const runSteps = async (startFrom = 1) => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setFailedStep(null);

    // startFrom 이전 스텝은 done으로, 이후는 pending으로 초기화
    setAnalysisSteps(prev => prev.map((s, i) => ({
      ...s,
      status: i + 1 < startFrom ? 'done' : 'pending'
    })));

    for (let step = startFrom; step <= 7; step++) {
      if (!isMountedRef.current) break;

      setCurrentStep(step);
      setAnalysisSteps(prev => prev.map((s, i) => 
        i + 1 === step ? { ...s, status: 'loading' } : s
      ));

      try {
        await projectApi.analysisStep(projectId, userId, step);

        if (!isMountedRef.current) break;
        setAnalysisSteps(prev => prev.map((s, i) => 
          i + 1 === step ? { ...s, status: 'done' } : s
        ));
      } catch (err) {
        console.error(`분석 스텝 ${step} 실패:`, err);
        if (!isMountedRef.current) break;

        setAnalysisSteps(prev => prev.map((s, i) => 
          i + 1 === step ? { ...s, status: 'failed' } : s
        ));
        setFailedStep(step);
        isRunningRef.current = false;
        return; // 실패 시 중단
      }
    }

    // 전체 완료
    if (isMountedRef.current) {
      setAnalysisStatus('analyzed');
      setCurrentStep(0);
      loadProject();
    }
    isRunningRef.current = false;
  };

  const handleRetryAnalysis = () => {
    if (failedStep) {
      setAnalysisStatus('analyzing');
      runSteps(failedStep); // 실패한 스텝부터 재시도
    } else {
      setAnalysisStatus('analyzing');
      runSteps(1);
    }
  };


  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { text: '시작 전', color: '#86868B', bg: 'rgba(134, 134, 139, 0.1)' },
      'direction': { text: '방향성 선택', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
      'qa': { text: '경험 구체화', color: '#007AFF', bg: 'rgba(0, 122, 255, 0.1)' },
      'episode': { text: '에피소드 생성', color: '#5856D6', bg: 'rgba(88, 86, 214, 0.1)' },
      'plan': { text: '계획서 작성', color: '#AF52DE', bg: 'rgba(175, 82, 222, 0.1)' },
      'letter': { text: '자소서 작성', color: '#FF2D55', bg: 'rgba(255, 45, 85, 0.1)' },
      'review': { text: '검토 중', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
      'done': { text: '완료', color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const handleQuestionClick = (questionId) => {
    if (analysisStatus !== 'analyzed') {
      alert('분석이 아직 완료되지 않았습니다. 잠시만 기다려주세요.');
      return;
    }
    navigate(`/project/${projectId}/question/${questionId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const DeepglLogo = ({ size = 40, onClick }) => (
    <div 
      className="deepgl-logo-button"
      onClick={onClick}
      title="사전 분석 보기"
    >
      <svg width={size} height={size} viewBox="0 0 200 200">
        <defs>
          <linearGradient id="detailLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#detailLogoGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
        <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
        <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
      </svg>
    </div>
  );

  // 공통 사이드바 컴포넌트
  const Sidebar = () => (
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
      <button className="sidebar-logout" onClick={() => navigate('/database')} title="데이터베이스" style={{ marginBottom: '12px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      </button>
      <button className="sidebar-logout" onClick={handleBack} title="대시보드" style={{ marginBottom: '12px' }}>
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
  );

  if (loading) {
    return (
      <div className="project-detail-layout">
        <Sidebar />
        <main className="project-detail-main">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>프로젝트 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-layout">
        <Sidebar />
        <main className="project-detail-main">
          <div className="error-container">
            <p>{error || '프로젝트를 찾을 수 없습니다.'}</p>
            <button className="button-primary" onClick={handleBack}>
              대시보드로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="project-detail-layout">
      <Sidebar />

      <main className="project-detail-main">
        <div className="project-detail-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            대시보드로 돌아가기
          </button>
          
          <div className="project-title-section">
            <div className="project-title-row">
              <h1>My <span translate="no">DeepGL</span> Session</h1>
              <DeepglLogo size={40} onClick={() => setShowAnalysisPopup(true)} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>{project.company} / {project.jobTitle}</h2>
            <p className="project-detail-subtitle">
              주제별로 자기소개서를 관리하세요 · {project.questions?.length || 0}개 문항
            </p>
          </div>

          {(analysisStatus === 'analyzing' || analysisStatus === 'pending') && (
            <div style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1D1D1F' }}>
                AI 분석 진행 중 ({analysisSteps.filter(s => s.status === 'done').length}/7)
                                </span>
                <span style={{ fontSize: '12px', color: '#86868B' }}>
                  {currentStep > 0 && currentStep <= 6 ? analysisSteps[currentStep - 1]?.label : '준비 중...'}
                </span>
              </div>

              {/* 진행률 바 */}
              <div style={{
                width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)',
                borderRadius: '3px', overflow: 'hidden', marginBottom: '16px'
              }}>
                <div style={{
                  width: `${(analysisSteps.filter(s => s.status === 'done').length / 7) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #007AFF, #5856D6)',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }} />
              </div>

              {/* 스텝 리스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analysisSteps.map((s) => (
                  <div key={s.step} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '6px 0',
                    opacity: s.status === 'pending' ? 0.4 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    {/* 상태 아이콘 */}
                    <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.status === 'done' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="#34C759"/>
                          <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {s.status === 'loading' && (
                        <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                      )}
                      {s.status === 'failed' && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="#FF3B30"/>
                          <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                      {s.status === 'pending' && (
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          border: '1.5px solid rgba(0,0,0,0.15)'
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: s.status === 'loading' ? 600 : 400,
                      color: s.status === 'failed' ? '#FF3B30' : s.status === 'loading' ? '#007AFF' : '#1D1D1F'
                    }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* 실패 시 재시도 버튼 */}
              {failedStep && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#FF3B30' }}>
                    {analysisSteps[failedStep - 1]?.label} 단계에서 오류가 발생했습니다
                  </span>
                  <button
                    onClick={handleRetryAnalysis}
                    style={{
                      padding: '8px 16px',
                      background: '#007AFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    이어서 재시도
                  </button>
                </div>
              )}
            </div>
          )}

          {analysisStatus === 'failed' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px',
              background: 'rgba(255, 59, 48, 0.1)',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#FF3B30', fontSize: '14px' }}>분석에 실패했습니다.</span>
              <button
                onClick={handleRetryAnalysis}
                style={{
                  padding: '6px 12px', background: '#FF3B30', color: 'white',
                  border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                }}
              >
                처음부터 다시 시도
              </button>
            </div>
          )}

        
        </div>

        <div className="questions-grid">
          {project.questions && project.questions.length > 0 ? (
            project.questions.map((question, index) => {
              const isDisabled = analysisStatus !== 'analyzed';
              return (
                <div 
                  key={question.id} 
                  className={`question-card ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => handleQuestionClick(question.id)}
                  style={{
                    position: 'relative',
                    opacity: isDisabled ? 0.6 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                >
                  <h3 className="question-title">{question.text}</h3>
                  {isDisabled && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(134, 134, 139, 0.9)',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>분석 대기 중</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-questions">
              <p>등록된 문항이 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {showAnalysisPopup && (
        <>
          <div className="modal-overlay" onClick={() => setShowAnalysisPopup(false)} />
          <div className="modal analysis-popup">
            <div className="modal-header">
              <span>사전 분석</span>
              <button className="modal-close" onClick={() => setShowAnalysisPopup(false)}>×</button>
            </div>
            <div className="modal-content" style={{ padding: '24px' }}>
              {project.overallStrategy ? (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#1D1D1F', margin: '0 0 16px 0' }}>
                      {project.overallStrategy.coreMessage}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(74, 85, 104, 0.1)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#4A5568'
                      }}>
                        {project.overallStrategy.talentProfile}
                      </span>
                      <span style={{
                        padding: '6px 12px',
                        background: 'rgba(74, 85, 104, 0.1)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#4A5568'
                      }}>
                        {project.overallStrategy.coreCompetency}
                      </span>
                    </div>
                  </div>
                  
                  {project.overallStrategy.questions && project.overallStrategy.questions.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#86868B', margin: '0 0 12px 0' }}>
                        문항별 전략
                      </h4>
                      {project.overallStrategy.questions.map((q, i) => (
                        <div key={i} style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '12px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              background: '#4A5568',
                              color: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {q.index}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1D1D1F' }}>
                              {q.type}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#1D1D1F', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                            {q.direction}
                          </p>
                          <p style={{ fontSize: '13px', color: '#86868B', margin: 0 }}>
                            {q.experienceName} · {q.experienceCompany}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: '#86868B', margin: 0 }}>아직 분석이 완료되지 않았습니다.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetailPage;