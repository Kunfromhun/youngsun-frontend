import React from 'react';

const ReuseProposalModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onReject,
  companyName,
  selectedChains = [],
  globalStrategy = {},
  targetCompany,
  loading = false
}) => {
  if (!isOpen) return null;

  // 로딩 상태일 때 전체화면 로딩
  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: '80px',
        right: 0,
        bottom: 0,
        background: '#FBFBFD',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
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
                <linearGradient id="reuseLoadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6B7280" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#reuseLoadingGradient)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="2"/>
              <rect x="92" y="40" width="16" height="120" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
              <rect x="40" y="92" width="120" height="16" fill="rgba(74, 85, 104, 0.8)" rx="8"/>
            </svg>
            <div className="pulse-ring pulse-ring-1"></div>
            <div className="pulse-ring pulse-ring-2"></div>
            <div className="pulse-ring pulse-ring-3"></div>
          </div>
          <p style={{
            color: '#4B5563',
            fontSize: '17px',
            fontWeight: '500',
            margin: 0
          }}>에피소드를 재구성하고 있습니다...</p>
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
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'auto',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* 헤더 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1D1D1F',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          재활용 제안서
        </h1>
        
        <p style={{
          fontSize: '15px',
          color: '#86868B',
          marginBottom: '32px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          이전에 작성한 경험을 <strong style={{ color: '#1D1D1F' }}>{targetCompany || companyName}</strong>에 맞게 재구성합니다
        </p>

        {/* 강조할 역량 */}
        {globalStrategy.coreCompetency && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#86868B',
              marginBottom: '8px'
            }}>
              강조할 역량
            </p>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1D1D1F',
                margin: 0
              }}>
                {globalStrategy.coreCompetency}
              </p>
            </div>
          </div>
        )}

        {/* 맞춰야 할 인재상 */}
        {globalStrategy.talentProfile && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#86868B',
              marginBottom: '8px'
            }}>
              맞춰야 할 인재상
            </p>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <p style={{
                fontSize: '15px',
                color: '#1D1D1F',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {globalStrategy.talentProfile}
              </p>
            </div>
          </div>
        )}

        {/* 재구성 방향 */}
        {globalStrategy.storyAngle && (
          <div style={{ marginBottom: '28px' }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#86868B',
              marginBottom: '8px'
            }}>
              재구성 방향
            </p>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <p style={{
                fontSize: '15px',
                color: '#1D1D1F',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {globalStrategy.storyAngle}
              </p>
            </div>
          </div>
        )}

        {/* 활용할 내 경험 (체인 목록) */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#86868B',
            marginBottom: '12px'
          }}>
            활용할 내 경험 ({selectedChains.length}개)
          </p>
          
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            {selectedChains.map((chain, index) => (
              <div 
                key={chain.chainId || index}
                style={{
                  padding: '20px',
                  borderBottom: index < selectedChains.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {/* 번호 + 회사명 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: 'rgba(74, 85, 104, 0.1)',
                    borderRadius: '50%',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#4A5568'
                  }}>
                    {index + 1}
                  </span>
                  {chain.companyName && (
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#86868B'
                    }}>
                      {chain.companyName}
                    </span>
                  )}
                </div>

                {/* Chain 흐름: precondition → action → postcondition */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingLeft: '34px'
                }}>
                  {/* Precondition */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#86868B',
                      minWidth: '16px'
                    }}>•</span>
                    <p style={{
                      fontSize: '14px',
                      color: '#1D1D1F',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {chain.precondition}
                    </p>
                  </div>
                  
                  {/* Arrow + Action */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#4A5568',
                      minWidth: '16px'
                    }}>→</span>
                    <p style={{
                      fontSize: '14px',
                      color: '#1D1D1F',
                      margin: 0,
                      lineHeight: '1.5',
                      fontWeight: '500'
                    }}>
                      {chain.action}
                    </p>
                  </div>
                  
                  {/* Arrow + Postcondition */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#4A5568',
                      minWidth: '16px'
                    }}>→</span>
                    <p style={{
                      fontSize: '14px',
                      color: '#1D1D1F',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {chain.postcondition}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {chain.tags && chain.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '12px',
                    paddingLeft: '34px'
                  }}>
                    {chain.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        style={{
                          fontSize: '12px',
                          color: '#4A5568',
                          background: 'rgba(74, 85, 104, 0.08)',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {selectedChains.length === 0 && (
              <div style={{
                padding: '32px 20px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#86868B',
                  margin: 0
                }}>
                  재활용 가능한 경험이 없습니다
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button
            onClick={onReject}
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
            경험 새롭게 구체화하기
          </button>
          <button
            onClick={onConfirm}
            disabled={selectedChains.length === 0}
            style={{
              padding: '16px 32px',
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: selectedChains.length === 0 ? '#D1D1D6' : '#1D1D1F',
              cursor: selectedChains.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedChains.length > 0) e.target.style.background = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            경험 재구성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReuseProposalModal;