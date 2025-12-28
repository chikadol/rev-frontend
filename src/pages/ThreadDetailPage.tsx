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
      .catch(console.error)
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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!threadDetail) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const thread = threadDetail.thread;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to={`/boards/${thread.boardId}`}
          style={{ color: '#3498db', textDecoration: 'none' }}
        >
          ← 게시판으로
        </Link>
      </div>

      <article style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>{thread.title}</h1>
        
        <div style={{ marginBottom: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          <span>작성자: {thread.authorId ? thread.authorId.substring(0, 8) : '익명'}</span>
          <span style={{ marginLeft: '1rem' }}>
            작성일: {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : '-'}
          </span>
        </div>

        {thread.tags && thread.tags.length > 0 && (
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {thread.tags.map(tag => (
              <span
                key={tag}
                style={{
                  background: '#e8f4f8',
                  color: '#3498db',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {thread.content}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleToggleReaction('LIKE')}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                background: threadDetail.myReaction === 'LIKE' ? '#e8f5e9' : 'white',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              좋아요 {threadDetail.reactions.LIKE || 0}
            </button>
            <button
              onClick={() => handleToggleReaction('LOVE')}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                background: threadDetail.myReaction === 'LOVE' ? '#fce4ec' : 'white',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              사랑해요 {threadDetail.reactions.LOVE || 0}
            </button>
          </div>
          
          <button
            onClick={handleToggleBookmark}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              background: threadDetail.bookmarked ? '#fff3cd' : 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            {threadDetail.bookmarked ? '★' : '☆'} 북마크 ({threadDetail.bookmarkCount})
          </button>

          <span style={{ color: '#7f8c8d' }}>
            댓글 {threadDetail.commentCount}개
          </span>
        </div>
      </article>

      <section style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>댓글</h2>
        
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '2rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            댓글 작성
          </button>
        </form>

        <CommentList comments={comments} />
      </section>
    </div>
  );
}

