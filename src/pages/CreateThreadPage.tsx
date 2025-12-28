import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';

export default function CreateThreadPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const thread = await apiClient.createThread(boardId, {
        title: title.trim(),
        content: content.trim(),
        isPrivate
      });
      navigate(`/threads/${thread.id}`);
    } catch (err: any) {
      setError(err.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: 'var(--spacing-xl)',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '-0.02em'
      }}>
        새 글 작성
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
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
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
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
            rows={15}
            className="input"
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)', 
            cursor: 'pointer',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <span>비공개</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? '작성 중...' : '작성하기'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
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
