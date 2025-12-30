import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Performance } from '../types';

export default function PerformancesPage() {
  const navigate = useNavigate();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [crawling, setCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const loadPerformances = filter === 'upcoming' 
          ? apiClient.getUpcomingPerformances()
          : apiClient.getPerformances();

        const data = await loadPerformances;

        // 예정된 공연이 비어 있으면 전체 목록을 한 번 더 시도 (상태 플래그 오류 대비)
        if (filter === 'upcoming' && data.length === 0) {
          console.warn('예정된 공연이 비어 있습니다. 전체 공연을 다시 조회합니다.');
          const all = await apiClient.getPerformances();
          setPerformances(all);
        } else {
          setPerformances(data);
        }
      } catch (err) {
        console.error('공연 목록 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformances();
  }, [filter]);

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

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 날짜별로 그룹화
  const groupedByDate = performances.reduce((acc, performance) => {
    const date = new Date(performance.performanceDateTime);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(performance);
    return acc;
  }, {} as Record<string, Performance[]>);

  // 날짜 순으로 정렬
  const sortedDates = Object.keys(groupedByDate).sort();

  // 현재 선택된 날짜의 공연들
  const selectedDatePerformances = selectedDate 
    ? groupedByDate[selectedDate.toISOString().split('T')[0]] || []
    : [];

  // 월별 캘린더 데이터 생성 (현재 월 기준)
  const getCalendarDays = (targetMonth: Date) => {
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 주의 첫 날 (일요일)

    const days: (Date | null)[] = [];
    const currentDate = new Date(startDate);

    // 6주 × 7일 = 42일
    for (let i = 0; i < 42; i++) {
      if (currentDate < firstDay && currentDate.getMonth() !== month) {
        days.push(null);
      } else if (currentDate > lastDay && currentDate.getMonth() !== month) {
        days.push(null);
      } else {
        days.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = getCalendarDays(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasPerformances = (date: Date | null): boolean => {
    if (!date) return false;
    const dateKey = date.toISOString().split('T')[0];
    return !!groupedByDate[dateKey] && groupedByDate[dateKey].length > 0;
  };

  const getPerformanceCount = (date: Date | null): number => {
    if (!date) return 0;
    const dateKey = date.toISOString().split('T')[0];
    return groupedByDate[dateKey]?.length || 0;
  };

  const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
  };

  const handleCrawl = async (clear: boolean = false, fast: boolean = true) => {
    setCrawling(true);
    setCrawlMessage(null);
    try {
      // 타임아웃 설정 (30초)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), 30000)
      );
      
      const result = await Promise.race([
        apiClient.triggerCrawl(clear, fast),
        timeoutPromise
      ]) as { message: string };
      
      setCrawlMessage(result.message);
      setCrawling(false);
      
      // 크롤링 시작 후 잠시 대기 후 공연 목록 새로고침 (여러 번 시도)
      const refreshPerformances = async (attempt: number = 1) => {
        if (attempt > 5) return; // 최대 5번 시도
        
        setTimeout(async () => {
          try {
            const loadPerformances = filter === 'upcoming' 
              ? apiClient.getUpcomingPerformances()
              : apiClient.getPerformances();
            const data = await loadPerformances;
            if (data.length > 0 || attempt >= 5) {
              setPerformances(data);
            } else {
              refreshPerformances(attempt + 1);
            }
          } catch (error) {
            console.error('공연 목록 새로고침 실패:', error);
            if (attempt < 5) {
              refreshPerformances(attempt + 1);
            }
          }
        }, attempt * 3000); // 3초, 6초, 9초, 12초, 15초 간격으로 시도
      };
      
      refreshPerformances();
    } catch (error: any) {
      setCrawlMessage(error.message || '크롤링에 실패했습니다.');
      setCrawling(false);
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--spacing-2xl)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 var(--spacing-xs) 0',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            공연 일정
          </h1>
          <p style={{
            margin: 0,
            color: 'var(--color-text-secondary)',
            fontSize: '0.9375rem'
          }}>
            다가오는 공연을 확인하고 예매하세요
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('upcoming')}
            className={filter === 'upcoming' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ 
              fontSize: '0.9375rem',
              fontWeight: filter === 'upcoming' ? '600' : '500'
            }}
          >
            예정된 공연
          </button>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ 
              fontSize: '0.9375rem',
              fontWeight: filter === 'all' ? '600' : '500'
            }}
          >
            전체
          </button>
          <button
            onClick={() => handleCrawl(false)}
            disabled={crawling}
            className="btn btn-secondary"
            style={{ 
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            title="공연 정보 크롤링"
          >
            <span style={{ 
              display: 'inline-block',
              animation: crawling ? 'spin 1s linear infinite' : 'none'
            }}>
              🔄
            </span>
            {crawling ? '크롤링 중...' : '새로고침'}
          </button>
          {localStorage.getItem('accessToken') && (
            <button
              onClick={() => navigate('/performances/new')}
              className="btn btn-primary"
              style={{ 
                fontSize: '0.9375rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title="공연 등록 (지하아이돌 권한 필요)"
            >
              <span>+</span>
              <span>공연 등록</span>
            </button>
          )}
        </div>
      </div>

      {crawlMessage && (
        <div className="card" style={{
          marginBottom: 'var(--spacing-lg)',
          background: crawlMessage.includes('실패') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${crawlMessage.includes('실패') ? '#fecaca' : '#bbf7d0'}`,
          color: crawlMessage.includes('실패') ? 'var(--color-error)' : '#16a34a',
          padding: 'var(--spacing-md)',
          fontSize: '0.9375rem'
        }}>
          {crawlMessage}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '350px 1fr', 
        gap: 'var(--spacing-xl)',
        alignItems: 'start'
      }}>
        {/* 캘린더 */}
        <div className="card" style={{ 
          padding: 'var(--spacing-xl)',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <button
              onClick={goToPreviousMonth}
              className="btn btn-secondary"
              style={{ 
                padding: '0.625rem', 
                minWidth: '40px', 
                height: '40px',
                fontSize: '1.25rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)'
              }}
            >
              ‹
            </button>
            <div style={{ 
              textAlign: 'center',
              fontSize: '1.125rem',
              fontWeight: '700',
              color: 'var(--color-text)',
              letterSpacing: '-0.01em'
            }}>
              {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </div>
            <button
              onClick={goToNextMonth}
              className="btn btn-secondary"
              style={{ 
                padding: '0.625rem', 
                minWidth: '40px', 
                height: '40px',
                fontSize: '1.25rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)'
              }}
            >
              ›
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-md)'
          }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div key={day} style={{ 
                textAlign: 'center', 
                fontWeight: '700',
                fontSize: '0.8125rem',
                color: index === 0 ? 'var(--color-error)' : index === 6 ? 'var(--color-info)' : 'var(--color-text-secondary)',
                padding: 'var(--spacing-xs)'
              }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 'var(--spacing-xs)'
          }}>
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} style={{ aspectRatio: '1', padding: 'var(--spacing-xs)' }} />;
              }

              const dateKey = date.toISOString().split('T')[0];
              const hasPerf = hasPerformances(date);
              const perfCount = getPerformanceCount(date);
              const isToday = isSameDate(date, today);
              const isSelected = selectedDate && isSameDate(date, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    aspectRatio: '1',
                    padding: 'var(--spacing-xs)',
                    border: isSelected 
                      ? '2px solid var(--color-primary)' 
                      : isToday 
                        ? '2px solid var(--color-primary-light)' 
                        : '1.5px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected 
                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' 
                      : hasPerf 
                        ? 'rgba(139, 92, 246, 0.08)' 
                        : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isToday 
                        ? 'var(--color-primary)' 
                        : 'var(--color-text)',
                    fontWeight: isToday || isSelected ? '700' : hasPerf ? '600' : '500',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.background = hasPerf 
                        ? 'rgba(139, 92, 246, 0.15)' 
                        : 'var(--color-bg-secondary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = hasPerf 
                        ? 'rgba(139, 92, 246, 0.08)' 
                        : 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span>{date.getDate()}</span>
                  {hasPerf && perfCount > 0 && (
                    <span style={{ 
                      fontSize: '0.625rem',
                      marginTop: '2px',
                      opacity: isSelected ? 1 : 0.7,
                      fontWeight: '700',
                      background: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'var(--color-primary)',
                      color: isSelected ? 'white' : 'white',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.125rem 0.375rem',
                      minWidth: '18px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}>
                      {perfCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택된 날짜의 공연 목록 */}
        <div>
          {selectedDate ? (
            <div>
              <h2 style={{ 
                marginBottom: 'var(--spacing-lg)',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                {formatDate(selectedDate.toISOString())} 공연
              </h2>
              
              {selectedDatePerformances.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    이 날짜에 예정된 공연이 없습니다.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {selectedDatePerformances.map((performance, index) => (
                    <Link
                      key={performance.id}
                      to={`/performances/${performance.id}`}
                      className="card card-hover"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        padding: 'var(--spacing-xl)',
                        animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 'var(--spacing-xl)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            margin: '0 0 var(--spacing-md) 0', 
                            fontSize: '1.375rem',
                            fontWeight: '700',
                            letterSpacing: '-0.01em',
                            color: 'var(--color-text)',
                            lineHeight: 1.3
                          }}>
                            {performance.title}
                          </h3>
                          <div style={{ 
                            marginBottom: 'var(--spacing-md)', 
                            color: 'var(--color-text-secondary)', 
                            fontSize: '0.9375rem',
                            lineHeight: '1.6',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.1rem' }}>📍</span>
                              <span>{performance.venue}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.1rem' }}>🕐</span>
                              <span>{formatTime(performance.performanceDateTime)}</span>
                            </div>
                          </div>
                          {performance.description && (
                            <p style={{ 
                              margin: 0,
                              fontSize: '0.9375rem',
                              color: 'var(--color-text-secondary)',
                              lineHeight: '1.6',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {performance.description}
                            </p>
                          )}
                          {performance.performers && performance.performers.length > 0 && (
                            <div style={{
                              marginTop: 'var(--spacing-md)',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}>
                              {performance.performers.slice(0, 3).map((performer, idx) => (
                                <span
                                  key={idx}
                                  className="badge badge-primary"
                                  style={{
                                    fontSize: '0.8125rem',
                                    padding: '0.375rem 0.75rem'
                                  }}
                                >
                                  {performer}
                                </span>
                              ))}
                              {performance.performers.length > 3 && (
                                <span className="badge" style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}>
                                  +{performance.performers.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ 
                          textAlign: 'right',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 'var(--spacing-sm)',
                          minWidth: '120px'
                        }}>
                          <div>
                            <span style={{ 
                              fontSize: '1.75rem', 
                              fontWeight: '800', 
                              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              {performance.price.toLocaleString()}원
                            </span>
                          </div>
                          <span className="badge" style={{
                            background: performance.status === 'UPCOMING' 
                              ? 'rgba(59, 130, 246, 0.1)' 
                              : performance.status === 'ONGOING'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(148, 163, 184, 0.1)',
                            color: performance.status === 'UPCOMING' 
                              ? 'var(--color-info)' 
                              : performance.status === 'ONGOING'
                              ? 'var(--color-success)'
                              : 'var(--color-text-tertiary)',
                            border: 'none',
                            fontSize: '0.8125rem',
                            padding: '0.375rem 0.75rem',
                            fontWeight: '600'
                          }}>
                            {performance.status === 'UPCOMING' ? '예정' : performance.status === 'ONGOING' ? '진행중' : '종료'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
              <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)' }}>
                날짜를 선택하세요
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                좌측 캘린더에서 공연 날짜를 선택하면 상세 정보를 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}