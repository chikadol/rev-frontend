import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Notification, PageResponse } from '../types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PageResponse<Notification> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    apiClient.getNotifications(page, 20)
      .then(setNotifications)
      .catch((err) => {
        console.error('알림 로드 실패:', err);
        setNotifications({
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 20,
          number: 0,
          first: true,
          last: true
        });
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleMarkRead = async (notificationId: string) => {
    try {
      await apiClient.markNotificationRead(notificationId);
      if (notifications) {
        setNotifications({
          ...notifications,
          content: notifications.content.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        });
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      if (notifications) {
        setNotifications({
          ...notifications,
          content: notifications.content.map(n => ({ ...n, isRead: true }))
        });
      }
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
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
        로딩 중...
      </div>
    );
  }

  if (!notifications) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          알림을 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--spacing-xl)' 
      }}>
        <h1 style={{ 
          margin: 0,
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          알림
        </h1>
        {notifications.content.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="btn btn-primary"
            style={{ fontSize: '0.9375rem' }}
          >
            모두 읽음 처리
          </button>
        )}
      </div>

      {notifications.content.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', margin: 0 }}>
            알림이 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {notifications.content.map(notification => (
              <div
                key={notification.id}
                className="card"
                style={{
                  background: notification.isRead ? 'var(--color-bg)' : '#eff6ff',
                  borderLeft: notification.isRead ? 'none' : '4px solid var(--color-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: 'var(--spacing-lg)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)', 
                    marginBottom: 'var(--spacing-sm)' 
                  }}>
                    {!notification.isRead && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: 'var(--color-primary)',
                        borderRadius: '50%',
                        display: 'inline-block',
                        flexShrink: 0
                      }} />
                    )}
                    <span style={{ 
                      fontWeight: notification.isRead ? '400' : '600',
                      fontSize: '0.9375rem',
                      color: 'var(--color-text)'
                    }}>
                      {notification.message}
                    </span>
                  </div>
                  <div style={{ 
                    color: 'var(--color-text-secondary)', 
                    fontSize: '0.8125rem',
                    marginBottom: notification.threadId ? 'var(--spacing-sm)' : 0
                  }}>
                    {new Date(notification.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {notification.threadId && (
                    <Link
                      to={`/threads/${notification.threadId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginTop: 'var(--spacing-sm)',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    >
                      게시글 보기 →
                    </Link>
                  )}
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="btn btn-secondary"
                    style={{ 
                      fontSize: '0.875rem',
                      marginLeft: 'var(--spacing-md)',
                      flexShrink: 0
                    }}
                  >
                    읽음
                  </button>
                )}
              </div>
            ))}
          </div>

          {notifications.totalPages > 1 && (
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
                {page + 1} / {notifications.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(notifications.totalPages - 1, p + 1))}
                disabled={page >= notifications.totalPages - 1}
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
