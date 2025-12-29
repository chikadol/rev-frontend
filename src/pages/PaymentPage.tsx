import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Ticket, Payment } from '../types';

export default function PaymentPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'NAVER_PAY' | 'TOSS' | 'KAKAO_PAY' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ticketId) return;

    Promise.all([
      apiClient.getTicket(ticketId),
      apiClient.getPaymentByTicketId(ticketId).catch(() => null)
    ])
      .then(([ticketData, paymentData]) => {
        setTicket(ticketData);
        setPayment(paymentData);
        
        // 이미 결제 완료된 경우
        if (paymentData && paymentData.status === 'COMPLETED') {
          navigate('/my-tickets');
        }
      })
      .catch((err) => {
        console.error('티켓/결제 정보 로드 실패:', err);
        setError('정보를 불러올 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, [ticketId, navigate]);

  const handlePayment = async () => {
    if (!ticketId || !selectedMethod) {
      setError('결제 수단을 선택해주세요.');
      return;
    }

    setPaying(true);
    setError('');

    try {
      const paymentResult = await apiClient.createPayment({
        ticketId,
        paymentMethod: selectedMethod,
      });

      // 결제 URL이 있으면 해당 URL로 리다이렉트 (실제 결제 페이지)
      if (paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
        // 리다이렉트되므로 setPaying(false)는 호출되지 않음
        return;
      } else {
        // paymentUrl이 없으면 결제 완료로 간주 (테스트 환경 등)
        navigate('/my-tickets', { 
          state: { message: '결제가 완료되었습니다.' }
        });
      }
    } catch (err: any) {
      console.error('결제 실패:', err);
      setError(err.message || '결제에 실패했습니다.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        color: 'var(--color-text-secondary)'
      }}>
        로딩 중...
      </div>
    );
  }

  if (!ticket || error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          {error || '티켓을 찾을 수 없습니다.'}
        </p>
        <button
          onClick={() => navigate('/my-tickets')}
          className="btn btn-primary"
          style={{ marginTop: 'var(--spacing-md)' }}
        >
          내 티켓으로
        </button>
      </div>
    );
  }

  const paymentMethods = [
    { 
      value: 'NAVER_PAY' as const, 
      name: '네이버페이', 
      color: '#03C75A',
      buttonImage: '/images/payment/naverpay-button.svg'
    },
    { 
      value: 'TOSS' as const, 
      name: '토스페이', 
      color: '#0064FF',
      buttonImage: '/images/payment/toss-button.svg'
    },
    { 
      value: 'KAKAO_PAY' as const, 
      name: '카카오페이', 
      color: '#FEE500',
      buttonImage: '/images/payment/kakaopay-button.svg'
    },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: 'var(--spacing-xl)',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '-0.02em'
      }}>
        결제
      </h1>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ 
          margin: '0 0 var(--spacing-md) 0',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          주문 정보
        </h2>
        <div style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.125rem', fontWeight: '600' }}>
            {ticket.performanceTitle}
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            {ticket.venue} · {new Date(ticket.performanceDateTime).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ 
          margin: '0 0 var(--spacing-lg) 0',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          결제 수단 선택
        </h2>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: 'var(--color-error)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--spacing-lg)',
            fontSize: '0.9375rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {paymentMethods.map(method => (
            <button
              key={method.value}
              onClick={() => setSelectedMethod(method.value)}
              style={{
                padding: 0,
                border: selectedMethod === method.value ? `3px solid ${method.color}` : '2px solid transparent',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                minHeight: '60px'
              }}
            >
              {method.buttonImage ? (
                <img 
                  src={method.buttonImage} 
                  alt={method.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    maxHeight: '70px',
                    minHeight: '50px',
                    opacity: selectedMethod === method.value ? 1 : 0.85,
                    filter: selectedMethod === method.value ? 'none' : 'brightness(0.9)',
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // 이미지 로드 실패 시 텍스트 버튼으로 대체
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.padding = 'var(--spacing-lg)';
                      parent.style.background = selectedMethod === method.value ? `${method.color}15` : 'var(--color-bg)';
                      parent.style.border = selectedMethod === method.value ? `2px solid ${method.color}` : '1px solid var(--color-border)';
                      const fallback = document.createElement('span');
                      fallback.textContent = method.name;
                      fallback.style.fontSize = '1.125rem';
                      fallback.style.fontWeight = '600';
                      fallback.style.color = method.color;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span style={{
                  padding: 'var(--spacing-lg)',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: method.color
                }}>
                  {method.name}
                </span>
              )}
              {selectedMethod === method.value && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: method.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <span style={{ 
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.875rem'
                  }}>
                    ✓
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>총 결제 금액</span>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--color-primary)'
            }}>
              {ticket.price.toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying || !selectedMethod}
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            fontSize: '1rem', 
            padding: 'var(--spacing-md)'
          }}
        >
          {paying ? '결제 중...' : '결제하기'}
        </button>
      </div>
    </div>
  );
}
