import { useState, memo, useCallback } from 'react';
import type { Comment } from '../types';
import { apiClient } from '../lib/api';
import { isAdmin } from '../utils/auth';

interface CommentListProps {
  comments: Comment[];
  onReply?: (parentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => void;
}

const CommentList = memo(function CommentList({ comments, onReply, onDelete }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);
  const [userIsAdmin] = useState(() => isAdmin());

  if (comments.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-2xl)',
        color: 'var(--color-text-secondary)'
      }}>
        <p style={{ margin: 0, fontSize: '0.9375rem' }}>댓글이 없습니다.</p>
      </div>
    );
  }

  // 최상위 댓글(parentId가 없는 것)과 대댓글을 분리
  const topLevelComments = comments.filter(c => !c.parentId);
  const repliesByParent = comments
    .filter(c => c.parentId)
    .reduce((acc, reply) => {
      const parentId = reply.parentId!;
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(reply);
      return acc;
    }, {} as Record<string, Comment[]>);

  const handleReply = useCallback(async (parentId: string) => {
    // 함수 내부에서 최신 state를 참조하기 위해 함수형 업데이트 사용
    setReplyContent(prev => {
      const content = prev[parentId]?.trim();
      if (!content || !onReply) return prev;
      
      setSubmittingReply(parentId);
      // 비동기 작업은 즉시 실행
      (async () => {
        try {
          await onReply(parentId, content);
          setReplyContent(current => {
            const next = { ...current };
            delete next[parentId];
            return next;
          });
          setReplyingTo(null);
        } catch (error) {
          console.error('대댓글 작성 실패:', error);
          alert('대댓글 작성에 실패했습니다.');
        } finally {
          setSubmittingReply(null);
        }
      })();
      
      return prev;
    });
  }, [onReply]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
    
    try {
      await apiClient.deleteComment(commentId);
      if (onDelete) {
        onDelete(commentId);
      }
      alert('댓글이 삭제되었습니다.');
    } catch (error: any) {
      console.error('댓글 삭제 실패:', error);
      alert(error.message || '댓글 삭제에 실패했습니다.');
    }
  }, [onDelete]);

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const replies = repliesByParent[comment.id] || [];
    
    return (
      <div key={comment.id}>
        <div
          style={{
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-md)',
            marginLeft: isReply ? 'var(--spacing-xl)' : '0',
            background: isReply ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            border: isReply ? 'none' : '1px solid var(--color-border)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <span style={{ 
              fontWeight: '600',
              fontSize: '0.9375rem',
              color: comment.isAuthor ? 'var(--color-primary)' : 'var(--color-text)'
            }}>
              {comment.isAuthor ? '글쓴 익명' : '익명'}
            </span>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              <span style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '0.8125rem' 
              }}>
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}
              </span>
              {userIsAdmin && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    border: '1px solid var(--color-error)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: 'var(--color-error)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-error)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-error)';
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <div style={{ 
            color: 'var(--color-text)', 
            lineHeight: '1.7', 
            whiteSpace: 'pre-wrap',
            marginBottom: onReply && !isReply ? 'var(--spacing-sm)' : 0,
            fontSize: '0.9375rem'
          }}>
            {comment.content}
          </div>
          {!isReply && onReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              style={{
                padding: '0.375rem 0.75rem',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                color: 'var(--color-primary)',
                fontWeight: '500',
                marginTop: 'var(--spacing-sm)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              {replyingTo === comment.id ? '취소' : '답글'}
            </button>
          )}
          {replyingTo === comment.id && (
            <div style={{ 
              marginTop: 'var(--spacing-md)', 
              padding: 'var(--spacing-md)', 
              background: 'var(--color-bg-secondary)', 
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)'
            }}>
              <textarea
                value={replyContent[comment.id] || ''}
                onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                placeholder="대댓글을 입력하세요..."
                className="input"
                style={{
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '0.9375rem'
                }}
              />
              <button
                onClick={() => handleReply(comment.id)}
                disabled={!replyContent[comment.id]?.trim() || submittingReply === comment.id}
                className="btn btn-primary"
                style={{ 
                  marginTop: 'var(--spacing-sm)',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem'
                }}
              >
                {submittingReply === comment.id ? '작성 중...' : '작성'}
              </button>
            </div>
          )}
        </div>
        {replies.length > 0 && (
          <div style={{ marginLeft: 'var(--spacing-lg)', paddingLeft: 'var(--spacing-md)', borderLeft: '2px solid var(--color-border)' }}>
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {topLevelComments.map(comment => renderComment(comment))}
    </div>
  );
});

export default CommentList;
