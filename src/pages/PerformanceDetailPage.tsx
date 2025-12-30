import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Performance } from '../types';

export default function PerformanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    apiClient.getPerformance(id)
      .then(setPerformance)
      .catch((err) => {
        console.error('공연 정보 로드 실패:', err);
        setError('공연 정보를 불러올 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = async () => {
    if (!id || !performance) return;

    if (performance.remainingSeats < quantity) {
      setError(`남은 티켓이 부족합니다. (남은 티켓: ${performance.remainingSeats})`);
      return;
    }

    setPurchasing(true);
    setError('');

    try {
            const ticket = await apiClient.purchaseTicket({
              performanceId: id,
              quantity,
            });
      
      // 결제 페이지로 이동
      navigate(`/tickets/${ticket.id}/payment`);
    } catch (err: any) {
      console.error('티켓 구매 실패:', err);
      setError(err.message || '티켓 구매에 실패했습니다.');
    } finally {
      setPurchasing(false);
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

  if (!performance || error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          {error || '공연을 찾을 수 없습니다.'}
        </p>
        <Link to="/performances" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
          공연 목록으로
        </Link>
      </div>
    );
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  };

  // 가격 우선순위: advPrice > doorPrice > price
  const ticketPrice = performance.advPrice || performance.doorPrice || performance.price;
  const totalPrice = ticketPrice * quantity;

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link 
          to="/performances" 
          style={{ 
            color: 'var(--color-text-secondary)', 
            textDecoration: 'none',
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            fontWeight: '500',
            transition: 'all var(--transition-base)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          ← 공연 목록
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 'var(--spacing-2xl)' }}>
        <div>
          {performance.imageUrl && (
            <div style={{
              width: '100%',
              height: '450px',
              background: `url(${performance.imageUrl}) center/cover`,
              borderRadius: 'var(--radius-2xl)',
              marginBottom: 'var(--spacing-2xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border-light)'
            }} />
          )}
          
          <div className="card" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)'
            }} />
            <h1 style={{ 
              margin: '0 0 var(--spacing-lg) 0',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2
            }}>
              {performance.title}
            </h1>

            {performance.description && (
              <div style={{
                marginBottom: 'var(--spacing-xl)',
                padding: 'var(--spacing-xl)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                borderRadius: 'var(--radius-lg)',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                fontSize: '1rem',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border-light)'
              }}>
                {performance.description}
              </div>
            )}

          {performance.performers && performance.performers.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <div style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: '0.9375rem',
                marginBottom: 'var(--spacing-md)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                출연진
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                {performance.performers.map((p) => (
                  <span 
                    key={p} 
                    className="badge badge-primary"
                    style={{ 
                      padding: '0.5rem 1rem',
                      fontSize: '0.9375rem',
                      fontWeight: '600'
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-xl)',
              padding: 'var(--spacing-xl)',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-light)'
            }}>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  공연장
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700',
                  color: 'var(--color-text)'
                }}>
                  {performance.venue}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  공연 일시
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700',
                  color: 'var(--color-text)'
                }}>
                  {formatDateTime(performance.performanceDateTime)}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  티켓 가격
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                  {performance.advPrice ? (
                    <div>
                      <div style={{ marginBottom: '0.375rem' }}>
                        <span style={{ 
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: '1.25rem'
                        }}>
                          사전예매: {performance.advPrice.toLocaleString()}원
                        </span>
                      </div>
                      {performance.doorPrice && (
                        <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                          현장예매: {performance.doorPrice.toLocaleString()}원
                        </div>
                      )}
                    </div>
                  ) : performance.doorPrice ? (
                    <div>
                      <span style={{ 
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: '1.25rem'
                      }}>
                        현장예매: {performance.doorPrice.toLocaleString()}원
                      </span>
                    </div>
                  ) : (
                    <div style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '1.25rem'
                    }}>
                      {performance.price.toLocaleString()}원
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  남은 티켓
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text)' }}>
                  <span style={{ 
                    color: performance.remainingSeats < 10 ? 'var(--color-error)' : 'var(--color-success)'
                  }}>
                    {performance.remainingSeats}
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9375rem', marginLeft: '0.25rem' }}>
                    / {performance.totalSeats}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ 
            position: 'sticky', 
            top: '120px',
            padding: 'var(--spacing-xl)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)'
            }} />
            <h2 style={{ 
              margin: '0 0 var(--spacing-xl) 0',
              fontSize: '1.5rem',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              color: 'var(--color-text)'
            }}>
              티켓 구매
            </h2>

            {error && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1.5px solid var(--color-error-light)',
                color: 'var(--color-error)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)',
                fontSize: '0.9375rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-md)', 
                fontWeight: '700',
                fontSize: '0.9375rem',
                color: 'var(--color-text)'
              }}>
                수량
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-lg)',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary"
                  disabled={quantity <= 1}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    padding: 0,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  −
                </button>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '800',
                  minWidth: '60px',
                  textAlign: 'center',
                  color: 'var(--color-text)'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(performance.remainingSeats, quantity + 1))}
                  className="btn btn-secondary"
                  disabled={quantity >= performance.remainingSeats}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    padding: 0,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>


            <div style={{
              padding: 'var(--spacing-xl)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-xl)',
              border: '1px solid var(--color-border-light)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)',
                alignItems: 'center'
              }}>
                <span style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  fontWeight: '500'
                }}>
                  티켓 가격
                </span>
                <span style={{ 
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)'
                }}>
                  {ticketPrice.toLocaleString()}원 × {quantity}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1.5px solid var(--color-border)',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700',
                  color: 'var(--color-text)'
                }}>
                  총 결제 금액
                </span>
                <span style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing || performance.remainingSeats === 0}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                fontSize: '1.125rem', 
                padding: '1rem',
                fontWeight: '700',
                boxShadow: 'var(--shadow-colored)'
              }}
            >
              {purchasing ? '구매 중...' : performance.remainingSeats === 0 ? '매진' : '티켓 구매하기'}
            </button>

            {performance.remainingSeats === 0 && (
              <div style={{ 
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1.5px solid var(--color-error-light)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                color: 'var(--color-error)',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}>
                ⚠️ 매진되었습니다
              </div>
            )}
            
            {performance.remainingSeats > 0 && performance.remainingSeats < 10 && (
              <div style={{ 
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                border: '1.5px solid var(--color-warning)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                color: 'var(--color-warning)',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}>
                ⚡ 남은 티켓이 {performance.remainingSeats}장뿐입니다!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

