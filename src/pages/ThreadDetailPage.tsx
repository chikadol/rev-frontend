import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { ThreadDetail, Comment } from '../types';
import CommentList from '../components/CommentList';

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const [threadDetail, setThreadDetail] = useState<ThreadDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!threadId) return;
    
    Promise.all([
      apiClient.getThread(threadId),
      apiClient.getComments(threadId)
    ])
      .then(([detail, commentsData]) => {
        setThreadDetail(detail);
        setComments(commentsData);
      })
      .catch((err) => {
        console.error('게시글 로드 실패:', err);
        setThreadDetail(null);
      })
      .finally(() => setLoading(false));
  }, [threadId]);

  const handleToggleReaction = async (type: string) => {
    if (!threadId) return;
    try {
      const result = await apiClient.toggleReaction(threadId, type);
      if (threadDetail) {
        setThreadDetail({
          ...threadDetail,
          reactions: result.counts,
          myReaction: result.toggled ? type : undefined
        });
      }
    } catch (error) {
      console.error('반응 토글 실패:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!threadId) return;
    try {
      await apiClient.toggleBookmark(threadId);
      if (threadDetail) {
        setThreadDetail({
          ...threadDetail,
          bookmarked: !threadDetail.bookmarked
        });
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || !newComment.trim()) return;
    
    try {
      const comment = await apiClient.createComment({
        threadId,
        content: newComment
      });
      setComments([...comments, comment]);
      setNewComment('');
      if (threadDetail) {
        setThreadDetail({
          ...threadDetail,
          commentCount: threadDetail.commentCount + 1
        });
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!threadId) return;
    
    const comment = await apiClient.createComment({
      threadId,
      content,
      parentId
    });
    setComments([...comments, comment]);
    if (threadDetail) {
      setThreadDetail({
        ...threadDetail,
        commentCount: threadDetail.commentCount + 1
      });
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

  if (!threadDetail) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          게시글을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const thread = threadDetail.thread;

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link
          to={`/boards/${thread.boardId}`}
          style={{ 
            color: 'var(--color-text-secondary)', 
            textDecoration: 'none',
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}
        >
          ← 게시판으로
        </Link>
      </div>

      <article className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ 
          margin: '0 0 var(--spacing-md) 0',
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          lineHeight: '1.3'
        }}>
          {thread.title}
        </h1>
        
        <div style={{ 
          marginBottom: 'var(--spacing-md)', 
          display: 'flex',
          gap: 'var(--spacing-md)',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          <span>{thread.authorId ? thread.authorId.substring(0, 8) : '익명'}</span>
          <span>·</span>
          <span>
            {thread.createdAt ? new Date(thread.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : '-'}
          </span>
        </div>

        {thread.tags && thread.tags.length > 0 && (
          <div style={{ 
            marginBottom: 'var(--spacing-lg)', 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            flexWrap: 'wrap' 
          }}>
            {thread.tags.map(tag => (
              <span
                key={tag}
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-primary)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: '500'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-xl)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          fontSize: '1rem',
          color: 'var(--color-text)'
        }}>
          {thread.content}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              onClick={() => handleToggleReaction('LIKE')}
              className="btn btn-secondary"
              style={{
                background: threadDetail.myReaction === 'LIKE' ? '#ecfdf5' : 'var(--color-bg)',
                borderColor: threadDetail.myReaction === 'LIKE' ? '#10b981' : 'var(--color-border)',
                color: threadDetail.myReaction === 'LIKE' ? '#10b981' : 'var(--color-text)'
              }}
            >
              👍 좋아요 {threadDetail.reactions.LIKE || 0}
            </button>
            <button
              onClick={() => handleToggleReaction('LOVE')}
              className="btn btn-secondary"
              style={{
                background: threadDetail.myReaction === 'LOVE' ? '#fef2f2' : 'var(--color-bg)',
                borderColor: threadDetail.myReaction === 'LOVE' ? '#ef4444' : 'var(--color-border)',
                color: threadDetail.myReaction === 'LOVE' ? '#ef4444' : 'var(--color-text)'
              }}
            >
              ❤️ 사랑해요 {threadDetail.reactions.LOVE || 0}
            </button>
          </div>
          
          <button
            onClick={handleToggleBookmark}
            className="btn btn-secondary"
            style={{
              background: threadDetail.bookmarked ? '#fffbeb' : 'var(--color-bg)',
              borderColor: threadDetail.bookmarked ? '#f59e0b' : 'var(--color-border)',
              color: threadDetail.bookmarked ? '#f59e0b' : 'var(--color-text)'
            }}
          >
            {threadDetail.bookmarked ? '★' : '☆'} 북마크 ({threadDetail.bookmarkCount})
          </button>

          <span style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: '0.9375rem'
          }}>
            💬 댓글 {threadDetail.commentCount}개
          </span>
        </div>
      </article>

      <section className="card">
        <h2 style={{ 
          margin: '0 0 var(--spacing-xl) 0',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          댓글
        </h2>
        
        <form onSubmit={handleSubmitComment} style={{ marginBottom: 'var(--spacing-xl)' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="input"
            style={{
              minHeight: '120px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            댓글 작성
          </button>
        </form>

        <CommentList comments={comments} onReply={handleReply} />
      </section>
    </div>
  );
}
