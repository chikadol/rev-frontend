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
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--color-text-secondary)', 
            textDecoration: 'none',
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          ← 게시판 목록
        </Link>
        <h1 style={{ 
          margin: '0 0 var(--spacing-sm) 0',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          {board.name}
        </h1>
        {board.description && (
          <p style={{ 
            margin: 0,
            color: 'var(--color-text-secondary)', 
            fontSize: '0.9375rem'
          }}>
            {board.description}
          </p>
        )}
      </div>

      <div style={{ 
        marginBottom: 'var(--spacing-lg)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link
          to={`/boards/${boardId}/threads/new`}
          className="btn btn-primary"
        >
          + 새 글 작성
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {threads.content.length === 0 ? (
          <div style={{ 
            padding: 'var(--spacing-2xl)', 
            textAlign: 'center',
            color: 'var(--color-text-secondary)'
          }}>
            <p style={{ fontSize: '1.125rem', margin: 0 }}>게시글이 없습니다.</p>
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
                  padding: 'var(--spacing-lg)',
                  borderBottom: index < threads.content.length - 1 ? '1px solid var(--color-border)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      margin: '0 0 var(--spacing-sm) 0',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {thread.title}
                    </h3>
                    {thread.tags && thread.tags.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-sm)', 
                        flexWrap: 'wrap',
                        marginBottom: 'var(--spacing-sm)'
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
                            style={{
                              background: 'var(--color-bg-secondary)',
                              color: 'var(--color-primary)',
                              padding: '0.25rem 0.625rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.8125rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--color-primary)';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'var(--color-bg-secondary)';
                              e.currentTarget.style.color = 'var(--color-primary)';
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
                      color: 'var(--color-text-secondary)'
                    }}>
                      <span>{thread.authorId ? thread.authorId.substring(0, 8) : '익명'}</span>
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
