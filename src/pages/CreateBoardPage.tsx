import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';

export default function CreateBoardPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('이름과 slug를 입력해주세요.');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      setError('slug는 영문자, 숫자, 하이픈(-), 언더스코어(_)만 사용할 수 있습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const board = await apiClient.createBoard({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined
      });
      navigate(`/boards/${board.id}`);
    } catch (err: any) {
      setError(err.message || '게시판 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: 'var(--spacing-xl)',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '-0.02em'
      }}>
        게시판 생성
      </h1>
      
      {error && (
        <div className="card" style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: 'var(--color-error)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--spacing-xl)' }}>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-sm)', 
            fontWeight: '600',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            게시판 이름 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 자유게시판"
            required
            className="input"
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-sm)', 
            fontWeight: '600',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            Slug * (URL에 사용되는 식별자)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="예: free-board"
            required
            pattern="[a-zA-Z0-9_-]+"
            className="input"
          />
          <p style={{ 
            marginTop: 'var(--spacing-sm)', 
            fontSize: '0.875rem', 
            color: 'var(--color-text-secondary)' 
          }}>
            영문자, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-sm)', 
            fontWeight: '600',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="게시판에 대한 설명을 입력하세요 (선택사항)"
            rows={4}
            className="input"
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? '생성 중...' : '생성하기'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
