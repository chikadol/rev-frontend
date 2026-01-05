import { memo } from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'full';
}

const ErrorMessage = memo(function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  variant = 'inline'
}: ErrorMessageProps) {
  if (variant === 'full') {
    return (
      <div className="error-message-full">
        <div className="error-message-content">
          <svg
            className="error-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="error-text">
            <h3>오류가 발생했습니다</h3>
            <p>{error}</p>
          </div>
          {onDismiss && (
            <button className="error-dismiss" onClick={onDismiss} aria-label="닫기">
              ×
            </button>
          )}
        </div>
        {onRetry && (
          <button className="error-retry" onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="error-message-inline">
      <svg
        className="error-icon-small"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="error-text-inline">{error}</span>
      {onRetry && (
        <button className="error-retry-small" onClick={onRetry}>
          재시도
        </button>
      )}
      {onDismiss && (
        <button className="error-dismiss-small" onClick={onDismiss} aria-label="닫기">
          ×
        </button>
      )}
    </div>
  );
});

export default ErrorMessage;

