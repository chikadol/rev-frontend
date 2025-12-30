import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Thread, Board, PageResponse } from '../types';

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [threads, setThreads] = useState<PageResponse<Thread> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!boardId) return;
    
    Promise.all([
      apiClient.getBoard(boardId),
      apiClient.getThreads(boardId, page, 20, selectedTags.length > 0 ? selectedTags : undefined)
    ])
      .then(([boardData, threadsData]) => {
        setBoard(boardData);
        setThreads(threadsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [boardId, page, selectedTags]);

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

  if (!board || !threads) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          게시판을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--color-text-secondary)', 
            textDecoration: 'none',
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-lg)',
            fontWeight: '500',
            transition: 'all var(--transition-base)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          ← 게시판 목록
        </Link>
        <h1 style={{ 
          margin: '0 0 var(--spacing-sm) 0',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {board.name}
        </h1>
        {board.description && (
          <p style={{ 
            margin: 0,
            color: 'var(--color-text-secondary)', 
            fontSize: '0.9375rem',
            lineHeight: 1.6
          }}>
            {board.description}
          </p>
        )}
      </div>

      <div style={{ 
        marginBottom: 'var(--spacing-xl)', 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center' 
      }}>
        <Link
          to={`/boards/${boardId}/threads/new`}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <span>+</span>
          <span>새 글 작성</span>
        </Link>
      </div>

      <div className="card" style={{ 
        padding: 0, 
        overflow: 'hidden',
        border: '1px solid var(--color-border-light)'
      }}>
        {threads.content.length === 0 ? (
          <div style={{ 
            padding: 'var(--spacing-3xl)', 
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-bg-card)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
            <p style={{ fontSize: '1.125rem', margin: 0, fontWeight: '500' }}>게시글이 없습니다.</p>
            <p style={{ fontSize: '0.9375rem', marginTop: 'var(--spacing-sm)' }}>
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {threads.content.map((thread, index) => (
              <Link
                key={thread.id}
                to={`/threads/${thread.id}`}
                style={{
                  display: 'block',
                  padding: 'var(--spacing-xl)',
                  borderBottom: index < threads.content.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all var(--transition-base)',
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-lg)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-md) 0',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: 'var(--color-text)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {thread.title}
                    </h3>
                    {thread.tags && thread.tags.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-sm)', 
                        flexWrap: 'wrap',
                        marginBottom: 'var(--spacing-md)'
                      }}>
                        {thread.tags.map(tag => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!selectedTags.includes(tag)) {
                                setSelectedTags([...selectedTags, tag]);
                              }
                            }}
                            className="badge badge-primary"
                            style={{
                              fontSize: '0.8125rem',
                              padding: '0.375rem 0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ 
                      display: 'flex', 
                      gap: 'var(--spacing-md)', 
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-tertiary)',
                      fontWeight: '500'
                    }}>
                      <span>👤 {thread.authorId ? thread.authorId.substring(0, 8) : '익명'}</span>
                      <span>·</span>
                      <span>
                        {thread.createdAt ? new Date(thread.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {threads.totalPages > 1 && (
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
            {page + 1} / {threads.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(threads.totalPages - 1, p + 1))}
            disabled={page >= threads.totalPages - 1}
            className="btn btn-secondary"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
