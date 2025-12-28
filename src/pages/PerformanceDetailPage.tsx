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
  const [seatNumber, setSeatNumber] = useState('');
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
      setError(`남은 좌석이 부족합니다. (남은 좌석: ${performance.remainingSeats})`);
      return;
    }

    setPurchasing(true);
    setError('');

    try {
      const ticket = await apiClient.purchaseTicket({
        performanceId: id,
        quantity,
        seatNumber: seatNumber || undefined,
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

  const totalPrice = performance.price * quantity;

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link 
          to="/performances" 
          style={{ 
            color: 'var(--color-text-secondary)', 
            textDecoration: 'none',
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}
        >
          ← 공연 목록
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)' }}>
        <div>
          {performance.imageUrl && (
            <div style={{
              width: '100%',
              height: '400px',
              background: `url(${performance.imageUrl}) center/cover`,
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-xl)'
            }} />
          )}
          
          <div className="card">
            <h1 style={{ 
              margin: '0 0 var(--spacing-md) 0',
              fontSize: '2rem',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}>
              {performance.title}
            </h1>

            {performance.description && (
              <div style={{
                marginBottom: 'var(--spacing-xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                fontSize: '1rem',
                color: 'var(--color-text)'
              }}>
                {performance.description}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-lg)'
            }}>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  공연장
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {performance.venue}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  공연 일시
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {formatDateTime(performance.performanceDateTime)}
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  티켓 가격
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                  {performance.price.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  남은 좌석
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {performance.remainingSeats} / {performance.totalSeats}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h2 style={{ 
              margin: '0 0 var(--spacing-lg) 0',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              티켓 구매
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

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)', 
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                수량
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary"
                  disabled={quantity <= 1}
                  style={{ width: '40px', height: '40px', padding: 0 }}
                >
                  -
                </button>
                <span style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(performance.remainingSeats, quantity + 1))}
                  className="btn btn-secondary"
                  disabled={quantity >= performance.remainingSeats}
                  style={{ width: '40px', height: '40px', padding: 0 }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)', 
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                좌석 번호 (선택사항)
              </label>
              <input
                type="text"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                placeholder="예: A-12"
                className="input"
              />
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
                marginBottom: 'var(--spacing-sm)'
              }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>티켓 가격</span>
                <span>{performance.price.toLocaleString()}원 × {quantity}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border)'
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>총 결제 금액</span>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  color: 'var(--color-primary)'
                }}>
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing || performance.remainingSeats === 0}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: 'var(--spacing-md)' }}
            >
              {purchasing ? '구매 중...' : '티켓 구매하기'}
            </button>

            {performance.remainingSeats === 0 && (
              <p style={{ 
                marginTop: 'var(--spacing-md)',
                textAlign: 'center',
                color: 'var(--color-error)',
                fontSize: '0.9375rem'
              }}>
                매진되었습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

