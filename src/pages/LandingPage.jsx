import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalFooter from './GlobalFooter';

const LandingPage = () => {
  const navigate = useNavigate();
  const qnaSectionRef = useRef(null);
  const dbSectionRef = useRef(null);
  const autoIntervalRef = useRef(null);
  const [currentMockup, setCurrentMockup] = useState('mockup-split');
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [dbLit, setDbLit] = useState([false, false, false, false]);
  const genSectionRef = useRef(null);
  const genIntervalRef = useRef(null);
  const [activeGenIndex, setActiveGenIndex] = useState(0);
  const [currentGenPanel, setCurrentGenPanel] = useState('panel-plan');

  const genData = [
    { target: 'panel-plan', text: '계획도 딥글이,' },
    { target: 'panel-write', text: '작성도 딥글이,' },
    { target: 'panel-edit', text: '첨삭도 딥글이.' },
  ];
  const genCaptions = {
    'panel-plan': '초기분석의 데이터와 세션별로 진행했던 에피소드를 기반으로, 딥글은 자소서의 문단별 생성 계획서를 기획합니다.',
    'panel-write': '계획서를 바탕으로 자소서가 문단별로 생성됩니다. 문단을 클릭하여 직접 수정할 수 있습니다.',
    'panel-edit': '첨삭을 통해 가독성을 높이고 내용을 강화합니다. 완료 후 원본과 비교하며 직접 수정할 수 있습니다.',
  };

  const switchGenPanel = useCallback((targetId, index) => {
    setCurrentGenPanel(targetId);
    setActiveGenIndex(index);
  }, []);
  const qnaData = [
    { target: 'mockup-split', text: '답변도 나눠서 편하게,' },
    { target: 'mockup-choice', text: '객관식으로 더 편하게,' },
    { target: 'mockup-edit', text: '질문이나 보기도 편하게 수정하고,' },
    { target: 'mockup-refresh', text: '새로고침해도 알맞게 구체화되니까.' },
  ];

  const qnaCaptions = {
    'mockup-split': '메인 질문은 STAR 구조에 따라 네 단계로 나뉘어 답변할 수 있습니다. 딥글은 선택된 답변을 바탕으로 질문에 대한 하나의 답변을 생성하고, 사용자는 입력창에서 이를 자유롭게 다듬을 수 있습니다.',
    'mockup-choice': '객관식으로 진행할 수 있어 막막할 때도 쉽게 답변할 수 있습니다. 선택지들을 딥글이 분석하여 줄글로된 답변으로 생성합니다.',
    'mockup-edit': '질문이나 선택지에 미세한 오류가 있다면 직접 수정할 수 있습니다. 질문과 보기 자체를 교체하고 싶다면 재생성하여 자신에게 맞는 질문을 찾아갈 수 있고, 입력창에 딥글이 생성한 줄글의 답변도 수정할 수 있습니다.',
    'mockup-refresh': ' 메인 질문이 어렵게 느껴질 경우, 질문을 다시 생성해 상황을 새로 설정할 수 있습니다. 이에 맞춰 모든 STAR 질문도 함께 재구성되며, 이러한 재생성 기능은 횟수 제한 없이 사용할 수 있습니다. 사용자는 부담 없이 질문을 조정하며 자신에게 가장 적합한 결과를 찾아갈 수 있습니다.',
  };

 // Scroll reveal
 useEffect(() => {
    let observer;
    const timer = setTimeout(() => {
      const reveals = document.querySelectorAll('.lp-reveal');
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('lp-visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => observer.observe(el));
    }, 100);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  // QNA auto-switch
  const switchMockup = useCallback((targetId, index) => {
    setCurrentMockup(targetId);
    setActiveLineIndex(index);
  }, []);

  useEffect(() => {
    const qnaEl = qnaSectionRef.current;
    if (!qnaEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let idx = 0;
            switchMockup(qnaData[0].target, 0);
            autoIntervalRef.current = setInterval(() => {
              idx = (idx + 1) % qnaData.length;
              switchMockup(qnaData[idx].target, idx);
            }, 2500);
          } else {
            if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(qnaEl);
    return () => {
      observer.disconnect();
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [switchMockup]);

  // Database progressive lighting
  useEffect(() => {
    const dbEl = dbSectionRef.current;
    if (!dbEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2, 3].forEach((i) => {
              setTimeout(() => {
                setDbLit((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * 500 + 400);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(dbEl);
    return () => observer.disconnect();
  }, []);

  // Generation section auto-switch
  useEffect(() => {
    const genEl = genSectionRef.current;
    if (!genEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let idx = 0;
            switchGenPanel(genData[0].target, 0);
            genIntervalRef.current = setInterval(() => {
              idx = (idx + 1) % genData.length;
              switchGenPanel(genData[idx].target, idx);
            }, 4500);
                    } else {
            if (genIntervalRef.current) clearInterval(genIntervalRef.current);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(genEl);
    return () => {
      observer.disconnect();
      if (genIntervalRef.current) clearInterval(genIntervalRef.current);
    };
  }, [switchGenPanel]);
  const EditAnimationText = ({ isActive }) => {
    const oldText = '팀원별 업무 진척도';
    const newText = '학생별 프로젝트 진행률';
    const [phase, setPhase] = useState('idle');
    const [deleteCount, setDeleteCount] = useState(0);
    const [typeCount, setTypeCount] = useState(0);

    useEffect(() => {
      if (!isActive) {
        setPhase('idle');
        setDeleteCount(0);
        setTypeCount(0);
        return;
      }
      const startTimer = setTimeout(() => setPhase('deleting'), 800);
      return () => clearTimeout(startTimer);
    }, [isActive]);

    useEffect(() => {
      if (phase === 'deleting') {
        if (deleteCount < oldText.length) {
          const t = setTimeout(() => setDeleteCount(prev => prev + 1), 60);
          return () => clearTimeout(t);
        } else {
          setPhase('typing');
        }
      }
      if (phase === 'typing') {
        if (typeCount < newText.length) {
          const t = setTimeout(() => setTypeCount(prev => prev + 1), 50);
          return () => clearTimeout(t);
        } else {
          setPhase('done');
        }
      }
    }, [phase, deleteCount, typeCount, oldText.length, newText.length]);

    const cursor = <span className="lp-mock-edit-cursor">|</span>;

    if (phase === 'idle') {
      return <span>{oldText}{cursor}</span>;
    }
    if (phase === 'deleting') {
      return <span>{oldText.slice(0, oldText.length - deleteCount)}{cursor}</span>;
    }
    if (phase === 'done') {
      return <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{newText}</span>;
    }
    return <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{newText.slice(0, typeCount)}{cursor}</span>;
  };
  // 자동번역 차단 + 다크모드 차단
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('translate', 'no');
    html.classList.add('notranslate');
    html.setAttribute('lang', 'ko');

    // 다크모드 차단: color-scheme 강제 light
    const meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light only';
    document.head.appendChild(meta);

    // Google Translate 차단 meta
    const noTranslateMeta = document.createElement('meta');
    noTranslateMeta.name = 'google';
    noTranslateMeta.content = 'notranslate';
    document.head.appendChild(noTranslateMeta);

    document.body.style.colorScheme = 'light only';

    return () => {
      html.removeAttribute('translate');
      html.classList.remove('notranslate');
      document.head.removeChild(meta);
      document.head.removeChild(noTranslateMeta);
      document.body.style.colorScheme = '';
    };
  }, []);

  return (
    <>
      <style>{`
        .lp-root *, .lp-root *::before, .lp-root *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .lp-root {
          --bg: #FBFBFD;
          --surface: #FFFFFF;
          --text-1: #1D1D1F;
          --text-2: #6E6E73;
          --text-3: #86868B;
          --text-4: #AEAEB2;
          --border: rgba(0,0,0,0.06);
          --gray-dark: #4A5568;
          --gray-mid: #6B7280;
          --gray-light: #9CA3AF;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text-1);
          overflow-x: hidden;
          line-height: 1.4;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .lp-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 120px 48px;
        }

        /* REVEAL */
        .lp-reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .lp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .lp-d1 { transition-delay: 0.1s; }
        .lp-d2 { transition-delay: 0.25s; }
        .lp-d3 { transition-delay: 0.4s; }
        .lp-d4 { transition-delay: 0.55s; }
        .lp-d5 { transition-delay: 0.7s; }

        /* HERO */
        .lp-hero {
          min-height: 100vh;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding-top: 0;
        }
        .lp-hero::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 800px; height: 800px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(74,85,104,0.06) 0%, transparent 70%);
          pointer-events: none;
          animation: lpHeroGlow 8s ease-in-out infinite;
        }
        @keyframes lpHeroGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
        }

        .lp-hero-logo-wrap {
          position: relative;
          width: 160px; height: 160px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 32px;
        }
        .lp-hero-logo {
          opacity: 0;
          animation: lpHeroLogoIn 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
        }
        @keyframes lpHeroLogoIn {
          0% { opacity: 0; transform: scale(0.7) rotate(-180deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .lp-pulse-ring {
          position: absolute;
          width: 128px; height: 128px;
          border-radius: 50%;
          border: 1px solid rgba(107,114,128,0.3);
          animation: lpPulseRing 2.5s ease-out infinite;
        }
        .lp-pulse-ring-1 { animation-delay: 0s; }
        .lp-pulse-ring-2 { animation-delay: 0.8s; }
        .lp-pulse-ring-3 { animation-delay: 1.6s; }
        @keyframes lpPulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        .lp-hero-brand {
          display: flex; gap: 10px; margin-bottom: 24px;
          opacity: 0;
          animation: lpTextUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s forwards;
        }
        .lp-hero-letter {
          font-size: 28px; font-weight: 800; letter-spacing: 0.15em;
          background: linear-gradient(135deg, #4A5568, #2D3748);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
     .lp-hero-headline {
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800; line-height: 1.15; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 0;
          opacity: 0;
          animation: lpTextUp 1s cubic-bezier(0.16,1,0.3,1) 0.7s forwards;
      word-break: keep-all;
          cursor: pointer; user-select: none;
        }
        .lp-hero-headline .lp-headline-en,
        .lp-hero-headline .lp-headline-ko {
          transition: opacity 0.4s ease, transform 0.4s ease;
          display: block; text-align: center;
        }
        .lp-hero-headline .lp-headline-ko {
          position: absolute; top: 0; left: 0; right: 0;
          opacity: 0; transform: translateY(8px);
        }
        .lp-hero-headline:hover .lp-headline-en {
          opacity: 0; transform: translateY(-8px);
        }
        .lp-hero-headline:hover .lp-headline-ko {
          opacity: 1; transform: translateY(0);
        }
        .lp-login-btn {
          position: fixed;
          top: 24px;
          right: 32px;
          z-index: 100;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0,0,0,0.06);
          padding: 8px 18px;
          border-radius: 980px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
          opacity: 0;
          animation: lpTextUp 1s cubic-bezier(0.16,1,0.3,1) 1s forwards;
          font-family: inherit;
        }
        .lp-login-btn:hover {
          background: rgba(255,255,255,0.85);
          color: var(--text-1);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        @keyframes lpTextUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .lp-scroll-hint {
          position: absolute; bottom: 48px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0;
          opacity: 0;
          animation: lpTextUp 1s cubic-bezier(0.16,1,0.3,1) 1.4s forwards;
        }
        .lp-scroll-arrow {
          animation: lpScrollBounce 2s ease-in-out infinite;
          color: var(--text-4);
        }
        @keyframes lpScrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(10px); opacity: 1; }
        }

        /* PIPELINE */
        .lp-pipeline {
          background: var(--text-1); color: var(--surface);
          text-align: center; min-height: 100vh; padding: 120px 48px;
        }
        .lp-pipeline-headline {
          font-size: clamp(32px, 5.5vw, 60px);
          font-weight: 700; line-height: 1.2; letter-spacing: -0.025em;
          margin-bottom: 72px; word-break: keep-all;
        }
        .lp-pipeline-flow {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap; max-width: 1000px; margin: 0 auto;
        }
        .lp-pipeline-step {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .lp-pipeline-icon {
          width: 64px; height: 64px; border-radius: 16px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .lp-pipeline-icon svg { stroke: rgba(255,255,255,0.7); }
        .lp-pipeline-step:hover .lp-pipeline-icon {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .lp-pipeline-label {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.5); letter-spacing: 0.02em; white-space: nowrap;
        }
        .lp-pipeline-step:hover .lp-pipeline-label { color: rgba(255,255,255,0.85); }
        .lp-pipeline-arrow { padding: 0 4px; padding-bottom: 28px; flex-shrink: 0; }
        .lp-pipeline-arrow svg { stroke: rgba(255,255,255,0.2); }
        .lp-pipeline-desc {
          margin-top: 72px;
          font-size: clamp(15px, 2vw, 18px);
          color: rgba(255,255,255,0.45);
          font-weight: 400; line-height: 1.7; word-break: keep-all;
        }

        /* QNA */
        .lp-qna {
          min-height: 100vh; padding: 120px 48px;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-qna-layout {
          display: flex; align-items: center; justify-content: center;
          gap: 60px; max-width: 1000px; width: 100%; flex-wrap: wrap;
        }
        .lp-qna-text { flex: 1 1 280px; min-width: 260px; }
        .lp-qna-lines { margin-top: 24px; display: flex; flex-direction: column; gap: 0; }
        .lp-qna-line {
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 700; line-height: 1.5; letter-spacing: -0.02em;
          color: var(--text-4); cursor: pointer;
          padding: 12px 0; border-bottom: 1px solid var(--border);
          transition: color 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          word-break: keep-all;
        }
        .lp-qna-line:last-child { border-bottom: none; }
        .lp-qna-line.lp-active { color: var(--text-1); }

        .lp-qna-captions { margin-top: 20px; position: relative; min-height: 80px; }
        .lp-qna-caption {
          position: absolute; top: 0; left: 0; right: 0;
          font-size: 14px; color: var(--text-3); line-height: 1.7;
          opacity: 0; transform: translateY(8px);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none; word-break: keep-all;
        }
        .lp-qna-caption.lp-active {
          opacity: 1; transform: translateY(0); pointer-events: auto;
        }

        .lp-qna-mockup {
          flex: 1 1 400px; max-width: 520px; min-height: 400px; position: relative;
        }
        .lp-mockup-panel {
          position: absolute; top: 0; left: 0; right: 0;
          opacity: 0; transform: translateY(16px);
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 28px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .lp-mockup-panel.lp-active {
          opacity: 1; transform: translateY(0); pointer-events: auto;
        }

        .lp-mock-header { margin-bottom: 20px; }
        .lp-mock-logo { margin-bottom: 16px; display: flex; justify-content: center; }
        .lp-mock-question {
          font-size: 15px; font-weight: 500; color: var(--text-1);
          text-align: center; line-height: 1.6;
        }
        .lp-mock-star-badge {
          display: inline-block; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 6px;
          background: rgba(74,85,104,0.08); color: var(--gray-dark);
          margin-bottom: 10px; letter-spacing: 0.04em; text-align: center;
        }
        .lp-mock-question-sm {
          font-size: 14px; font-weight: 500; color: var(--text-2); line-height: 1.5;
        }
        .lp-mock-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 4px 12px; border-radius: 980px;
          background: rgba(74,85,104,0.08); color: var(--gray-dark);
          margin-bottom: 12px; letter-spacing: 0.02em;
        }
        .lp-mock-badge.lp-green {
          background: rgba(52,199,89,0.1); color: #34C759;
        }

        .lp-mock-split-cards { display: flex; gap: 12px; }
        .lp-mock-card {
          flex: 1; background: var(--bg); border: 1px solid var(--border);
          border-radius: 12px; padding: 16px;
        }
        .lp-mock-card-label { font-size: 11px; font-weight: 600; color: var(--text-4); margin-bottom: 8px; }
        .lp-mock-card-text {
          font-size: 13px; font-weight: 600; color: var(--text-1);
          margin-bottom: 12px; line-height: 1.4; word-break: keep-all;
        }
        .lp-mock-input-area {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 12px; min-height: 60px;
          font-size: 12px; color: var(--text-2); line-height: 1.5;
        }
        .lp-mock-input-area.lp-empty { background: var(--bg); }
        .lp-mock-typing { font-size: 12px; color: var(--text-2); line-height: 1.5; }

        .lp-mock-choices { display: flex; flex-direction: column; gap: 8px; }
        .lp-mock-choice {
          padding: 14px 16px; background: var(--bg); border: 1px solid var(--border);
          border-radius: 10px; font-size: 13px; color: var(--text-1);
          line-height: 1.5; transition: all 0.25s; word-break: keep-all;
        }
        .lp-mock-choice.lp-selected {
          background: rgba(74,85,104,0.06);
          border-color: rgba(74,85,104,0.2); font-weight: 600;
        }
        .lp-mock-choice.lp-editing {
          border-color: rgba(74,85,104,0.3);
          background: var(--surface); position: relative;
        }
        .lp-mock-edit-cursor {
          color: var(--gray-dark);
          animation: lpBlink 1s step-end infinite;
          font-weight: 300; margin-right: 1px;
        }
      @keyframes lpBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .lp-mock-edit-text-old {
          display: inline; position: relative;
        }
        .lp-mock-edit-text-old.lp-deleting span {
          display: inline-block;
          animation: lpCharDelete 0.06s forwards;
          animation-fill-mode: forwards;
        }
        @keyframes lpCharDelete {
          to { width: 0; overflow: hidden; opacity: 0; font-size: 0; margin: 0; padding: 0; }
        }
        .lp-mock-edit-text-new {
          display: inline; color: var(--text-1); font-weight: 600;
        }
        .lp-mock-edit-text-new span {
          display: inline-block; opacity: 0;
          animation: lpCharType 0.05s forwards;
        }
        @keyframes lpCharType {
          to { opacity: 1; }
        }
        .lp-mock-edit-icon {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); color: var(--text-4);
        }
        .lp-mock-choice.lp-fresh {
          animation: lpFadeInChoice 0.5s ease forwards; opacity: 0;
        }
        .lp-mock-choice.lp-fresh:nth-child(1) { animation-delay: 0.1s; }
        .lp-mock-choice.lp-fresh:nth-child(2) { animation-delay: 0.25s; }
        .lp-mock-choice.lp-fresh:nth-child(3) { animation-delay: 0.4s; }
        @keyframes lpFadeInChoice {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-mock-btn-row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
        .lp-mock-btn-ghost {
          font-size: 12px; font-weight: 500; color: var(--text-3);
          padding: 6px 14px; border: 1px solid var(--border); border-radius: 8px;
        }
        .lp-mock-btn-solid {
          font-size: 12px; font-weight: 600; color: var(--surface);
          background: var(--gray-dark); padding: 6px 14px; border-radius: 8px;
        }
        .lp-mock-edit-demo { display: flex; flex-direction: column; gap: 8px; }

        /* DATABASE */
        .lp-database {
          background: var(--text-1); color: var(--surface);
          min-height: 100vh; padding: 120px 48px;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-db-layout {
          display: flex; align-items: center; justify-content: center;
          gap: 72px; max-width: 1060px; width: 100%; flex-wrap: wrap;
        }
        .lp-db-mockup {
          flex: 1 1 440px; max-width: 480px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .lp-db-text { flex: 1 1 300px; min-width: 260px; }
        .lp-db-lines { margin-top: 24px; display: flex; flex-direction: column; gap: 0; }
        .lp-db-line {
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 700; line-height: 1.5; letter-spacing: -0.02em;
          color: rgba(255,255,255,0.3);
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
          word-break: keep-all;
          transition: color 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .lp-db-line:last-child { border-bottom: none; }
        .lp-db-line.lp-lit { color: rgba(255,255,255,0.95); }
        .lp-db-desc {
          margin-top: 24px; font-size: 14px; color: rgba(255,255,255,0.35);
          line-height: 1.8; word-break: keep-all;
        }

        .lp-db-mock-card {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;
        }
        .lp-db-mock-header { margin-bottom: 16px; }
        .lp-db-mock-company { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
        .lp-db-mock-sub { font-size: 12px; color: rgba(255,255,255,0.35); }
        .lp-db-mock-grid { display: flex; gap: 10px; }
        .lp-db-mock-item {
          flex: 1; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px;
        }
        .lp-db-mock-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 6px; word-break: keep-all; }
        .lp-db-mock-desc { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.4; margin-bottom: 8px; word-break: keep-all; }
        .lp-db-mock-date { font-size: 10px; color: rgba(255,255,255,0.2); }
        .lp-db-flow-arrow { padding: 4px 0; }

        .lp-db-mock-card.lp-proposal {
          background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1);
        }
        .lp-db-proposal-title { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 6px; text-align: center; }
        .lp-db-proposal-sub {
          font-size: 12px; color: rgba(255,255,255,0.4); text-align: center;
          margin-bottom: 20px; line-height: 1.5;
        }
        .lp-db-proposal-sub strong { color: rgba(255,255,255,0.8); font-weight: 700; }
        .lp-db-proposal-fields { display: flex; flex-direction: column; gap: 10px; }
        .lp-db-proposal-field {
          display: flex; flex-direction: column; gap: 4px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 12px 14px;
        }
        .lp-db-field-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 0.04em; }
        .lp-db-field-value { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); }

        /* FINAL */
        .lp-final {
          min-height: 100vh; text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 48px; padding: 120px 48px;
        }
        .lp-final-headline {
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 800; line-height: 1.3; letter-spacing: -0.03em;
          color: var(--text-3); word-break: keep-all;
        }
        .lp-final-accent { color: var(--text-1); }
        .lp-final-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 17px; font-weight: 600; color: var(--surface);
          background: var(--text-1); border: none;
          padding: 18px 44px; border-radius: 980px;
          cursor: pointer; text-decoration: none;
          transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .lp-final-cta:hover {
          background: var(--gray-dark); transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .lp-final-cta svg { transition: transform 0.3s; }
        .lp-final-cta:hover svg { transform: translateX(4px); }

        /* FOOTER */
.lp-footer {
          text-align: center; padding: 48px; border-top: 0.5px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .lp-footer p { font-size: 12px; color: var(--text-4); letter-spacing: 0.02em; }
        .lp-footer-links { display: flex; gap: 20px; }
        .lp-footer-links a {
          font-size: 12px; color: var(--text-4); text-decoration: none;
          transition: color 0.2s;
        }
        .lp-footer-links a:hover { color: var(--text-3); }

     .lp-section-label {
          font-size: 13px; font-weight: 600; letter-spacing: 0.08em;
          color: var(--text-4); margin-bottom: 0;
        }

      /* ANALYSIS */
        .lp-analysis {
          min-height: 100vh; padding: 120px 48px;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface);
        }
        .lp-analysis-layout {
          display: flex; flex-direction: column; align-items: center;
          max-width: 720px; width: 100%; text-align: center;
        }
        .lp-analysis-mockup {
          width: 280px; height: 280px; position: relative;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 48px;
        }
        .lp-analysis-logo {
          width: 100px; height: 100px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
        }
        .lp-analysis-ring {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(107,114,128,0.15);
          animation: analysisRotate 12s linear infinite;
        }
        .lp-analysis-ring-1 { width: 160px; height: 160px; }
        .lp-analysis-ring-2 { width: 220px; height: 220px; animation-direction: reverse; animation-duration: 18s; border-color: rgba(107,114,128,0.08); }
        .lp-analysis-ring-3 { width: 270px; height: 270px; animation-duration: 25s; border-color: rgba(107,114,128,0.04); }
        .lp-analysis-dot {
          position: absolute; width: 6px; height: 6px; border-radius: 50%;
          background: rgba(107,114,128,0.4);
        }
        .lp-analysis-ring-1 .lp-analysis-dot:nth-child(1) { top: -3px; left: 50%; transform: translateX(-50%); }
        .lp-analysis-ring-1 .lp-analysis-dot:nth-child(2) { bottom: -3px; left: 50%; transform: translateX(-50%); }
        .lp-analysis-ring-2 .lp-analysis-dot:nth-child(1) { top: 20px; right: 10px; }
        .lp-analysis-ring-2 .lp-analysis-dot:nth-child(2) { bottom: 20px; left: 10px; }
        @keyframes analysisRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .lp-analysis-headline {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 8px;
          word-break: keep-all;
        }
        .lp-analysis-sub {
          font-size: 14px; color: var(--text-4); margin-bottom: 32px;
        }
        .lp-analysis-desc {
          font-size: 14px; color: var(--text-3); line-height: 1.8;
          word-break: keep-all; text-align: left; max-width: 560px;
        }

        /* GENERATION SECTION */
       /* GENERATION */
        .lp-generation {
          min-height: 100vh; padding: 120px 48px;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-gen-layout {
          display: flex; align-items: center; justify-content: center;
          gap: 60px; max-width: 1000px; width: 100%; flex-wrap: wrap;
        }
        .lp-gen-text { flex: 1 1 280px; min-width: 260px; }
        .lp-gen-lines { margin-top: 24px; display: flex; flex-direction: column; gap: 0; }
        .lp-gen-line {
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 700; line-height: 1.5; letter-spacing: -0.02em;
          color: var(--text-4); cursor: pointer;
          padding: 12px 0; border-bottom: 1px solid var(--border);
          transition: color 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
          word-break: keep-all;
        }
        .lp-gen-line:last-child { border-bottom: none; }
        .lp-gen-line.lp-active { color: var(--text-1); }
        .lp-gen-captions { margin-top: 20px; position: relative; min-height: 80px; }
        .lp-gen-caption {
          position: absolute; top: 0; left: 0; right: 0;
          font-size: 14px; color: var(--text-3); line-height: 1.7;
          opacity: 0; transform: translateY(8px);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none; word-break: keep-all;
        }
        .lp-gen-caption.lp-active {
          opacity: 1; transform: translateY(0); pointer-events: auto;
        }
        .lp-gen-mockup {
          flex: 1 1 400px; max-width: 520px; min-height: 400px; position: relative;
        }
        .lp-gen-panel {
          position: absolute; top: 0; left: 0; right: 0;
          opacity: 0; transform: translateY(16px);
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 28px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .lp-gen-panel.lp-active {
          opacity: 1; transform: translateY(0); pointer-events: auto;
        }
        .lp-gen-mock-title {
          font-size: 16px; font-weight: 700; color: var(--text-1); margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .lp-gen-mock-info { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-bottom: 16px; }
        .lp-gen-mock-info-item { font-size: 12px; color: var(--text-4); }
        .lp-gen-mock-info-item strong { color: var(--text-2); font-weight: 600; }
        .lp-gen-plan-row {
          padding: 10px 14px; background: rgba(0,0,0,0.02); border-radius: 8px;
          font-size: 13px; color: var(--text-2); font-weight: 500;
        }
        .lp-gen-mock-para {
          font-size: 13px; color: var(--text-3); line-height: 1.7;
          padding: 16px; background: rgba(0,0,0,0.015); border-radius: 10px;
          word-break: keep-all;
        }
        .lp-gen-mock-para-label {
          font-size: 11px; font-weight: 600; color: var(--text-4); margin-bottom: 8px;
        }
        .lp-gen-compare { width: 100%; display: flex; gap: 12px; }
        .lp-gen-compare-side {
          flex: 1; background: var(--surface);
          border: 1px solid var(--border); border-radius: 12px; padding: 18px;
        }
        .lp-gen-compare-side.lp-edited {
          border-color: rgba(59,130,246,0.3); box-shadow: 0 0 0 1px rgba(59,130,246,0.1);
        }
        .lp-gen-compare-label {
          font-size: 12px; font-weight: 700; color: var(--text-3); margin-bottom: 10px;
        }
        .lp-gen-compare-text {
          font-size: 12px; color: var(--text-3); line-height: 1.7; word-break: keep-all;
        }
        .lp-gen-compare-text .lp-added {
          background: rgba(59,130,246,0.08); color: rgba(59,130,246,0.8);
          font-weight: 600;
        }
   /* RESPONSIVE */
        @media (max-width: 768px) {
          .lp-section { padding: 100px 24px; }
          .lp-pipeline { padding: 100px 24px; }
          .lp-pipeline-flow { gap: 8px; }
          .lp-pipeline-icon { width: 52px; height: 52px; border-radius: 14px; }
          .lp-pipeline-icon svg { width: 24px; height: 24px; }
          .lp-pipeline-arrow svg { width: 16px; height: 16px; }
          .lp-pipeline-label { font-size: 11px; }
          .lp-qna-layout { flex-direction: column; gap: 48px; }
          .lp-qna-text { flex: none; width: 100%; }
          .lp-qna-mockup { max-width: 100%; min-height: 480px; }
          .lp-mockup-panel { position: relative; display: none; padding: 20px; border-radius: 16px; }
          .lp-mockup-panel.lp-active { display: block; opacity: 1; transform: none; pointer-events: auto; }
          .lp-mock-split-cards { flex-direction: column; }
          .lp-mock-question { font-size: 14px; }
          .lp-mock-question-sm { font-size: 13px; }
          .lp-mock-choice { font-size: 12px; padding: 12px 14px; }
          .lp-mock-card-text { font-size: 12px; }
          .lp-mock-input-area { font-size: 11px; min-height: 50px; }
          .lp-db-layout { flex-direction: column-reverse; gap: 48px; }
          .lp-db-mockup { max-width: 100%; }
          .lp-db-mock-grid { flex-direction: column; }
       .lp-login-btn { top: 16px; right: 16px; padding: 6px 14px; font-size: 13px; }
.lp-analysis { padding: 100px 24px; }
          .lp-analysis-mockup { width: 200px; height: 200px; margin-bottom: 36px; }
          .lp-analysis-logo { width: 70px; height: 70px; }
          .lp-analysis-ring-1 { width: 120px; height: 120px; }
          .lp-analysis-ring-2 { width: 160px; height: 160px; }
          .lp-analysis-ring-3 { width: 195px; height: 195px; }
          .lp-gen-layout { flex-direction: column; gap: 48px; }          .lp-gen-mockup { max-width: 100%; min-height: auto; }
          .lp-gen-panel { position: relative; display: none; }
          .lp-gen-panel.lp-active { display: block; opacity: 1; transform: none; pointer-events: auto; }
          .lp-gen-compare { flex-direction: column; }
        }
      `}</style>

      <div className="lp-root">

        {/* HERO */}
        <section className="lp-section lp-hero">
          <div className="lp-hero-logo-wrap">
            <div className="lp-hero-logo">
              <svg width="160" height="160" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="lpG1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6B7280" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#lpG1)" stroke="rgba(107,114,128,0.5)" strokeWidth="2" />
                <rect x="92" y="40" width="16" height="120" fill="rgba(74,85,104,0.85)" rx="8" />
                <rect x="40" y="92" width="120" height="16" fill="rgba(74,85,104,0.85)" rx="8" />
              </svg>
            </div>
            <div className="lp-pulse-ring lp-pulse-ring-1"></div>
            <div className="lp-pulse-ring lp-pulse-ring-2"></div>
            <div className="lp-pulse-ring lp-pulse-ring-3"></div>
          </div>
      
          <h1 className="lp-hero-headline" style={{ position: 'relative' }}>
            <span className="lp-headline-en" translate="no">Cover Letters,<br/>Democratized.</span>
            <span className="lp-headline-ko">자기소개서,<br/>모두의 것이 되다.</span>
          </h1>
{/* 로그인 버튼 */}
<button
  className="lp-login-btn"
  onClick={() => navigate('/login')}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
  로그인
</button>

<div className="lp-scroll-hint">
            <div className="lp-scroll-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10l5 5 5-5"/>
              </svg>
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section className="lp-section lp-pipeline">
        <p className="lp-reveal" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '72px', lineHeight: 1.4 }}>
            입력은 최소한,<br/>분석은 최대한.
          </p>
          <div className="lp-pipeline-flow lp-reveal lp-d2" style={{ marginBottom: '72px' }}>
            {[
              { label: '채용공고 입력', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></> },
              { label: '문답', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
              { label: '에피소드', icon: <><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></> },
              { label: '계획서', icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></> },
              { label: '자소서', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="13" y2="14"/></> },
              { label: '첨삭', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div className="lp-pipeline-step">
                  <div className="lp-pipeline-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gray-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {step.icon}
                    </svg>
                  </div>
                  <span className="lp-pipeline-label">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="lp-pipeline-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="lp-reveal lp-d3" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', maxWidth: '560px', textAlign: 'center', lineHeight: 1.8, wordBreak: 'keep-all' }}>
            딥글은 자기소개서 작성을 위해 기업과 채용공고를 분석하고, 사용자의 경험을 지원 회사와 연결하기 위한 다각도의 분석을 진행합니다. 이를 바탕으로 문답이 이어지며, 문답을 기반으로 생성된 에피소드를 기준으로 계획서와 자기소개서가 완성됩니다. 사용자는 채용공고를 입력하고 질문에 답하는 것만으로 자소서를 생성할 수 있습니다.
          </p>
          </section>

{/* ANALYSIS */}
<section className="lp-section lp-analysis">
  <div className="lp-analysis-layout">
    <div className="lp-analysis-mockup lp-reveal">
      <div className="lp-analysis-logo">
        <svg width="60" height="60" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="rgba(156,163,175,0.15)" stroke="rgba(107,114,128,0.3)" strokeWidth="3" />
          <rect x="92" y="40" width="16" height="120" fill="rgba(74,85,104,0.7)" rx="8" />
          <rect x="40" y="92" width="120" height="16" fill="rgba(74,85,104,0.7)" rx="8" />
        </svg>
      </div>
      <div className="lp-analysis-ring lp-analysis-ring-1">
        <span className="lp-analysis-dot"></span>
        <span className="lp-analysis-dot"></span>
      </div>
      <div className="lp-analysis-ring lp-analysis-ring-2">
        <span className="lp-analysis-dot"></span>
        <span className="lp-analysis-dot"></span>
      </div>
      <div className="lp-analysis-ring lp-analysis-ring-3"></div>
    </div>
    <p className="lp-section-label lp-reveal lp-d1" translate="no">DeepGL Analysis</p>
    <h2 className="lp-analysis-headline lp-reveal lp-d2">딥글,<br/>당신의 이야기를 탐색 중.</h2>
    <p className="lp-analysis-sub lp-reveal lp-d3">약 5~10분 소요됩니다</p>
    <p className="lp-analysis-desc lp-reveal lp-d4">딥글은 채용공고를 기준으로 자기소개서 전 문항에서 공통적으로 드러나야 할 역량과 인재상을 먼저 추출합니다. 이후 사용자의 이력서에 기재된 경험을 하나씩 분석해, 각 경험이 자소서의 주제와 공통 역량·인재상, 그리고 회사와 얼마나 잘 연결되는지를 점수화합니다. 이 점수를 바탕으로 자소서 활용도가 가장 높은 상위 두 개의 경험 카드를 생성합니다. 각 경험 카드에는 사용자의 경험을 자소서에 활용 가능한 에피소드로 구성하기 위한 논리 구조와 방향성이 담겨 있습니다. 사용자는 선택한 경험 카드를 기준으로 문답 형식의 질문에 답하며 경험을 구체화해 나가게 됩니다.</p>
  </div>
</section>

{/* QNA */}
        <section className="lp-section lp-qna" ref={qnaSectionRef}>
          <div className="lp-qna-layout">
            <div className="lp-qna-text">
            <p className="lp-section-label" translate="no">DeepGL Q&A System</p>
                          <div className="lp-qna-lines">
                {qnaData.map((item, i) => (
                  <p
                    key={i}
                    className={`lp-qna-line${activeLineIndex === i ? ' lp-active' : ''}`}
                                        onClick={() => {
                      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
                      switchMockup(item.target, i);
                    }}
                  >
                    {item.text}
                  </p>
                ))}
              </div>
              <div className="lp-qna-captions">
                {Object.entries(qnaCaptions).map(([key, text]) => (
                  <p key={key} className={`lp-qna-caption${currentMockup === key ? ' lp-active' : ''}`}>
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div className="lp-qna-mockup lp-reveal lp-d2">
              {/* 목업 1: 분할 답변 */}
              <div className={`lp-mockup-panel${currentMockup === 'mockup-split' ? ' lp-active' : ''}`}>
                <div className="lp-mock-header">
                  <div className="lp-mock-logo">
                    <svg width="28" height="28" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="rgba(156,163,175,0.15)" stroke="rgba(107,114,128,0.3)" strokeWidth="4"/><rect x="92" y="40" width="16" height="120" fill="rgba(74,85,104,0.6)" rx="8"/><rect x="40" y="92" width="120" height="16" fill="rgba(74,85,104,0.6)" rx="8"/></svg>
                  </div>
                  <div className="lp-mock-star-badge">[S] Situation</div>
                  <p className="lp-mock-question">프로젝트 일정이 지연되었을 때, 어떤 상황이었고 어떻게 데이터를 활용해 해결했나요?</p>
                </div>
                <div className="lp-mock-split-cards">
                  <div className="lp-mock-card">
                    <p className="lp-mock-card-label">질문 1 / 2</p>
                    <p className="lp-mock-card-text">일정이 지연된 상황이었어?</p>
                    <div className="lp-mock-input-area">
                      <span className="lp-mock-typing">마케팅 대행사에서 브랜드 리뉴얼 프로젝트를 진행할 때, 클라이언트 요구사항이 중간에 변경되면서...</span>
                    </div>
                  </div>
                  <div className="lp-mock-card">
                    <p className="lp-mock-card-label">질문 2 / 2</p>
                    <p className="lp-mock-card-text">활용했던 데이터는 구체적으로 뭐였어?</p>
                    <div className="lp-mock-input-area lp-empty"></div>
                  </div>
                </div>
              </div>

              {/* 목업 2: 객관식 */}
              <div className={`lp-mockup-panel${currentMockup === 'mockup-choice' ? ' lp-active' : ''}`}>
                <div className="lp-mock-header">
                  <div className="lp-mock-badge">1단계 심화 중</div>
                  <p className="lp-mock-question-sm">프로젝트 일정 지연을 해결하기 위해 데이터를 활용한 구체적인 상황이 있어?</p>
                </div>
                <div className="lp-mock-choices">
                  <div className="lp-mock-choice">고객사 요구사항 변경으로 인해 우선순위를 재조정한 경험</div>
                  <div className="lp-mock-choice lp-selected">프로젝트 진행률 데이터를 분석해 병목 구간을 찾아낸 사례</div>
                  <div className="lp-mock-choice">팀원별 업무 부하를 시각화하여 리소스를 재배치한 경험</div>
                  <div className="lp-mock-choice">주간 스프린트 회고 데이터를 바탕으로 프로세스를 개선한 사례</div>
                </div>
                <div className="lp-mock-btn-row">
                  <span className="lp-mock-btn-ghost">취소</span>
                  <span className="lp-mock-btn-solid">⟲ 보기 재생성</span>
                </div>
              </div>

              {/* 목업 3: 수정 */}
              <div className={`lp-mockup-panel${currentMockup === 'mockup-edit' ? ' lp-active' : ''}`}>
                <div className="lp-mock-header">
                  <p className="lp-mock-question-sm">질문이나 보기를 자유롭게 수정하세요</p>
                </div>
                <div className="lp-mock-edit-demo">
                <div className="lp-mock-choice lp-editing">
                <EditAnimationText isActive={currentMockup === 'mockup-edit'} />
                    <span style={{ color: 'var(--text-3)' }}>을 시각화하여 병목 구간을 해소한 경험</span>
                    <span className="lp-mock-edit-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </span>
                  </div>
                  <div className="lp-mock-choice">주간 스프린트 회고 데이터를 바탕으로 프로세스를 개선한 사례</div>
                  <div className="lp-mock-choice">고객사 피드백을 정량화하여 우선순위를 재조정한 경험</div>
                </div>
              </div>

              {/* 목업 4: 재생성 */}
              <div className={`lp-mockup-panel${currentMockup === 'mockup-refresh' ? ' lp-active' : ''}`}>
                <div className="lp-mock-header">
                  <div className="lp-mock-badge lp-green">재생성 완료</div>
                  <p className="lp-mock-question-sm">새로고침해도 맥락에 맞게 다시 생성됩니다</p>
                </div>
                <div className="lp-mock-choices">
                  <div className="lp-mock-choice lp-fresh">클라이언트 미팅 일정 데이터를 분석해 커뮤니케이션 효율을 높인 경험</div>
                  <div className="lp-mock-choice lp-fresh">업무 자동화 도입 전후의 처리 시간을 비교 분석한 사례</div>
                  <div className="lp-mock-choice lp-fresh">프로젝트 리스크 지표를 모니터링하여 선제적으로 대응한 경험</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATABASE */}
        <section className="lp-section lp-database" ref={dbSectionRef}>
          <div className="lp-db-layout">
            <div className="lp-db-mockup lp-reveal lp-d2">
              <div className="lp-db-mock-card">
                <div className="lp-db-mock-header">
                  <p className="lp-db-mock-company">글로벌테크 에피소드</p>
                  <p className="lp-db-mock-sub">저장된 경험 에피소드 목록</p>
                </div>
                <div className="lp-db-mock-grid">
                  {[
                    { title: '일정 관리 혁신', desc: '프로젝트 매니저로 일정 지연 문제를 데이터 기반으로 해결한...', date: '2026. 1. 31.' },
                    { title: '고객 분석 전환', desc: '고객 행동 데이터를 분석하여 서비스 전략을 전면 수정한...', date: '2026. 1. 29.' },
                    { title: '팀 소통 개선', desc: '부서 간 협업 프로세스를 재설계하여 업무 효율을 높인...', date: '2026. 1. 27.' },
                  ].map((item, i) => (
                    <div key={i} className="lp-db-mock-item">
                      <p className="lp-db-mock-title">{item.title}</p>
                      <p className="lp-db-mock-desc">{item.desc}</p>
                      <p className="lp-db-mock-date">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lp-db-flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
              </div>

              <div className="lp-db-mock-card lp-proposal">
                <p className="lp-db-proposal-title">재활용 제안서</p>
                <p className="lp-db-proposal-sub">이전에 작성한 경험을 <strong>넥스트소프트</strong>에 맞게 재구성합니다</p>
                <div className="lp-db-proposal-fields">
                  {[
                    { label: '강조할 역량', value: '문제 해결력' },
                    { label: '맞춰야 할 인재상', value: '데이터 기반으로 의사결정하는 사람' },
                    { label: '재구성 방향', value: '[지원동기] 문제 해결력 역량 기반 스토리' },
                  ].map((field, i) => (
                    <div key={i} className="lp-db-proposal-field">
                      <span className="lp-db-field-label">{field.label}</span>
                      <span className="lp-db-field-value">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lp-db-text">
            <p className="lp-section-label" style={{ color: 'rgba(255,255,255,0.4)' }} translate="no">DeepGL Database</p>
                          <div className="lp-db-lines">
                {[
                  '저장하고,',
                  '분석되며,',
                  '재구성되어,',
                  '강력해지는.',
                ].map((text, i) => (
<p key={i} className={`lp-db-line${dbLit[i] ? ' lp-lit' : ''}`}>{text}</p>
                ))}
              </div>
              <p className="lp-db-desc lp-reveal lp-d5">딥글 세션을 진행하며 생성되는 자기소개서와 에피소드는 모두 회사별 경험 데이터로 저장되고, 동시에 딥글의 내부 알고리즘을 통해 분석됩니다. 이후 다른 자기소개서를 작성할 때, 딥글은 저장된 경험 중 재구성이 가능한 유사도 높은 경험을 선별해 에피소드 재구성 제안서를 제공합니다. 사용자가 이에 동의하면, 별도의 문답 과정 없이 해당 경험을 기반으로 즉시 에피소드 생성이 가능합니다.</p>
            </div>
          </div>
          </section>

{/* GENERATION */}
<section className="lp-section lp-generation" ref={genSectionRef}>
  <div className="lp-gen-layout">
    <div className="lp-gen-text">
      <p className="lp-section-label" translate="no">DeepGL Generation</p>
      <div className="lp-gen-lines">
        {genData.map((item, i) => (
          <p
            key={i}
            className={`lp-gen-line${activeGenIndex === i ? ' lp-active' : ''}`}
            onClick={() => {
              if (genIntervalRef.current) clearInterval(genIntervalRef.current);
              switchGenPanel(item.target, i);
            }}
          >
            {item.text}
          </p>
        ))}
      </div>
      <div className="lp-gen-captions">
        {Object.entries(genCaptions).map(([key, text]) => (
          <p key={key} className={`lp-gen-caption${currentGenPanel === key ? ' lp-active' : ''}`}>
            {text}
          </p>
        ))}
      </div>
    </div>

    <div className="lp-gen-mockup lp-reveal lp-d2">
      {/* 패널 1: 계획서 */}
      <div className={`lp-gen-panel${currentGenPanel === 'panel-plan' ? ' lp-active' : ''}`}>
        <p className="lp-gen-mock-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          자소서 계획서
        </p>
        <div className="lp-gen-mock-info">
          <span className="lp-gen-mock-info-item"><strong>글로벌테크</strong> · 데이터분석</span>
          <span className="lp-gen-mock-info-item">주제: 지원동기</span>
          <span className="lp-gen-mock-info-item">800자</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            '1문단 (지원동기를 데이터 활용 경험과 연결하여 두괄식 제시)',
            '2문단 (프로젝트 경험과 직무 역량의 구체적 연결)',
            '3문단 (회사 비전과 본인 성장 방향의 일치)',
          ].map((text, i) => (
            <div key={i} className="lp-gen-plan-row">{text}</div>
          ))}
        </div>
      </div>

      {/* 패널 2: 자소서 */}
      <div className={`lp-gen-panel${currentGenPanel === 'panel-write' ? ' lp-active' : ''}`}>
        <p className="lp-gen-mock-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          생성된 자소서
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="lp-gen-mock-para">
            <p className="lp-gen-mock-para-label">문단 1</p>
            글로벌테크 데이터분석 직무에 지원하게 된 계기는 프로젝트 매니저로서 일정 지연 문제를 데이터 기반으로 해결하며 느낀 분석의 힘 때문입니다.
          </div>
          <div className="lp-gen-mock-para">
            <p className="lp-gen-mock-para-label">문단 2</p>
            팀 프로젝트에서 진행률 데이터를 시각화하고 병목 구간을 식별하여 일정을 2주 단축한 경험은, 데이터가 의사결정의 핵심 도구가 될 수 있음을 체감하게 해주었습니다.
          </div>
          <div className="lp-gen-mock-para">
            <p className="lp-gen-mock-para-label">문단 3</p>
            글로벌테크가 추구하는 데이터 기반 혁신 문화 속에서, 현장의 문제를 분석으로 풀어내는 인재로 성장하고 싶습니다.
          </div>
        </div>
      </div>

      {/* 패널 3: 첨삭 */}
      <div className={`lp-gen-panel${currentGenPanel === 'panel-edit' ? ' lp-active' : ''}`}>
        <p className="lp-gen-mock-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          문단 수정
        </p>
        <div className="lp-gen-compare">
          <div className="lp-gen-compare-side">
            <p className="lp-gen-compare-label">원본 문단</p>
            <p className="lp-gen-compare-text">진행률 데이터를 시각화하고 병목 구간을 식별하여 일정을 단축한 경험은, 데이터가 의사결정의 도구가 될 수 있음을 체감하게 해주었습니다.</p>
          </div>
          <div className="lp-gen-compare-side lp-edited">
            <p className="lp-gen-compare-label">수정 문단</p>
            <p className="lp-gen-compare-text">진행률 데이터를 시각화하고 병목 구간을 식별하여 일정을 <span className="lp-added">2주 단축한</span> 경험은, 데이터가 의사결정의 <span className="lp-added">핵심</span> 도구가 될 수 있음을 체감하게 해주었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="lp-section lp-final">
          <h2 className="lp-final-headline lp-reveal">
            글 잘 쓰는 사람이 회사 가냐,<br/>
            <span className="lp-final-accent">일 잘하는 사람이 회사 가자.</span>
          </h2>
          <button className="lp-final-cta lp-reveal lp-d2" onClick={() => navigate('/signup')}>
            딥글 시작하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </section>

        {/* FOOTER */}
        <GlobalFooter dark />
      </div>
    </>
  );
};

export default LandingPage;