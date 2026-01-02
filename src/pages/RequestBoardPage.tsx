import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';

export default function RequestBoardPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiClient.createBoardRequest({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        reason: formData.reason.trim() || undefined
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/boards');
      }, 2000);
    } catch (err: any) {
      setError(err.message || '게시판 생성 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h1 style={{ 
          marginBottom: 'var(--spacing-xl)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          게시판 생성 요청
        </h1>
        <div className="card" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '2px solid var(--color-success)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
          <h2 style={{ 
            margin: '0 0 var(--spacing-md) 0',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-success)'
          }}>
            요청이 접수되었습니다!
          </h2>
          <p style={{ 
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: '0.9375rem',
            lineHeight: 1.6
          }}>
            관리자 검토 후 승인되면 게시판이 생성됩니다.
            <br />
            잠시 후 게시판 목록으로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ 
        marginBottom: 'var(--spacing-xs)',
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        게시판 생성 요청
      </h1>
      <p style={{
        margin: '0 0 var(--spacing-2xl) 0',
        color: 'var(--color-text-secondary)',
        fontSize: '0.9375rem'
      }}>
        게시판 생성을 요청하세요. 관리자 검토 후 승인됩니다.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--spacing-2xl)' }}>
        {error && (
          <div style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-error)',
            fontSize: '0.9375rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            게시판 이름 <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="input"
            placeholder="예: 자유게시판"
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            URL 슬러그 <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            required
            className="input"
            placeholder="예: free-board"
            pattern="[a-z0-9-]+"
          />
          <p style={{ 
            margin: 'var(--spacing-xs) 0 0 0',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)'
          }}>
            영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            게시판 설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={3}
            placeholder="게시판에 대한 간단한 설명을 입력하세요."
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            생성 요청 사유
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="input"
            rows={4}
            placeholder="이 게시판이 필요한 이유를 설명해주세요. (선택사항)"
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/boards')}
            className="btn btn-secondary"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.name.trim() || !formData.slug.trim()}
          >
            {loading ? '요청 중...' : '요청 제출'}
          </button>
        </div>
      </form>
    </div>
  );
}

