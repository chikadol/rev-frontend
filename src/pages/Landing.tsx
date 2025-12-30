import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const cards = [
    {
      title: '공연 정보 보러가기',
      desc: '최신 공연 일정과 예매 정보를 확인하세요.',
      action: () => navigate('/performances'),
      icon: '🎫',
      color: 'var(--color-primary)'
    },
    {
      title: '아이돌 목록',
      desc: '지하아이돌 정보를 한눈에 보고 등록할 수 있습니다.',
      action: () => navigate('/idols'),
      icon: '🌟',
      color: '#f39c12'
    },
    {
      title: '커뮤니티 게시판',
      desc: '아티스트 소식과 후기를 자유롭게 공유하세요.',
      action: () => navigate('/boards'),
      icon: '💬',
      color: 'var(--color-accent)'
    },
    {
      title: '내 티켓',
      desc: '구매한 티켓과 예매 현황을 한눈에 확인하세요.',
      action: () => navigate('/my-tickets'),
      icon: '🎟️',
      color: '#6c5ce7'
    },
    {
      title: '알림 센터',
      desc: '새 댓글과 공지 알림을 확인하세요.',
      action: () => navigate('/notifications'),
      icon: '🔔',
      color: '#2d3436'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
      <section
        className="card"
        style={{
          padding: 'var(--spacing-2xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          background: 'linear-gradient(135deg, #111827, #1f2937)',
          color: 'white',
          border: 'none'
        }}
      >
          <p style={{ margin: 0, letterSpacing: '0.08em', fontWeight: 600, color: '#9ca3af' }}>
              RE-V LIVE HUB
          </p>
        <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          공연·커뮤니티를 한 번에
        </h1>
        <p style={{ margin: 0, color: '#d1d5db', lineHeight: 1.6 }}>
          리브에서 공연 일정 확인, 티켓, 커뮤니티까지 한 화면에서 시작해 보세요.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/performances')}>
            공연 정보 보러가기
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/boards')}>
            커뮤니티 둘러보기
          </button>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.4rem', fontWeight: 700 }}>
          바로가기
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}
        >
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              className="card card-hover"
              style={{
                textAlign: 'left',
                padding: 'var(--spacing-xl)',
                border: '1px solid var(--color-border)',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 'var(--spacing-sm)' }}>{card.icon}</div>
              <h3
                style={{
                  margin: '0 0 var(--spacing-xs) 0',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: card.color
                }}
              >
                {card.title}
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {card.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 'var(--spacing-xl)' }}>
        <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontWeight: 700 }}>도움말</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <li>공연: 상단 “공연 정보 보러가기” 또는 바로가기 카드로 이동</li>
          <li>커뮤니티: “커뮤니티 게시판” 카드로 이동 후 원하는 게시판 선택</li>
          <li>내 티켓/알림: 로그인 후 카드 클릭 시 바로 이동</li>
        </ul>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}
      >
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontWeight: 700 }}>오늘의 추천</h4>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            공연 캘린더에서 날짜를 클릭해 예정된 공연을 빠르게 확인하세요.
          </p>
          <Link to="/performances" className="btn btn-link" style={{ padding: 0, marginTop: 'var(--spacing-sm)' }}>
            공연 보러가기 →
          </Link>
        </div>
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontWeight: 700 }}>커뮤니티 시작하기</h4>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            게시판을 만들거나, 관심 게시판에 글을 남겨보세요.
          </p>
          <Link to="/boards" className="btn btn-link" style={{ padding: 0, marginTop: 'var(--spacing-sm)' }}>
            게시판 열기 →
          </Link>
        </div>
      </section>
    </div>
  );
}

