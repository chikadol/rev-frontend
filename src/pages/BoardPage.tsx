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
    return <div>로딩 중...</div>;
  }

  if (!board || !threads) {
    return <div>게시판을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>← 게시판 목록</Link>
        <h1 style={{ marginTop: '1rem' }}>{board.name}</h1>
        {board.description && <p style={{ color: '#7f8c8d' }}>{board.description}</p>}
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          to={`/boards/${boardId}/threads/new`}
          style={{
            background: '#3498db',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          새 글 작성
        </Link>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>제목</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>작성자</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {threads.content.map(thread => (
              <tr key={thread.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>
                  <Link
                    to={`/threads/${thread.id}`}
                    style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {thread.title}
                  </Link>
                  {thread.tags && thread.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {thread.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            background: '#e8f4f8',
                            color: '#3498db',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td style={{ padding: '1rem', color: '#7f8c8d' }}>
                  {thread.authorId ? thread.authorId.substring(0, 8) : '익명'}
                </td>
                <td style={{ padding: '1rem', color: '#7f8c8d' }}>
                  {thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {threads.totalPages > 1 && (
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
            {page + 1} / {threads.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(threads.totalPages - 1, p + 1))}
            disabled={page >= threads.totalPages - 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              background: page >= threads.totalPages - 1 ? '#f5f5f5' : 'white',
              cursor: page >= threads.totalPages - 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

