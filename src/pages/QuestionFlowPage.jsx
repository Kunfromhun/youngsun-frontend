import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectApi, authFetch } from '../lib/api';
import ReuseProposalModal from '../components/ReuseProposalModal';
import EpisodePreviewModal from '../components/EpisodePreviewModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

// 브라우저 알림 발송
const sendNotification = (title, body) => {
  const originalTitle = document.title;
  document.title = `✅ ${title}`;
  setTimeout(() => { document.title = originalTitle; }, 5000);
  
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/logo192.png',
      tag: 'deepgl-notification',
      requireInteraction: false,
    });
    notification.onclick = () => { window.focus(); notification.close(); };
    setTimeout(() => { notification.close(); }, 5000);
  }
};
const QuestionFlowPage = () => {
  const { projectId, questionId } = useParams();
  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);
  const [question, setQuestion] = useState(null);
  const [directionData, setDirectionData] = useState(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);
  
  // 재활용 관련 state
  const [reuseData, setReuseData] = useState(null);
  const [showReuseModal, setShowReuseModal] = useState(false);
  const [reuseLoading, setReuseLoading] = useState(false);
  const [generatedEpisode, setGeneratedEpisode] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!projectId || !questionId || !userId) return;

      try {
        setLoading(true);

        // 1. 프로젝트 정보 로드
        const projectData = await projectApi.getOne(projectId, userId);
        setProject(projectData.project);
        
        const currentQuestion = projectData.questions?.find(q => q.id === questionId);
        if (!currentQuestion) {
          throw new Error('문항을 찾을 수 없습니다.');
        }
        setQuestion(currentQuestion);

        // 2. DB에서 이미 생성된 suggest-direction 즉시 로드
        const directionResult = await projectApi.getQuestionDirection(projectId, questionId, userId);

        if (!directionResult.suggest_direction) {
          throw new Error('방향 제안 데이터가 없습니다.');
        }

        setDirectionData({
          cards: directionResult.suggest_direction.cards || [],
          assignedExperiences: directionResult.assigned_experiences,
          competencyProfile: directionResult.competency_profile
        });

// 3. question.status로 재활용 여부 판단
if (currentQuestion.status === 'reuse_pending') {
  const reuseInfo = currentQuestion.reuse_info || projectData.project.reuse_info || {};
  setReuseData({
    companyName: projectData.project.company,
    selectedChains: reuseInfo.selectedChains || [],
    globalStrategy: reuseInfo.globalStrategy || {},
    targetCompany: projectData.project.company
  });
  setShowReuseModal(true);
}
// status === 'direction'이면 기존 플로우 (경험카드 선택 화면 표시)

      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, questionId, userId]);

  // 대시보드로 이동
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // 프로젝트로 돌아가기
  const handleBack = () => {
    navigate(`/project/${projectId}`);
  };

  // 로그아웃
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // 경험 선택
  const handleExperienceSelect = (index) => {
    setSelectedExperienceIndex(index);
  };

  // 경험 확정 후 채팅 플로우로 이동
  const handleConfirmExperience = async () => {
    if (selectedExperienceIndex === null) {
      alert('경험을 선택해주세요.');
      return;
    }

    const selectedCard = directionData.cards[selectedExperienceIndex];

    try {
      await projectApi.updateQuestionStatus(projectId, questionId, userId, {
        selectedExperienceIndex: selectedExperienceIndex,
        status: 'qa'
      });
    } catch (err) {
      console.error('인덱스 저장 실패:', err);
    }

    localStorage.setItem('deepgl_selected_experience', JSON.stringify({
      projectId: projectId,
      questionId: questionId,
      userId: userId,
      selectedCard,
      selectedIndex: selectedExperienceIndex,
      resumeId: project.resumeId,
      analysisId: project.analysisId,
      selectedExperiences: directionData.cards,
      questionTopics: [question.text],    
      companyInfo: {
        company: project.company,
        jobTitle: project.jobTitle,
        jobTasks: project.jobTasks || '',
        jobRequirements: project.jobRequirements || ''
      },
      talentProfile: directionData.competencyProfile?.talentProfile || '',
      coreCompetency: directionData.competencyProfile?.coreCompetency || ''
    }));

    navigate(`/?flow=experience-extraction&projectId=${projectId}&questionId=${questionId}`);
  };
  const handleReuseConfirm = async () => {
    setReuseLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/generate-reuse-episode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          projectId,
          questionId,
          episodeId: reuseData.selectedEpisode?.episodeId || reuseData.questionChains?.[questionId]?.selectedEpisode?.episodeId,
          globalStrategy: reuseData.globalStrategy,
          jobPosting: {
            company: project.company,
            jobTitle: project.jobTitle,
            jobTasks: project.jobTasks || '',
            jobRequirements: project.jobRequirements || ''
          },
          targetQuestion: question.text
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.episode) {
        setGeneratedEpisode({
          content: result.episode,
          talentProfile: reuseData.globalStrategy?.talentProfile,
          coreCompetency: reuseData.globalStrategy?.coreCompetency,
          metadata: result.metadata
        });
        sendNotification('에피소드 재구성 완료', '기존 경험을 바탕으로 에피소드가 생성되었습니다.');
        setShowReuseModal(false);
        setShowPreviewModal(true);
      
      } else {
        throw new Error(result.error || '에피소드 생성 실패');
      }
    } catch (err) {
      console.error('재활용 에피소드 생성 실패:', err);
      setError('에피소드 생성에 실패했습니다.');
      setShowReuseModal(false);
    } finally {
      setReuseLoading(false);
    }
  };

