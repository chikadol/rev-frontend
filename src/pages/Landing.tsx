import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const cards = [
    {
      title: '공연 정보',
      desc: '다가오는 공연 일정을 확인하고 티켓을 예매하세요',
      action: () => navigate('/performances'),
      icon: '🎫',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      hoverGradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
    },
    {
      title: '아이돌 목록',
      desc: '지하아이돌 정보를 탐색하고 새로운 아티스트를 발견하세요',
      action: () => navigate('/idols'),
      icon: '🌟',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      hoverGradient: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)'
    },
    {
      title: '커뮤니티',
      desc: '아티스트와 팬들이 함께하는 자유로운 소통 공간',
      action: () => navigate('/boards'),
      icon: '💬',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      hoverGradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
    },
    {
      title: '내 티켓',
      desc: '구매한 티켓과 예매 현황을 한눈에 관리하세요',
      action: () => navigate('/my-tickets'),
      icon: '🎟️',
      gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      hoverGradient: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)'
    },
    {
      title: '알림 센터',
      desc: '새로운 댓글과 공지사항을 놓치지 마세요',
      action: () => navigate('/notifications'),
      icon: '🔔',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      hoverGradient: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)'
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--spacing-3xl)',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      {/* Hero Section */}
      <section
        className="card card-gradient"
        style={{
          padding: 'var(--spacing-3xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
          color: 'white',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-2xl)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ 
            margin: '0 0 var(--spacing-sm) 0', 
            letterSpacing: '0.1em', 
            fontWeight: 600, 
            fontSize: '0.875rem',
            opacity: 0.9,
            textTransform: 'uppercase'
          }}>
            RE-V LIVE HUB
          </p>
          <h1 style={{ 
            margin: '0 0 var(--spacing-md) 0', 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.04em',
            lineHeight: 1.1
          }}>
            지하아이돌 공연과<br />
            커뮤니티를 한 곳에서
          </h1>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.9)', 
            lineHeight: 1.7,
            fontSize: '1.125rem',
            maxWidth: '600px'
          }}>
            리브에서 공연 일정 확인부터 티켓 예매, 팬 커뮤니티까지.<br />
            모든 것을 한 화면에서 시작하세요.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/performances')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '1rem',
              padding: '0.875rem 2rem',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            공연 정보 보러가기 →
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/boards')}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              fontSize: '1rem',
              padding: '0.875rem 2rem',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            커뮤니티 둘러보기 →
          </button>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section>
        <div style={{ 
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}>
          <div>
            <h2 style={{ 
              margin: '0 0 var(--spacing-xs) 0',
              fontSize: '2rem', 
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)'
            }}>
              빠른 시작
            </h2>
            <p style={{ 
              margin: 0,
              color: 'var(--color-text-secondary)',
              fontSize: '1rem'
            }}>
              원하는 기능을 바로 선택하세요
            </p>
          </div>
        </div>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}
        >
          {cards.map((card, index) => (
            <button
              key={card.title}
              onClick={card.action}
              className="card card-hover"
              style={{
                textAlign: 'left',
                padding: 'var(--spacing-xl)',
                border: '1px solid var(--color-border-light)',
                background: 'var(--color-bg-card)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: card.gradient,
                transition: 'all var(--transition-base)'
              }} />
              
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: 'var(--spacing-md)',
                display: 'inline-block',
                transform: 'scale(1)',
                transition: 'transform var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0)';
              }}
              >
                {card.icon}
              </div>
              
              <h3
                style={{
                  margin: '0 0 var(--spacing-sm) 0',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  background: card.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {card.title}
              </h3>
              
              <p style={{ 
                margin: 0, 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '0.9375rem'
              }}>
                {card.desc}
              </p>
              
              <div style={{
                marginTop: 'var(--spacing-md)',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: 0,
                transform: 'translateX(-10px)',
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget.closest('button');
                if (card) {
                  const arrow = card.querySelector('[data-arrow]') as HTMLElement;
                  if (arrow) {
                    arrow.style.opacity = '1';
                    arrow.style.transform = 'translateX(0)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.closest('button');
                if (card) {
                  const arrow = card.querySelector('[data-arrow]') as HTMLElement;
                  if (arrow) {
                    arrow.style.opacity = '0';
                    arrow.style.transform = 'translateX(-10px)';
                  }
                }
              }}
              >
                <span data-arrow style={{ transition: 'all var(--transition-base)' }}>바로가기 →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}
      >
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: 'var(--spacing-md)'
          }}>
            📅
          </div>
          <h4 style={{ 
            margin: '0 0 var(--spacing-sm) 0', 
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'var(--color-text)'
          }}>
            실시간 공연 일정
          </h4>
          <p style={{ 
            margin: '0 0 var(--spacing-md) 0', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.6,
            fontSize: '0.9375rem'
          }}>
            공연 캘린더에서 날짜를 클릭해 예정된 공연을 빠르게 확인하고 티켓을 예매하세요.
          </p>
          <Link 
            to="/performances" 
            style={{ 
              color: 'var(--color-primary)',
              fontWeight: '600',
              fontSize: '0.9375rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            공연 보러가기 →
          </Link>
        </div>
        
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: 'var(--spacing-md)'
          }}>
            💬
          </div>
          <h4 style={{ 
            margin: '0 0 var(--spacing-sm) 0', 
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'var(--color-text)'
          }}>
            활발한 커뮤니티
          </h4>
          <p style={{ 
            margin: '0 0 var(--spacing-md) 0', 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.6,
            fontSize: '0.9375rem'
          }}>
            게시판을 만들거나, 관심 있는 주제의 게시판에 글을 남겨 소통하세요.
          </p>
          <Link 
            to="/boards" 
            style={{ 
              color: 'var(--color-primary)',
              fontWeight: '600',
              fontSize: '0.9375rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            게시판 열기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
