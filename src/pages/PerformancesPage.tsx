import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Performance } from '../types';

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');

  useEffect(() => {
    const loadPerformances = filter === 'upcoming' 
      ? apiClient.getUpcomingPerformances()
      : apiClient.getPerformances();
    
    loadPerformances
      .then(setPerformances)
      .catch((err) => {
        console.error('공연 목록 로드 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [filter]);

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

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--spacing-xl)' 
      }}>
        <h1 style={{ 
          margin: 0,
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          공연 목록
        </h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => setFilter('upcoming')}
            className={filter === 'upcoming' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.9375rem' }}
          >
            예정된 공연
          </button>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.9375rem' }}
          >
            전체
          </button>
        </div>
      </div>

      {performances.length === 0 ? (
        <div className="card" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎤</div>
          <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)' }}>
            공연이 없습니다
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
            새로운 공연을 기다려주세요!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {performances.map(performance => (
            <Link
              key={performance.id}
              to={`/performances/${performance.id}`}
              className="card card-hover"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                overflow: 'hidden'
              }}
            >
              {performance.imageUrl && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: `url(${performance.imageUrl}) center/cover`,
                  marginBottom: 'var(--spacing-md)'
                }} />
              )}
              <div style={{ padding: 'var(--spacing-lg)' }}>
                <h2 style={{ 
                  margin: '0 0 var(--spacing-sm) 0', 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--color-text)'
                }}>
                  {performance.title}
                </h2>
                <div style={{ 
                  marginBottom: 'var(--spacing-md)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                    📍 {performance.venue}
                  </p>
                  <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                    📅 {formatDateTime(performance.performanceDateTime)}
                  </p>
                  <p style={{ margin: 0 }}>
                    💺 남은 좌석: {performance.remainingSeats} / {performance.totalSeats}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)'
                  }}>
                    {performance.price.toLocaleString()}원
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: performance.status === 'UPCOMING' ? '#dbeafe' : 
                                performance.status === 'ONGOING' ? '#dcfce7' : '#f3f4f6',
                    color: performance.status === 'UPCOMING' ? '#1e40af' :
                           performance.status === 'ONGOING' ? '#166534' : '#6b7280',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    {performance.status === 'UPCOMING' ? '예정' : 
                     performance.status === 'ONGOING' ? '진행중' : '종료'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