const handleReuseReject = async () => {
  // 백엔드에 status를 direction으로 변경
  try {
    await authFetch(`${API_BASE_URL}/api/projects/${projectId}/questions/${questionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        status: 'direction'
      })
    });
  } catch (err) {
    console.error('상태 변경 실패:', err);
  }
  // question status를 direction으로 변경하여 경험카드 선택 화면 표시
  setQuestion(prev => ({ ...prev, status: 'direction' }));
  setShowReuseModal(false);
  setReuseData(null);
};
  // 미리보기에서 "이대로 사용할게요" 클릭
  const handlePreviewConfirm = () => {
    localStorage.setItem('deepgl_reused_episode', JSON.stringify({
      projectId,
      questionId,
      episode: generatedEpisode,
      companyInfo: {
        company: project.company,
        jobTitle: project.jobTitle
      },
      resumeId: project.resumeId,
      analysisId: project.analysisId,
      talentProfile: reuseData?.globalStrategy?.talentProfile || '',
      coreCompetency: reuseData?.globalStrategy?.coreCompetency || '',
      questionText: question.text
    }));
    navigate(`/?flow=reused-episode&projectId=${projectId}&questionId=${questionId}`);
  };

  // 미리보기에서 "수정이 필요해요" 클릭
  const handlePreviewEdit = () => {
    setShowPreviewModal(false);
  };

  // 사이드바 컴포넌트
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
      <button className="sidebar-logout" onClick={handleGoToDashboard} title="대시보드">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </aside>
  );

  // 로딩 화면
  if (loading) {
    return (
      <div className="project-detail-layout">
        <Sidebar />
        <main className="project-detail-main">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '400px'
          }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '16px', color: '#86868B' }}>데이터 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div className="project-detail-layout">
        <Sidebar />
        <main className="project-detail-main">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '400px',
            gap: '16px'
          }}>
            <p style={{ color: '#FF3B30' }}>{error}</p>
            <button className="button-primary" onClick={handleBack}>
              프로젝트로 돌아가기
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
        {/* 헤더 */}
        <div className="project-detail-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            프로젝트로 돌아가기
          </button>

          <div className="project-title-section">
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', marginBottom: '8px' }}>
              {question?.text}
            </h1>
            <p className="project-detail-subtitle">
              {project?.company} / {project?.jobTitle} • {question?.wordLimit || 1000}자
            </p>
          </div>
        </div>

        {/* 방향성 선택 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
            경험 선택
          </h2>
          <p style={{ color: '#86868B', fontSize: '14px' }}>
            자소서에 활용할 경험을 선택하세요. AI가 분석한 적합도를 참고하세요.
          </p>
        </div>

        {/* 경험 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {directionData?.cards?.map((card, index) => {
            const isSelected = selectedExperienceIndex === index;
            const isPrimary = directionData.assignedExperiences?.primary?.index === index;
            
            return (
              <div
                key={index}
                onClick={() => handleExperienceSelect(index)}
                style={{
                  padding: '24px',
                  background: isSelected ? 'rgba(0, 122, 255, 0.05)' : 'white',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {isPrimary && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: '#007AFF',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    추천
                  </span>
                )}

                <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
                  {card.company || card.name || `경험 ${index + 1}`}
                </h3>
                
                <p style={{ fontSize: '14px', color: '#86868B', marginBottom: '16px', lineHeight: '1.5' }}>
                  {card.description || card.summary}
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#1D1D1F' }}>
                    <strong>주제:</strong> {card.topic}
                  </p>
                  <p style={{ fontSize: '13px', color: '#1D1D1F' }}>
                    <strong>핵심역량:</strong> {card.competency}
                  </p>
                </div>

                {card.whySelected && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px',
                    marginTop: '12px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#86868B', marginBottom: '4px' }}>딥글 분석</p>
                    <p style={{ fontSize: '13px', color: '#1D1D1F', lineHeight: '1.4' }}>
                      {card.whySelected['주제-경험'] || card.whySelected['역량-경험'] || card.integratedAnalysis}
                    </p>
                  </div>
                )}

                {card.score && (
                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: '13px',
                      color: '#007AFF',
                      fontWeight: '600'
                    }}>
                      적합도 {Math.round(card.score * 100)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          paddingBottom: '40px'
        }}>
          <button
            onClick={handleBack}
            className="button-secondary"
            style={{
              padding: '14px 32px',
              fontSize: '16px'
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirmExperience}
            disabled={selectedExperienceIndex === null}
            className="button-primary"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              opacity: selectedExperienceIndex !== null ? 1 : 0.5,
              cursor: selectedExperienceIndex !== null ? 'pointer' : 'not-allowed'
            }}
          >
            경험 구체화하러 가기
          </button>
        </div>
      </main>
   
      <ReuseProposalModal
        isOpen={showReuseModal}
        onClose={() => setShowReuseModal(false)}
        onConfirm={handleReuseConfirm}
        onReject={handleReuseReject}
        companyName={reuseData?.companyName}
        selectedChains={reuseData?.selectedChains || []}
        globalStrategy={reuseData?.globalStrategy || {}}
        targetCompany={reuseData?.targetCompany}
        loading={reuseLoading}
      />

      {/* 에피소드 미리보기 모달 */}
      <EpisodePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={handlePreviewConfirm}
        onEdit={handlePreviewEdit}
        episode={generatedEpisode}
      />
    </div>
  );
};

export default QuestionFlowPage;