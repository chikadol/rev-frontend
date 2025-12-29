import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * 결제 콜백 페이지
 * 각 결제 서비스에서 결제 완료 후 이 페이지로 리다이렉트됩니다.
 */
export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    const method = searchParams.get('method');
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const pg_token = searchParams.get('pg_token'); // 카카오페이용

    // 결제 성공 시
    if (success === 'true') {
      // 결제 승인 처리는 백엔드에서 자동으로 처리되므로
      // 여기서는 내 티켓 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/my-tickets', {
          state: { 
            message: '결제가 완료되었습니다.',
            paymentMethod: method 
          }
        });
      }, 1000);
    } else {
      // 결제 실패/취소 시
      setTimeout(() => {
        navigate('/my-tickets', {
          state: { 
            message: '결제가 취소되었거나 실패했습니다.',
            error: true 
          }
        });
      }, 1000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px',
      gap: 'var(--spacing-lg)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid var(--color-primary)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ 
        color: 'var(--color-text-secondary)', 
        fontSize: '1.125rem' 
      }}>
        결제 처리 중...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
