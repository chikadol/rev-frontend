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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '320px', color: 'var(--color-text-secondary)' }}>
        불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>아이돌 목록</h1>
      </div>

      <form onSubmit={handleCreate} className="card" style={{ padding: 'var(--spacing-xl)', display: 'grid', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>이름</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="그룹/아티스트 이름"
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>설명</label>
          <textarea
            className="input"
            style={{ minHeight: 80 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="소개 또는 메모 (선택)"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>이미지 URL</label>
          <input
            className="input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="썸네일 이미지 URL (선택)"
          />
        </div>
        {error && (
          <div style={{ color: 'var(--color-error)', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '등록 중...' : '아이돌 등록 (지하아이돌 권한 필요)'}
        </button>
      </form>

      {idols.length === 0 ? (
        <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>등록된 아이돌이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {idols.map((idol) => (
            <Link
              key={idol.id}
              to={`/idols/${idol.id}`}
              className="card card-hover"
              style={{ padding: 'var(--spacing-xl)', textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                {idol.imageUrl ? (
                  <img src={idol.imageUrl} alt={idol.name} style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {idol.name.slice(0, 1)}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>{idol.name}</div>
                  {idol.description && (
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {idol.description}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

