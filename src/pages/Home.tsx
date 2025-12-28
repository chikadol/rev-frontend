import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { Board } from '../types';

export default function Home() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient.getBoards()
            .then(setBoards)
            .catch((err) => {
                console.error('게시판 목록 로드 실패:', err);
                setError(err.message || '게시판 목록을 불러올 수 없습니다. API 서버 연결을 확인해주세요.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return (
            <div>
                <h1>게시판 목록</h1>
                <div style={{
                    padding: '2rem',
                    background: '#fee',
                    color: '#c33',
                    borderRadius: '8px',
                    marginTop: '2rem'
                }}>
                    <p style={{ margin: 0, fontWeight: '500' }}>오류가 발생했습니다</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{error}</p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            apiClient.getBoards()
                                .then(setBoards)
                                .catch((err) => {
                                    setError(err.message || '게시판 목록을 불러올 수 없습니다.');
                                })
                                .finally(() => setLoading(false));
                        }}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>게시판 목록</h1>
                <button
                    onClick={() => navigate('/boards/new')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    + 게시판 생성
                </button>
            </div>
            {boards.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#7f8c8d',
                    marginTop: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>등록된 게시판이 없습니다.</p>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>첫 번째 게시판을 만들어보세요!</p>
                    <button
                        onClick={() => navigate('/boards/new')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        게시판 생성하기
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    {boards.map(board => (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            style={{
                                display: 'block',
                                padding: '1.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{board.name}</h2>
                            {board.description && (
                                <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>{board.description}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}