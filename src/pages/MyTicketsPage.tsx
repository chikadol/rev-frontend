import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Ticket, PageResponse } from '../types';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsPage, setTicketsPage] = useState<PageResponse<Ticket> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    apiClient.getMyTickets(page, 20)
      .then((pageData) => {
        setTicketsPage(pageData);
        setTickets(pageData.content);
      })
      .catch((err) => {
        console.error('내 티켓 로드 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        로딩 중...
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ 
        marginBottom: 'var(--spacing-xl)',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '-0.02em'
      }}>
        내 티켓
      </h1>

      {tickets.length === 0 ? (
        <div className="card" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎫</div>
          <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)' }}>
            구매한 티켓이 없습니다
          </p>
          <Link to="/performances" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
            공연 보러가기
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {tickets.map(ticket => (
              <div key={ticket.id} className="card" style={{ padding: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-sm) 0',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--color-text)'
                    }}>
                      {ticket.performanceTitle}
                    </h3>
                    <div style={{ 
                      marginBottom: 'var(--spacing-md)',
                      fontSize: '0.9375rem',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                        📍 {ticket.venue}
                      </p>
                      <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                        📅 {formatDateTime(ticket.performanceDateTime)}
                      </p>
                      <p style={{ margin: 0 }}>
                        💺 스탠딩 입장
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)'
                    }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)'
                      }}>
                        {ticket.price.toLocaleString()}원
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: ticket.status === 'CONFIRMED' ? '#dcfce7' :
                                    ticket.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                        color: ticket.status === 'CONFIRMED' ? '#166534' :
                               ticket.status === 'PENDING' ? '#92400e' : '#991b1b',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: '500'
                      }}>
                        {ticket.status === 'CONFIRMED' ? '확정' :
                         ticket.status === 'PENDING' ? '결제 대기' : '취소'}
                      </span>
                    </div>
                  </div>
                  {ticket.status === 'PENDING' && (
                    <Link
                      to={`/tickets/${ticket.id}/payment`}
                      className="btn btn-primary"
                    >
                      결제하기
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {ticketsPage && ticketsPage.totalPages > 1 && (
            <div style={{ 
              marginTop: 'var(--spacing-xl)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                이전
              </button>
              <span style={{ 
                padding: '0 var(--spacing-md)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9375rem'
              }}>
                {page + 1} / {ticketsPage.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(ticketsPage.totalPages - 1, p + 1))}
                disabled={page >= ticketsPage.totalPages - 1}
                className="btn btn-secondary"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

