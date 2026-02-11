import React, { useState, useEffect, useRef } from 'react';

const DglcBalanceDisplay = ({ balance, onClick }) => {
  const [displayValue, setDisplayValue] = useState(balance);
  const animRef = useRef(null);
  const prevBalanceRef = useRef(balance);

  useEffect(() => {
    if (balance === null || balance === undefined) return;
    if (prevBalanceRef.current === null || prevBalanceRef.current === undefined) {
      prevBalanceRef.current = balance;
      setDisplayValue(balance);
      return;
    }

    const from = prevBalanceRef.current;
    const to = balance;
    prevBalanceRef.current = balance;

    if (from === to) return;

    const diff = Math.abs(to - from);
    const direction = to > from ? 1 : -1;

    // 스텝 생성: 변화량에 비례, 최소 5 최대 15
    const totalSteps = Math.max(5, Math.min(15, Math.round(diff <= 5 ? diff : 8 + Math.log2(diff))));

    // easeOutCubic으로 스텝 값 생성 (처음 빠르게, 끝에서 느리게)
    const steps = [];
    for (let i = 1; i <= totalSteps; i++) {
      const t = i / totalSteps;
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = from + (to - from) * eased;
      // 소수점 1자리까지 반올림
      const rounded = Math.round(val * 10) / 10;
      steps.push(rounded);
    }
    // 마지막은 정확한 목표값
    steps[steps.length - 1] = to;
    // 중복 제거
    const uniqueSteps = [steps[0]];
    for (let i = 1; i < steps.length; i++) {
      if (steps[i] !== steps[i - 1]) uniqueSteps.push(steps[i]);
    }

    // 총 애니메이션 시간: 변화량에 비례, 최소 0.6초 최대 2초
    const totalDuration = Math.max(600, Math.min(2000, 400 + diff * 30));

    // 각 스텝 간 딜레이: 앞쪽은 짧고, 뒤쪽은 길게
    const delays = [];
    for (let i = 0; i < uniqueSteps.length; i++) {
      const t = i / (uniqueSteps.length - 1 || 1);
      const weight = 0.4 + 1.6 * Math.pow(t, 2); // 뒤로 갈수록 느리게
      delays.push(weight);
    }
    const totalWeight = delays.reduce((a, b) => a + b, 0);
    const normalizedDelays = delays.map(w => (w / totalWeight) * totalDuration);

    // 기존 애니메이션 취소
    if (animRef.current) {
      animRef.current.forEach(id => clearTimeout(id));
    }

    const timeoutIds = [];
    let accumulated = 0;
    uniqueSteps.forEach((stepVal, i) => {
      accumulated += normalizedDelays[i];
      const id = setTimeout(() => {
        setDisplayValue(stepVal);
      }, accumulated);
      timeoutIds.push(id);
    });

    animRef.current = timeoutIds;

    return () => {
      if (animRef.current) {
        animRef.current.forEach(id => clearTimeout(id));
      }
    };
  }, [balance]);

  if (balance === null || balance === undefined) return null;

  const formatted = displayValue === null || displayValue === undefined
    ? '0'
    : Number.isInteger(displayValue)
      ? displayValue.toString()
      : displayValue.toFixed(1);

  return (
    <div onClick={onClick} style={{
      position: 'fixed', top: '16px', right: '16px', zIndex: 9998,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '12px', padding: '8px 16px', cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex', alignItems: 'center', gap: '8px',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #1F2937, #374151)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}>D</span>
      </div>
      <span style={{
        fontSize: '14px', fontWeight: '700', color: '#1F2937',
        fontVariantNumeric: 'tabular-nums', minWidth: '24px', textAlign: 'right',
      }}>
        {formatted}
      </span>
    </div>
  );
};

export default DglcBalanceDisplay;