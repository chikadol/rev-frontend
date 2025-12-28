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
      .catch(console.error)
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
    return <div>로딩 중...</div>;
  }

  if (!notifications) {
    return <div>알림을 불러올 수 없습니다.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>알림</h1>
        {notifications.content.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            style={{
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            모두 읽음 처리
          </button>
        )}
      </div>

      {notifications.content.length === 0 ? (
        <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
          알림이 없습니다.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.content.map(notification => (
              <div
                key={notification.id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: notification.isRead ? 'white' : '#e8f4f8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {!notification.isRead && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: '#3498db',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }} />
                    )}
                    <span style={{ fontWeight: notification.isRead ? 'normal' : '500' }}>
                      {notification.message}
                    </span>
                  </div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                  {notification.threadId && (
                    <Link
                      to={`/threads/${notification.threadId}`}
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        color: '#3498db',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      게시글 보기 →
                    </Link>
                  )}
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      color: '#3498db',
                      border: '1px solid #3498db',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    읽음
                  </button>
                )}
              </div>
            ))}
          </div>

          {notifications.totalPages > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  background: page === 0 ? '#f5f5f5' : 'white',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                이전
              </button>
              <span style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
                {page + 1} / {notifications.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(notifications.totalPages - 1, p + 1))}
                disabled={page >= notifications.totalPages - 1}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  background: page >= notifications.totalPages - 1 ? '#f5f5f5' : 'white',
                  cursor: page >= notifications.totalPages - 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
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

