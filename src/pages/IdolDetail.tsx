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
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>불러오는 중...</div>;
  }

  if (error || !idol) {
    return (
      <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
        <p style={{ color: 'var(--color-error)', margin: 0 }}>{error || '아이돌 정보를 찾을 수 없습니다.'}</p>
        <Link to="/idols" className="btn btn-link" style={{ padding: 0, marginTop: 'var(--spacing-sm)' }}>
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <div className="card" style={{ padding: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
        {idol.imageUrl ? (
          <img src={idol.imageUrl} alt={idol.name} style={{ width: 96, height: 96, borderRadius: 'var(--radius)', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 96, height: 96, borderRadius: 'var(--radius)', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
            {idol.name.slice(0, 1)}
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{idol.name}</h1>
          {idol.description && (
            <p style={{ margin: 'var(--spacing-xs) 0 0 0', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {idol.description}
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.4rem', fontWeight: 700 }}>라이브/공연 정보</h2>
        {performances.length === 0 ? (
          <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>등록된 공연이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {performances.map((p) => (
              <Link
                key={p.id}
                to={`/performances/${p.id}`}
                className="card card-hover"
                style={{ padding: 'var(--spacing-lg)', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{p.title}</h3>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(p.performanceDateTime).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                  {p.venue}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

