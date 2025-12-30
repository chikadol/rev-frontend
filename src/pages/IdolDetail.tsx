import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Performance } from '../types';

type Idol = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};

export default function IdolDetail() {
  const { idolId } = useParams<{ idolId: string }>();
  const [idol, setIdol] = useState<Idol | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!idolId) return;
      try {
        const [idolRes, perfRes] = await Promise.all([
          apiClient.getIdol(idolId),
          apiClient.getIdolPerformances(idolId),
        ]);
        setIdol(idolRes as Idol);
        setPerformances(perfRes);
      } catch (err: any) {
        setError(err.message || '아이돌 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idolId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--color-text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🌟</div>
          <div>불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !idol) {
    return (
      <div className="card" style={{ 
        padding: 'var(--spacing-2xl)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>😕</div>
        <p style={{ 
          color: 'var(--color-error)', 
          margin: '0 0 var(--spacing-lg) 0',
          fontSize: '1.125rem',
          fontWeight: '500'
        }}>
          {error || '아이돌 정보를 찾을 수 없습니다.'}
        </p>
        <Link 
          to="/idols" 
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          목록으로 돌아가기
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link 
          to="/idols" 
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
          ← 아이돌 목록
        </Link>
      </div>

      <div className="card" style={{ 
        padding: 'var(--spacing-2xl)', 
        display: 'flex', 
        gap: 'var(--spacing-xl)', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)'
        }} />
        
        {idol.imageUrl ? (
          <img 
            src={idol.imageUrl} 
            alt={idol.name} 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: 'var(--radius-xl)', 
              objectFit: 'cover',
              boxShadow: 'var(--shadow-md)',
              border: '3px solid var(--color-border-light)'
            }} 
          />
        ) : (
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: 'var(--radius-xl)', 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '3rem', 
            fontWeight: '800',
            color: 'white',
            boxShadow: 'var(--shadow-md)'
          }}>
            {idol.name.slice(0, 1)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            margin: '0 0 var(--spacing-sm) 0', 
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', 
            fontWeight: '800',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {idol.name}
          </h1>
          {idol.description && (
            <p style={{ 
              margin: 0, 
              color: 'var(--color-text-secondary)', 
              lineHeight: 1.7,
              fontSize: '1rem'
            }}>
              {idol.description}
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ 
          marginBottom: 'var(--spacing-xl)', 
          fontSize: '1.75rem', 
          fontWeight: '700',
          letterSpacing: '-0.01em',
          color: 'var(--color-text)'
        }}>
          라이브/공연 정보
        </h2>
        {performances.length === 0 ? (
          <div className="card" style={{ 
            padding: 'var(--spacing-3xl)', 
            textAlign: 'center',
            background: 'var(--color-bg-card)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎫</div>
            <p style={{ 
              margin: 0, 
              color: 'var(--color-text-secondary)',
              fontSize: '1.125rem',
              fontWeight: '500'
            }}>
              등록된 공연이 없습니다.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            {performances.map((p, index) => (
              <Link
                key={p.id}
                to={`/performances/${p.id}`}
                className="card card-hover"
                style={{ 
                  padding: 'var(--spacing-xl)', 
                  textDecoration: 'none', 
                  color: 'inherit',
                  animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-lg)'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-sm) 0', 
                      fontSize: '1.25rem', 
                      fontWeight: '700',
                      color: 'var(--color-text)',
                      lineHeight: 1.3
                    }}>
                      {p.title}
                    </h3>
                    <div style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      marginBottom: 'var(--spacing-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📍</span>
                        <span>{p.venue}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🕐</span>
                        <span>{formatDateTime(p.performanceDateTime)}</span>
                      </div>
                    </div>
                    {p.performers && p.performers.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: 'var(--spacing-sm)'
                      }}>
                        {p.performers.slice(0, 3).map((performer, idx) => (
                          <span
                            key={idx}
                            className="badge badge-primary"
                            style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                          >
                            {performer}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 'var(--spacing-sm)',
                    minWidth: '120px'
                  }}>
                    <div>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {(p.advPrice || p.doorPrice || p.price).toLocaleString()}원
                      </span>
                    </div>
                    <span className="badge" style={{
                      background: p.status === 'UPCOMING' 
                        ? 'rgba(59, 130, 246, 0.1)' 
                        : p.status === 'ONGOING'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(148, 163, 184, 0.1)',
                      color: p.status === 'UPCOMING' 
                        ? 'var(--color-info)' 
                        : p.status === 'ONGOING'
                        ? 'var(--color-success)'
                        : 'var(--color-text-tertiary)',
                      border: 'none',
                      fontSize: '0.8125rem',
                      padding: '0.375rem 0.75rem',
                      fontWeight: '600'
                    }}>
                      {p.status === 'UPCOMING' ? '예정' : p.status === 'ONGOING' ? '진행중' : '종료'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
