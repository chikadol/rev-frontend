import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { MeOverview, BookmarkedThread, MyComment } from '../types';

export default function MePage() {
  const [overview, setOverview] = useState<MeOverview | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedThread[]>([]);
  const [comments, setComments] = useState<MyComment[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'comments'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.getMeOverview(),
      apiClient.getMyBookmarks(),
      apiClient.getMyComments()
    ])
      .then(([overviewData, bookmarksData, commentsData]) => {
        setOverview(overviewData);
        setBookmarks(bookmarksData);
        setComments(commentsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!overview) {
    return <div>정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>내 정보</h1>

      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '2px solid #ddd',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'overview' ? '#3498db' : 'transparent',
            color: activeTab === 'overview' ? 'white' : '#2c3e50',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #3498db' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? '500' : 'normal'
          }}
        >
          요약
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'bookmarks' ? '#3498db' : 'transparent',
            color: activeTab === 'bookmarks' ? 'white' : '#2c3e50',
            border: 'none',
            borderBottom: activeTab === 'bookmarks' ? '2px solid #3498db' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'bookmarks' ? '500' : 'normal'
          }}
        >
          북마크
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'comments' ? '#3498db' : 'transparent',
            color: activeTab === 'comments' ? 'white' : '#2c3e50',
            border: 'none',
            borderBottom: activeTab === 'comments' ? '2px solid #3498db' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'comments' ? '500' : 'normal'
          }}
        >
          내 댓글
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#e8f4f8',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
              {overview.threadCount}
            </div>
            <div style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>작성한 글</div>
          </div>
          <div style={{
            padding: '1.5rem',
            background: '#fce4ec',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e91e63' }}>
              {overview.commentCount}
            </div>
            <div style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>작성한 댓글</div>
          </div>
          <div style={{
            padding: '1.5rem',
            background: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
              {overview.bookmarkCount}
            </div>
            <div style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>북마크</div>
          </div>
          <div style={{
            padding: '1.5rem',
            background: '#d1ecf1',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
              {overview.unreadNotificationCount}
            </div>
            <div style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>읽지 않은 알림</div>
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
              북마크한 글이 없습니다.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookmarks.map(bookmark => (
                <Link
                  key={bookmark.threadId}
                  to={`/threads/${bookmark.threadId}`}
                  style={{
                    display: 'block',
                    padding: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                    {bookmark.title}
                  </h3>
                  {bookmark.boardName && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                      {bookmark.boardName}
                    </p>
                  )}
                  <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.875rem' }}>
                    {bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleDateString() : '-'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          {comments.length === 0 ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
              작성한 댓글이 없습니다.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.map(comment => (
                <Link
                  key={comment.commentId}
                  to={`/threads/${comment.threadId}`}
                  style={{
                    display: 'block',
                    padding: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                      {comment.threadTitle}
                    </span>
                    {comment.boardName && (
                      <span style={{ marginLeft: '0.5rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
                        ({comment.boardName})
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#34495e', lineHeight: '1.6' }}>
                    {comment.content}
                  </p>
                  <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.875rem' }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : '-'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

