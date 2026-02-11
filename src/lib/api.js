// src/lib/api.js
import { supabase } from './supabaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://youngsun-xi.vercel.app';

// ============================================
// 인증 토큰 가져오기
// ============================================

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
};

// ============================================
// 인증 포함 fetch (직접 fetch 쓰는 곳에서 사용)
// ============================================
export const authFetch = async (url, options = {}) => {
  const authHeaders = await getAuthHeaders();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders
    }
  });
};

// ============================================
// 공통 API 호출 함수
// ============================================

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const authHeaders = await getAuthHeaders();
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.code = errorData.code || null;
    err.balance = errorData.balance ?? null;
    err.required = errorData.required ?? null;
    if (response.status === 402) {
      window.dispatchEvent(new CustomEvent('dglc-insufficient', {
        detail: { balance: errorData.balance, required: errorData.required, code: errorData.code, message: errorData.error }
      }));
    }
    throw err;
  }
  
  return response.json();
};

// ============================================
// 이력서 API
// ============================================

export const resumeApi = {
  // 이력서 업로드
  upload: async (userId, file, versionName = 'v1') => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', userId);
    formData.append('versionName', versionName);
    
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: { ...authHeaders },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || 'Upload failed');
    }
    
    return response.json();
  },
  
  // 이력서 목록 조회
  getList: async (userId) => {
    return apiCall(`/resumes?userId=${userId}`);
  },
  
  // 이력서 상세 조회
  getOne: async (resumeId, userId) => {
    return apiCall(`/resumes/${resumeId}?userId=${userId}`);
  },
  
// 이력서 삭제
delete: async (resumeId, userId) => {
  return apiCall(`/resumes/${resumeId}?userId=${userId}`, 'DELETE');
},

// 이력서 수정
update: async (resumeId, userId, updates) => {
  return apiCall(`/resumes/${resumeId}`, 'PATCH', { userId, ...updates });
}
};

// ============================================
// 프로젝트 API
// ============================================

export const projectApi = {
  // 프로젝트 생성
  create: async (userId, projectData) => {
    return apiCall('/projects', 'POST', {
      userId,
      company: projectData.company,
      jobTitle: projectData.jobTitle,
      jobTasks: projectData.jobTasks || '',
      jobRequirements: projectData.jobRequirements || '',
      jobPostingRaw: projectData.jobPostingRaw || '',
      questions: projectData.questions, // [{text, wordLimit}, ...]
      resumeId: projectData.resumeId || null
    });
  },
  
  // 프로젝트 목록 조회
  getList: async (userId) => {
    return apiCall(`/projects?userId=${userId}`);
  },
  
  // 프로젝트 상세 조회
  getOne: async (projectId, userId) => {
    return apiCall(`/projects/${projectId}?userId=${userId}`);
  },
  
  // 프로젝트 삭제
  delete: async (projectId, userId) => {
    return apiCall(`/projects/${projectId}?userId=${userId}`, 'DELETE');
  },
  
  // 프로젝트 수정
  update: async (projectId, userId, updates) => {
    return apiCall(`/projects/${projectId}`, 'PATCH', { userId, ...updates });
  },
  
  // 전체 전략 분석 실행
  initAnalysis: async (projectId, userId) => {
    return apiCall(`/projects/${projectId}/init-analysis`, 'POST', { userId });
  },
  
  // 문항 상태 업데이트
  updateQuestionStatus: async (projectId, questionId, userId, updates) => {
    return apiCall(`/projects/${projectId}/questions/${questionId}`, 'PATCH', {
      userId,
      ...updates
    });
  },
  
  // NEW: 프로젝트 분석 상태 조회
  getAnalysisStatus: async (projectId, userId) => {
    return apiCall(`/projects/${projectId}/analysis-status?userId=${userId}`);
  },
  
  // NEW: 문항별 suggest-direction 조회 (DB에서 즉시 로드)
  getQuestionDirection: async (projectId, questionId, userId) => {
    return apiCall(`/projects/${projectId}/questions/${questionId}/direction?userId=${userId}`);
  }
};

// ============================================
// 기존 딥글 플로우 API (projectId, questionId 추가)
// ============================================

export const deepglApi = {
  // 사전 분석
  preAnalyze: async (data) => {
    return apiCall('/pre-analyze', 'POST', {
      company: data.company,
      jobTitle: data.jobTitle,
      jobTasks: data.jobTasks,
      jobRequirements: data.jobRequirements,
      questions: data.questions,
      wordLimit: data.wordLimit,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 이력서 분석
  analyzeAll: async (data) => {
    const formData = new FormData();
    formData.append('preAnalysisId', data.preAnalysisId);
    formData.append('resume', data.resumeFile);
    if (data.projectId) formData.append('projectId', data.projectId);
    if (data.questionId) formData.append('questionId', data.questionId);
    
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/analyze-all`, {
      method: 'POST',
      headers: { ...authHeaders },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || 'Analysis failed');
    }
    
    return response.json();
  },
  
  // 경험 카드 제안
  suggestDirection: async (data) => {
    return apiCall('/suggest-direction', 'POST', {
      resumeId: data.resumeId,
      analysisId: data.analysisId,
      currentStep: data.currentStep,
      questionTopics: data.questionTopics,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 질문 생성
  generateQuestion: async (data) => {
    return apiCall('/generate-question', 'POST', {
      resumeId: data.resumeId,
      analysisId: data.analysisId,
      analysisData: data.analysisData,
      previousAnswer: data.previousAnswer || '',
      selectedExperienceIndices: data.selectedExperienceIndices,
      chatHistory: data.chatHistory,
      questionTopics: data.questionTopics,
      topicIndex: data.topicIndex,
      step: data.step,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 에피소드 생성
  generateEpisode: async (data) => {
    return apiCall('/generate-episode', 'POST', {
      resumeId: data.resumeId,
      analysisId: data.analysisId,
      chatHistory: data.chatHistory,
      questionTopics: data.questionTopics,
      currentTopic: data.currentTopic,
      selectedExperienceIndices: data.selectedExperienceIndices,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 계획서 생성
  generatePlan: async (data) => {
    return apiCall('/generate-plan', 'POST', {
      resumeId: data.resumeId,
      analysisId: data.analysisId,
      companyInfo: data.companyInfo,
      chatHistory: data.chatHistory,
      questionTopics: data.questionTopics,
      summarizedEpisodes: data.summarizedEpisodes,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 자소서 생성
  generateCoverLetter: async (data) => {
    return apiCall('/generate-cover-letter', 'POST', {
      plan: data.plan,
      projectId: data.projectId,
      questionId: data.questionId
    });
  },
  
  // 자소서 첨삭
  editCoverLetter: async (data) => {
    return apiCall('/edit-cover-letter', 'POST', {
      paragraphs: data.paragraphs,
      plan: data.plan,
      projectId: data.projectId,
      questionId: data.questionId
    });
  }
};

export const membershipApi = {
  recordInquiry: async (userId) => {
    return apiCall('/membership-inquiries', 'POST', { userId });
  }
};

export default { resumeApi, projectApi, deepglApi, membershipApi };