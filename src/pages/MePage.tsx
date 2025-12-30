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
        marginBottom: 'var(--spacing-xs)',
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        내 정보
      </h1>
      <p style={{
        margin: '0 0 var(--spacing-2xl) 0',
        color: 'var(--color-text-secondary)',
        fontSize: '0.9375rem'
      }}>
        내 활동 내역과 통계를 확인하세요
      </p>

      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        borderBottom: '2px solid var(--color-border-light)',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: activeTab === 'overview' 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' 
              : 'transparent',
            color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? '700' : '500',
            fontSize: '0.9375rem',
            transition: 'all var(--transition-base)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
          }}
        >
          요약
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: activeTab === 'bookmarks' 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' 
              : 'transparent',
            color: activeTab === 'bookmarks' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'bookmarks' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'bookmarks' ? '700' : '500',
            fontSize: '0.9375rem',
            transition: 'all var(--transition-base)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
          }}
        >
          북마크
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            background: activeTab === 'comments' 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' 
              : 'transparent',
            color: activeTab === 'comments' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'comments' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'comments' ? '700' : '500',
            fontSize: '0.9375rem',
            transition: 'all var(--transition-base)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
          }}
        >
          내 댓글
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)'
            }} />
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'var(--spacing-md)' 
            }}>
              {overview.threadCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: '500' }}>작성한 글</div>
          </div>
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-error) 0%, #dc2626 100%)'
            }} />
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: 'var(--color-error)',
              marginBottom: 'var(--spacing-md)' 
            }}>
              {overview.commentCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: '500' }}>작성한 댓글</div>
          </div>
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-warning) 0%, #d97706 100%)'
            }} />
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: 'var(--color-warning)',
              marginBottom: 'var(--spacing-md)' 
            }}>
              {overview.bookmarkCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: '500' }}>북마크</div>
          </div>
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-success) 0%, #059669 100%)'
            }} />
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: 'var(--color-success)',
              marginBottom: 'var(--spacing-md)' 
            }}>
              {overview.unreadNotificationCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', fontWeight: '500' }}>읽지 않은 알림</div>
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-3xl)',
              background: 'var(--color-bg-card)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🔖</div>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '1.125rem', 
                margin: 0,
                fontWeight: '500'
              }}>
                북마크한 글이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {bookmarks.map((bookmark, index) => (
                  <Link
                    key={bookmark.threadId}
                    to={`/threads/${bookmark.threadId}`}
                    className="card card-hover"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: 'var(--spacing-xl)',
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-md) 0', 
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: 'var(--color-text)',
                      lineHeight: 1.3
                    }}>
                      {bookmark.title}
                    </h3>
                    {bookmark.boardName && (
                      <div style={{ 
                        marginBottom: 'var(--spacing-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span className="badge" style={{
                          fontSize: '0.8125rem',
                          padding: '0.375rem 0.75rem'
                        }}>
                          {bookmark.boardName}
                        </span>
                      </div>
                    )}
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--color-text-tertiary)', 
                      fontSize: '0.875rem',
                      fontWeight: '500'
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
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-3xl)',
              background: 'var(--color-bg-card)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>💬</div>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '1.125rem', 
                margin: 0,
                fontWeight: '500'
              }}>
                작성한 댓글이 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {comments.map((comment, index) => (
                  <Link
                    key={comment.commentId}
                    to={`/threads/${comment.threadId}`}
                    className="card card-hover"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: 'var(--spacing-xl)',
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                      <span style={{ 
                        fontWeight: '700', 
                        color: 'var(--color-text)',
                        fontSize: '1.125rem',
                        lineHeight: 1.3
                      }}>
                        {comment.threadTitle}
                      </span>
                      {comment.boardName && (
                        <span className="badge" style={{
                          marginLeft: 'var(--spacing-sm)',
                          fontSize: '0.8125rem',
                          padding: '0.375rem 0.75rem'
                        }}>
                          {comment.boardName}
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      margin: 'var(--spacing-md) 0', 
                      color: 'var(--color-text)', 
                      lineHeight: '1.7',
                      fontSize: '0.9375rem',
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-light)'
                    }}>
                      {comment.content}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--color-text-tertiary)', 
                      fontSize: '0.875rem',
                      fontWeight: '500'
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
