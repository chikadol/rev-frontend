import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { MeOverview, BookmarkedThread, MyComment, PageResponse } from '../types';

export default function MePage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<MeOverview | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedThread[]>([]);
  const [bookmarksPage, setBookmarksPage] = useState<PageResponse<BookmarkedThread> | null>(null);
  const [comments, setComments] = useState<MyComment[]>([]);
  const [commentsPage, setCommentsPage] = useState<PageResponse<MyComment> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'comments'>('overview');
  const [loading, setLoading] = useState(true);
  const [bookmarksPageNum, setBookmarksPageNum] = useState(0);
  const [commentsPageNum, setCommentsPageNum] = useState(0);

  useEffect(() => {
    apiClient.getMeOverview()
      .then(setOverview)
      .catch((err) => {
        console.error('내 정보 로드 실패:', err);
        // 인증 에러인 경우 로그인 페이지로 리다이렉트
        if (err.message?.includes('인증이 필요') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'bookmarks') {
      apiClient.getMyBookmarks(bookmarksPageNum, 20)
        .then((pageData) => {
          setBookmarksPage(pageData);
          setBookmarks(pageData.content);
        })
        .catch((err) => {
          console.error('북마크 로드 실패:', err);
          if (err.message?.includes('인증이 필요') || err.message?.includes('Unauthorized')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
          }
        });
    }
  }, [activeTab, bookmarksPageNum, navigate]);

  useEffect(() => {
    if (activeTab === 'comments') {
      apiClient.getMyComments(commentsPageNum, 20)
        .then((pageData) => {
          setCommentsPage(pageData);
          setComments(pageData.content);
        })
        .catch((err) => {
          console.error('댓글 로드 실패:', err);
          if (err.message?.includes('인증이 필요') || err.message?.includes('Unauthorized')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
          }
        });
    }
  }, [activeTab, commentsPageNum, navigate]);

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

  if (!overview) {
    return (
      <div>
        <h1 style={{ marginBottom: 'var(--spacing-xl)', fontSize: '2rem', fontWeight: '700' }}>내 정보</h1>
        <div className="card" style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: 'var(--color-error)',
        }}>
          <p style={{ margin: 0, fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
            정보를 불러올 수 없습니다.
          </p>
          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
            API 서버 연결을 확인하거나 잠시 후 다시 시도해주세요.
          </p>
        </div>
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
        내 정보
      </h1>

      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'transparent',
            color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? '600' : '400',
            fontSize: '0.9375rem',
            transition: 'all 0.2s ease'
          }}
        >
          요약
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'transparent',
            color: activeTab === 'bookmarks' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'bookmarks' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'bookmarks' ? '600' : '400',
            fontSize: '0.9375rem',
            transition: 'all 0.2s ease'
          }}
        >
          북마크
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: 'transparent',
            color: activeTab === 'comments' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'comments' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'comments' ? '600' : '400',
            fontSize: '0.9375rem',
            transition: 'all 0.2s ease'
          }}
        >
          내 댓글
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
              {overview.threadCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>작성한 글</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444', marginBottom: 'var(--spacing-sm)' }}>
              {overview.commentCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>작성한 댓글</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: 'var(--spacing-sm)' }}>
              {overview.bookmarkCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>북마크</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: 'var(--spacing-sm)' }}>
              {overview.unreadNotificationCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>읽지 않은 알림</div>
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', margin: 0 }}>
                북마크한 글이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {bookmarks.map(bookmark => (
                  <Link
                    key={bookmark.threadId}
                    to={`/threads/${bookmark.threadId}`}
                    className="card card-hover"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: 'var(--spacing-lg)'
                    }}
                  >
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-sm) 0', 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--color-text)'
                    }}>
                      {bookmark.title}
                    </h3>
                    {bookmark.boardName && (
                      <p style={{ 
                        margin: '0 0 var(--spacing-sm) 0', 
                        color: 'var(--color-text-secondary)', 
                        fontSize: '0.9375rem' 
                      }}>
                        {bookmark.boardName}
                      </p>
                    )}
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.875rem' 
                    }}>
                      {bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : '-'}
                    </p>
                  </Link>
                ))}
              </div>
              {bookmarksPage && bookmarksPage.totalPages > 1 && (
                <div style={{ 
                  marginTop: 'var(--spacing-xl)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  <button
                    onClick={() => setBookmarksPageNum(p => Math.max(0, p - 1))}
                    disabled={bookmarksPageNum === 0}
                    className="btn btn-secondary"
                  >
                    이전
                  </button>
                  <span style={{ 
                    padding: '0 var(--spacing-md)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem'
                  }}>
                    {bookmarksPageNum + 1} / {bookmarksPage.totalPages}
                  </span>
                  <button
                    onClick={() => setBookmarksPageNum(p => Math.min(bookmarksPage.totalPages - 1, p + 1))}
                    disabled={bookmarksPageNum >= bookmarksPage.totalPages - 1}
                    className="btn btn-secondary"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          {comments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', margin: 0 }}>
                작성한 댓글이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {comments.map(comment => (
                  <Link
                    key={comment.commentId}
                    to={`/threads/${comment.threadId}`}
                    className="card card-hover"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: 'var(--spacing-lg)'
                    }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                      <span style={{ 
                        fontWeight: '600', 
                        color: 'var(--color-text)',
                        fontSize: '1rem'
                      }}>
                        {comment.threadTitle}
                      </span>
                      {comment.boardName && (
                        <span style={{ 
                          marginLeft: 'var(--spacing-sm)', 
                          color: 'var(--color-text-secondary)', 
                          fontSize: '0.9375rem' 
                        }}>
                          ({comment.boardName})
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      margin: 'var(--spacing-sm) 0', 
                      color: 'var(--color-text)', 
                      lineHeight: '1.6',
                      fontSize: '0.9375rem'
                    }}>
                      {comment.content}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.875rem' 
                    }}>
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </p>
                  </Link>
                ))}
              </div>
              {commentsPage && commentsPage.totalPages > 1 && (
                <div style={{ 
                  marginTop: 'var(--spacing-xl)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}>
                  <button
                    onClick={() => setCommentsPageNum(p => Math.max(0, p - 1))}
                    disabled={commentsPageNum === 0}
                    className="btn btn-secondary"
                  >
                    이전
                  </button>
                  <span style={{ 
                    padding: '0 var(--spacing-md)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem'
                  }}>
                    {commentsPageNum + 1} / {commentsPage.totalPages}
                  </span>
                  <button
                    onClick={() => setCommentsPageNum(p => Math.min(commentsPage.totalPages - 1, p + 1))}
                    disabled={commentsPageNum >= commentsPage.totalPages - 1}
                    className="btn btn-secondary"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
