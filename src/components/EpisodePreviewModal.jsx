import React from 'react';

const EpisodePreviewModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onEdit,
  episode,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#F5F5F7',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 상단 헤더 */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'white'
      }}>
        <button 
          onClick={onEdit}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '15px',
            color: '#007AFF',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ← 다시 작성하기
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '640px', width: '100%' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1D1D1F',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            생성된 에피소드
          </h1>
          
          <p style={{
            fontSize: '15px',
            color: '#86868B',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            내용을 확인하고 사용 여부를 결정하세요
          </p>

          {/* 에피소드 본문 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#1D1D1F',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {episode?.content || '에피소드 내용이 없습니다.'}
            </p>
          </div>

          {/* 하단 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <button
              onClick={onEdit}
              disabled={loading}
              style={{
                padding: '16px 32px',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1D1D1F',
                cursor: 'pointer'
              }}
            >
              수정이 필요해요
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding: '16px 32px',
                background: '#007AFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {loading ? '처리 중...' : '이대로 사용할게요'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodePreviewModal;