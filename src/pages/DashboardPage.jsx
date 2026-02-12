import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectApi, resumeApi, membershipApi } from '../lib/api';
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

// 알림 권한 요청
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }
  return Notification.permission;
};
const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showMembershipInfo, setShowMembershipInfo] = useState(false);
      const [resumes, setResumes] = useState([]);

  const { userId, email, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const [projectsData, resumesData] = await Promise.all([
          projectApi.getList(userId),
          resumeApi.getList(userId)
        ]);
        setProjects(projectsData.projects || []);
        setResumes(resumesData.resumes || []);
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

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await projectApi.delete(projectId, userId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('삭제에 실패했습니다.');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': '초안',
      'analyzing': '분석 중',
      'analyzed': '분석 완료',
      'in_progress': '진행 중',
      'done': '완료'
    };
    return statusMap[status] || '진행 중';
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
        <h1>My <span translate="no">DeepGL</span></h1>
                  <p className="dashboard-subtitle">자기소개서 프로젝트를 관리하세요</p>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>프로젝트 불러오는 중...</p>
          </div>
        ) : (
          <div className="project-grid">
            <div
              className="project-card new-project-card"
              onClick={() => {
                setShowNewProjectModal(true);
              }}            >
              <div className="new-project-logo">
                <svg width="80" height="80" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="newProjectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="80" fill="url(#newProjectGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
                  <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                  <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
                </svg>
                <div className="pulse-ring pulse-ring-1"></div>
                <div className="pulse-ring pulse-ring-2"></div>
                <div className="pulse-ring pulse-ring-3"></div>
              </div>
              <span className="new-project-text">새 딥글</span>
            </div>

            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-card-header">
                  <h3 className="project-title">{project.company} / {project.jobTitle}</h3>
                  <button
                    className="project-delete-btn"
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
             
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewProjectModal && (
      <NewProjectModal
      email={email}
       userId={userId}
       resumes={resumes}
       onClose={() => setShowNewProjectModal(false)}
       onRateLimit={() => {
        setShowNewProjectModal(false);
      }}
       onCreated={(newProject) => {
            setProjects([...projects, newProject]);
            setShowNewProjectModal(false);
            navigate(`/project/${newProject.id}`);
          }}
        />
      )}

   
    </div>
  );
};
// 새 프로젝트 생성 모달
const ANALYSIS_STEP_LABELS = ['공고 분석', '문항 분석', '역량 모델링', '이력서 매칭', '경험 카드 생성', '방향성 확정'];

const NewProjectModal = ({ userId, email, resumes, onClose, onRateLimit, onCreated }) => {
  const [step, setStep] = useState(1); // 1: 입력, 2: 분석 중
  const [loadingMessage, setLoadingMessage] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    jobTasks: '',
    jobRequirements: '',
    jobPostingRaw: '',
    resumeId: '',
    questions: [{ text: '', wordLimit: '1000' }]
  });
  
  const [error, setError] = useState('');

  // 6단계 진행률 state
  const [analysisSteps, setAnalysisSteps] = useState(
    ANALYSIS_STEP_LABELS.map((label, i) => ({ step: i + 1, label, status: 'pending' }))
  );
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [failedStep, setFailedStep] = useState(null);
  const [createdProject, setCreatedProject] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { text: '', wordLimit: '1000' }]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // 6단계 순차 실행
  const runAnalysisSteps = async (projectId, startFrom = 1) => {
    setFailedStep(null);
    setAnalysisSteps(prev => prev.map((s, i) => ({
      ...s,
      status: i + 1 < startFrom ? 'done' : 'pending'
    })));

    for (let stepNum = startFrom; stepNum <= 6; stepNum++) {
      setCurrentAnalysisStep(stepNum);
      setAnalysisSteps(prev => prev.map((s, i) =>
        i + 1 === stepNum ? { ...s, status: 'loading' } : s
      ));
      setLoadingMessage(ANALYSIS_STEP_LABELS[stepNum - 1]);
      try {
        const stepResult = await projectApi.analysisStep(projectId, userId, stepNum);
        setAnalysisSteps(prev => prev.map((s, i) =>
          i + 1 === stepNum ? { ...s, status: 'done' } : s
        ));
        // step6 응답에서 reuseAvailable 저장
        if (stepNum === 6 && stepResult) {
          stepResult._reuseAvailable = stepResult.reuseAvailable || false;
          window.__lastStep6Result = stepResult;
        }
      } catch (err) {
        console.error(`분석 스텝 ${stepNum} 실패:`, err);
        setAnalysisSteps(prev => prev.map((s, i) =>
          i + 1 === stepNum ? { ...s, status: 'failed' } : s
        ));
        setFailedStep(stepNum);
        return; // 실패 시 중단
      }
    }
    // 전체 완료
    const reuseAvailable = window.__lastStep6Result?.reuseAvailable || false;
    const reuseMsg = reuseAvailable ? ' (재활용 가능한 경험이 있습니다!)' : '';
    setLoadingMessage('분석 완료!' + reuseMsg);
    sendNotification(
      '딥글 세션이 생성되었어요',
      `${formData.company} / ${formData.jobTitle} 분석이 완료되었습니다.${reuseMsg}`
    );
    setTimeout(() => {
      onCreated(createdProject || { id: projectId });
    }, 800);

  }
  const handleRetryStep = () => {
    if (failedStep && createdProject) {
      runAnalysisSteps(createdProject.id, failedStep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.jobTitle) {
      setError('회사명과 직무명은 필수입니다.');
      return;
    }
    if (formData.questions.some(q => !q.text)) {
      setError('모든 문항을 입력해주세요.');
      return;
    }
    setError('');
    setStep(2);
    setLoadingMessage('프로젝트 생성 중...');
    
    try {
      // 1. 프로젝트 생성
      const result = await projectApi.create(userId, formData);
      
      if (!result.project) {
        throw new Error('프로젝트 생성 실패');
      }

      setCreatedProject(result.project);
      await requestNotificationPermission();

      // 2. 6단계 순차 분석 실행
      await runAnalysisSteps(result.project.id);
      
    } catch (err) {
      if (err.status === 429) {
        onRateLimit();
      } else {
        setError(err.message || '프로젝트 생성에 실패했습니다.');
        setStep(1);
      }
    }
  };
// 로딩 화면 (분석 중) - 6단계 진행률 버전
if (step === 2) {
  const doneCount = analysisSteps.filter(s => s.status === 'done').length;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '80px',
      right: 0,
      bottom: 0,
      background: '#FBFBFD',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '400px',
        padding: '0 24px'
      }}>
        {/* 로고 + 펄스링 */}
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
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#loadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
            <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
            <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
          </svg>
          <div className="pulse-ring pulse-ring-1"></div>
          <div className="pulse-ring pulse-ring-2"></div>
          <div className="pulse-ring pulse-ring-3"></div>
        </div>

        {/* 진행률 텍스트 */}
        <p style={{
          color: '#1F2937',
          fontSize: '20px',
          fontWeight: '700',
          margin: 0
        }}>AI 분석 진행 중 ({doneCount}/6)</p>

        {/* 진행률 바 */}
        <div style={{
          width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)',
          borderRadius: '3px', overflow: 'hidden'
        }}>
          <div style={{
            width: `${(doneCount / 6) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #007AFF, #5856D6)',
            borderRadius: '3px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        {/* 스텝 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {analysisSteps.map((s) => (
            <div key={s.step} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '8px 0',
              opacity: s.status === 'pending' ? 0.4 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.status === 'done' && (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#34C759"/>
                    <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {s.status === 'loading' && (
                  <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
                )}
                {s.status === 'failed' && (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#FF3B30"/>
                    <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                {s.status === 'pending' && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: '1.5px solid rgba(0,0,0,0.15)'
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '15px',
                fontWeight: s.status === 'loading' ? 600 : 400,
                color: s.status === 'failed' ? '#FF3B30' : s.status === 'loading' ? '#007AFF' : '#1D1D1F'
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* 실패 시 재시도 */}
        {failedStep && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '14px', color: '#FF3B30' }}>
              {analysisSteps[failedStep - 1]?.label} 단계에서 오류가 발생했습니다
            </span>
            <button
              onClick={handleRetryStep}
              style={{
                padding: '10px 24px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              이어서 재시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

return (
  <div style={{
    position: 'fixed',
    top: 0,
    left: '80px',
    right: 0,
    bottom: 0,
    background: '#FBFBFD',
    zIndex: 9999,
    overflowY: 'auto'
  }}>
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '48px 24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>새 딥글 만들기</h1>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#86868B'
          }}
        >×</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}

        <div className="form-row">
          <div className="input-group">
            <label>회사명 *</label>
            <input
              type="text"
              name="company"
              className="input-field"
              value={formData.company}
              onChange={handleChange}
              placeholder="삼성전자"
              required
            />
          </div>
          <div className="input-group">
            <label>직무명 *</label>
            <input
              type="text"
              name="jobTitle"
              className="input-field"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="SW개발"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>직무 내용</label>
          <textarea
            name="jobTasks"
            className="input-field textarea-field"
            value={formData.jobTasks}
            onChange={handleChange}
            placeholder="주요 업무 내용을 입력하세요"
            rows={3}
          />
        </div>

        <div className="input-group">
          <label>자격 요건</label>
          <textarea
            name="jobRequirements"
            className="input-field textarea-field"
            value={formData.jobRequirements}
            onChange={handleChange}
            placeholder="자격 요건을 입력하세요"
            rows={3}
          />
        </div>

        <div className="input-group">
          <label>이력서 선택</label>
          <select
            name="resumeId"
            className="input-field"
            value={formData.resumeId}
            onChange={handleChange}
          >
            <option value="">이력서를 선택하세요 (선택사항)</option>
            {resumes.map(resume => (
              <option key={resume.id} value={resume.id}>
                {resume.fileName} ({resume.versionName})
              </option>
            ))}
          </select>
        </div>

        <div className="questions-section">
          <label>자소서 문항 *</label>
          {formData.questions.map((q, index) => (
            <div key={index} className="question-row">
              <span className="question-number">{index + 1}</span>
              <input
                type="text"
                className="input-field question-input"
                value={q.text}
                onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                placeholder="자소서 문항을 입력하세요"
              />
              <input
                type="number"
                className="input-field word-limit-input"
                value={q.wordLimit}
                onChange={(e) => handleQuestionChange(index, 'wordLimit', e.target.value)}
                placeholder="글자수"
              />
              <span className="word-limit-suffix">자</span>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  className="remove-question-btn"
                  onClick={() => removeQuestion(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        <button type="button" className="add-question-btn" onClick={addQuestion}>
            + 문항 추가
          </button>
        </div>

            
           
        
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '32px'
        }}>
          <button type="button" className="button-secondary" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="button-primary">
            프로젝트 생성
          </button>
        </div>
      </form>
    </div>
  </div>
);
};
export default DashboardPage;