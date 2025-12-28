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

    if (error) {
        return (
            <div>
                <h1 style={{ marginBottom: 'var(--spacing-xl)', fontSize: '2rem', fontWeight: '700' }}>게시판 목록</h1>
                <div className="card" style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: 'var(--color-error)',
                }}>
                    <p style={{ margin: 0, fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>오류가 발생했습니다</p>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>{error}</p>
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
                        className="btn btn-primary"
                        style={{ marginTop: 'var(--spacing-md)' }}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'var(--spacing-xl)' 
            }}>
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.02em' }}>게시판 목록</h1>
                <button
                    onClick={() => navigate('/boards/new')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.9375rem' }}
                >
                    + 게시판 생성
                </button>
            </div>
            
            {boards.length === 0 ? (
                <div className="card" style={{
                    padding: 'var(--spacing-2xl)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                    <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)' }}>
                        등록된 게시판이 없습니다
                    </p>
                    <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                        첫 번째 게시판을 만들어보세요!
                    </p>
                    <button
                        onClick={() => navigate('/boards/new')}
                        className="btn btn-primary"
                    >
                        게시판 생성하기
                    </button>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: 'var(--spacing-lg)' 
                }}>
                    {boards.map(board => (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            className="card card-hover"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: 'var(--spacing-xl)',
                                display: 'block'
                            }}
                        >
                            <h2 style={{ 
                                margin: '0 0 var(--spacing-md) 0', 
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--color-text)'
                            }}>
                                {board.name}
                            </h2>
                            {board.description && (
                                <p style={{ 
                                    margin: 0, 
                                    color: 'var(--color-text-secondary)', 
                                    fontSize: '0.9375rem',
                                    lineHeight: '1.5'
                                }}>
                                    {board.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
