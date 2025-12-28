import type { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>댓글이 없습니다.</p>;
  }

  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          style={{
            padding: '1rem',
            borderBottom: '1px solid #eee',
            marginBottom: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>
              {comment.authorId ? comment.authorId.substring(0, 8) : '익명'}
            </span>
            <span style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
              {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : '-'}
            </span>
          </div>
          <div style={{ color: '#2c3e50', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </div>
        </div>
      ))}
    </div>
  );
}

