import { useState, useEffect, useRef, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  placeholder,
  onError,
  onLoad
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Intersection Observer를 사용한 lazy loading
    if (loading === 'lazy' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLoaded && !hasError) {
              setImageSrc(src);
              setIsLoaded(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      // eager loading 또는 IntersectionObserver 미지원 브라우저
      setImageSrc(src);
      setIsLoaded(true);
    }
  }, [src, loading, isLoaded, hasError]);

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  if (hasError && !placeholder) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-secondary)',
          color: 'var(--color-text-secondary)',
          fontSize: '0.875rem'
        }}
        aria-label={alt}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc || placeholder}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
    />
  );
});

export default OptimizedImage;

