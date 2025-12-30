import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Idol } from '../types';

export default function CreatePerformancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idols, setIdols] = useState<Idol[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    performanceDateTime: '',
    advPrice: '',
    doorPrice: '',
    totalSeats: '',
    imageUrl: '',
    idolId: '',
    performers: [] as string[],
  });
  
  const [performerInput, setPerformerInput] = useState('');

  useEffect(() => {
    // 아이돌 목록 불러오기
    const fetchIdols = async () => {
      try {
        const data = await apiClient.getIdols();
        setIdols(data);
      } catch (err) {
        console.error('아이돌 목록 로드 실패:', err);
      }
    };
    fetchIdols();
  }, []);

  const handleAddPerformer = () => {
    const trimmed = performerInput.trim();
    if (trimmed && !formData.performers.includes(trimmed)) {
      setFormData({
        ...formData,
        performers: [...formData.performers, trimmed],
      });
      setPerformerInput('');
    }
  };

  const handleRemovePerformer = (index: number) => {
    setFormData({
      ...formData,
      performers: formData.performers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 필수 필드 검증
      if (!formData.title.trim()) {
        throw new Error('공연 제목을 입력해주세요.');
      }
      if (!formData.venue.trim()) {
        throw new Error('장소를 입력해주세요.');
      }
      if (!formData.performanceDateTime) {
        throw new Error('공연 일시를 입력해주세요.');
      }
      if (!formData.totalSeats || parseInt(formData.totalSeats) <= 0) {
        throw new Error('총 좌석 수를 올바르게 입력해주세요.');
      }

      // 날짜 형식 변환 (YYYY-MM-DDTHH:mm -> ISO 8601)
      const dateTime = new Date(formData.performanceDateTime).toISOString();

      const requestData: any = {
        title: formData.title.trim(),
        venue: formData.venue.trim(),
        performanceDateTime: dateTime,
        totalSeats: parseInt(formData.totalSeats),
        performers: formData.performers,
      };

      // 선택적 필드 추가
      if (formData.description.trim()) {
        requestData.description = formData.description.trim();
      }
      if (formData.advPrice && !isNaN(parseInt(formData.advPrice))) {
        requestData.advPrice = parseInt(formData.advPrice);
      }
      if (formData.doorPrice && !isNaN(parseInt(formData.doorPrice))) {
        requestData.doorPrice = parseInt(formData.doorPrice);
      }
      if (formData.imageUrl.trim()) {
        requestData.imageUrl = formData.imageUrl.trim();
      }
      if (formData.idolId) {
        requestData.idolId = formData.idolId;
      }

      await apiClient.createPerformance(requestData);
      
      // 성공 시 공연 목록 페이지로 이동
      navigate('/performances');
    } catch (err: any) {
      setError(err.message || '공연 등록에 실패했습니다.');
      console.error('공연 등록 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl)' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        marginBottom: 'var(--spacing-xl)',
        color: 'var(--color-text)'
      }}>
        공연 등록
      </h1>

      {error && (
        <div style={{
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          background: '#fee',
          color: '#c33',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* 공연 제목 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            공연 제목 <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
            placeholder="예: 지하돌A 라이브 공연"
          />
        </div>

        {/* 공연 설명 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            공연 설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="공연에 대한 상세 설명을 입력해주세요."
          />
        </div>

        {/* 장소 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            장소 <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
            placeholder="예: 홍대 라이브홀"
          />
        </div>

        {/* 공연 일시 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            공연 일시 <span style={{ color: '#c33' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="datetime-local"
              value={formData.performanceDateTime}
              onChange={(e) => setFormData({ ...formData, performanceDateTime: e.target.value })}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                paddingRight: '3rem',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '1.25rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem'
            }}>
              📅
            </span>
          </div>
        </div>

        {/* 가격 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-xs)', 
              fontWeight: '500',
              fontSize: '0.9375rem',
              color: 'var(--color-text)'
            }}>
              사전예매 가격 (원)
            </label>
            <input
              type="number"
              value={formData.advPrice}
              onChange={(e) => setFormData({ ...formData, advPrice: e.target.value })}
              min="0"
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
              placeholder="25000"
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-xs)', 
              fontWeight: '500',
              fontSize: '0.9375rem',
              color: 'var(--color-text)'
            }}>
              현장예매 가격 (원)
            </label>
            <input
              type="number"
              value={formData.doorPrice}
              onChange={(e) => setFormData({ ...formData, doorPrice: e.target.value })}
              min="0"
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
              placeholder="30000"
            />
          </div>
        </div>

        {/* 총 좌석 수 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            총 좌석 수 <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            type="number"
            value={formData.totalSeats}
            onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
            required
            min="1"
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
            placeholder="100"
          />
        </div>

        {/* 아이돌 선택 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            아이돌 (선택)
          </label>
          <select
            value={formData.idolId}
            onChange={(e) => setFormData({ ...formData, idolId: e.target.value })}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
          >
            <option value="">선택 안 함</option>
            {idols.map((idol) => (
              <option key={idol.id} value={idol.id}>
                {idol.name}
              </option>
            ))}
          </select>
        </div>

        {/* 출연진 */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            출연진
          </label>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
            <input
              type="text"
              value={performerInput}
              onChange={(e) => setPerformerInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPerformer();
                }
              }}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)'
              }}
              placeholder="출연진 이름 입력 후 Enter 또는 추가 버튼 클릭"
            />
            <button
              type="button"
              onClick={handleAddPerformer}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                fontSize: '0.9375rem',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              추가
            </button>
          </div>
          {formData.performers.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'var(--spacing-xs)',
              marginTop: 'var(--spacing-xs)'
            }}>
              {formData.performers.map((performer, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: '0.3rem 0.7rem',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {performer}
                  <button
                    type="button"
                    onClick={() => handleRemovePerformer(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary-dark)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      marginLeft: '0.25rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 이미지 URL */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontWeight: '500',
            fontSize: '0.9375rem',
            color: 'var(--color-text)'
          }}>
            이미지 URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)'
            }}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
          <button
            type="button"
            onClick={() => navigate('/performances')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              fontSize: '1rem',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: loading ? 'var(--color-text-secondary)' : 'var(--color-primary)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? '등록 중...' : '공연 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}

