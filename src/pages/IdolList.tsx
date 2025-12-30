import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Link } from 'react-router-dom';

type Idol = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};

export default function IdolList() {
  const [idols, setIdols] = useState<Idol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const data = await apiClient.getIdols();
      setIdols(data);
    } catch (err: any) {
      setError(err.message || '아이돌 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('이름을 입력하세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.createIdol({
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      });
      setName('');
      setDescription('');
      setImageUrl('');
      await load();
    } catch (err: any) {
      setError(err.message || '등록에 실패했습니다 (지하아이돌 권한 필요).');
    } finally {
      setSubmitting(false);
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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🌟</div>
          <div>불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
      <div>
        <h1 style={{ 
          margin: '0 0 var(--spacing-xs) 0',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          아이돌 목록
        </h1>
        <p style={{
          margin: 0,
          color: 'var(--color-text-secondary)',
          fontSize: '0.9375rem'
        }}>
          지하아이돌 정보를 탐색하고 새로운 아티스트를 발견하세요
        </p>
      </div>

      {localStorage.getItem('accessToken') && (
        <form onSubmit={handleCreate} className="card" style={{ 
          padding: 'var(--spacing-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)'
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
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--color-text)'
          }}>
            새 아이돌 등록
          </h2>
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.9375rem',
              color: 'var(--color-text)'
            }}>
              이름 <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="그룹/아티스트 이름"
              required
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.9375rem',
              color: 'var(--color-text)'
            }}>
              설명
            </label>
            <textarea
              className="input"
              style={{ 
                minHeight: '100px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="소개 또는 메모 (선택)"
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.9375rem',
              color: 'var(--color-text)'
            }}>
              이미지 URL
            </label>
            <input
              className="input"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="썸네일 이미지 URL (선택)"
            />
          </div>
          {error && (
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1.5px solid var(--color-error-light)',
              color: 'var(--color-error)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
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
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
            style={{ width: '100%', fontWeight: '600' }}
          >
            {submitting ? '등록 중...' : '아이돌 등록 (지하아이돌 권한 필요)'}
          </button>
        </form>
      )}

      {idols.length === 0 ? (
        <div className="card" style={{ 
          padding: 'var(--spacing-3xl)', 
          textAlign: 'center',
          background: 'var(--color-bg-card)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🌟</div>
          <p style={{ 
            margin: 0, 
            color: 'var(--color-text-secondary)',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}>
            등록된 아이돌이 없습니다.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-xl)'
        }}>
          {idols.map((idol, index) => (
            <Link
              key={idol.id}
              to={`/idols/${idol.id}`}
              className="card card-hover"
              style={{ 
                padding: 'var(--spacing-xl)', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'block',
                animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
              }}
            >
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)'
              }}>
                {idol.imageUrl ? (
                  <img 
                    src={idol.imageUrl} 
                    alt={idol.name} 
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: 'var(--radius-lg)', 
                      objectFit: 'cover',
                      boxShadow: 'var(--shadow-sm)'
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: 'var(--radius-lg)', 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {idol.name.slice(0, 1)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    color: 'var(--color-text)',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {idol.name}
                  </div>
                  {idol.description && (
                    <div style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {idol.description}
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                marginTop: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                <span>상세 보기</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
