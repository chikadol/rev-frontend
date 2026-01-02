import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, type UserManagement } from '../lib/api';
import { isAdmin } from '../utils/auth';
import type { PageResponse } from '../types';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PageResponse<UserManagement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.');
      navigate('/');
      return;
    }

    apiClient.getUsers(page, 20)
      .then(setUsers)
      .catch((err) => {
        console.error('사용자 목록 로드 실패:', err);
        alert('사용자 목록을 불러올 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, [page, navigate]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('정말 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    
    setDeletingUserId(userId);
    try {
      await apiClient.deleteUser(userId);
      if (users) {
        setUsers({
          ...users,
          content: users.content.filter(u => u.id !== userId),
          totalElements: users.totalElements - 1
        });
      }
      alert('사용자가 삭제되었습니다.');
    } catch (error: any) {
      console.error('사용자 삭제 실패:', error);
      alert(error.message || '사용자 삭제에 실패했습니다.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'USER' | 'IDOL' | 'ADMIN') => {
    setUpdatingUserId(userId);
    try {
      const updated = await apiClient.updateUserRole(userId, newRole);
      if (users) {
        setUsers({
          ...users,
          content: users.content.map(u => u.id === userId ? updated : u)
        });
      }
      alert('권한이 변경되었습니다.');
    } catch (error: any) {
      console.error('권한 변경 실패:', error);
      alert(error.message || '권한 변경에 실패했습니다.');
    } finally {
      setUpdatingUserId(null);
    }
  };

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

  if (!users) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          사용자 목록을 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return '관리자';
      case 'IDOL': return '지하아이돌';
      case 'USER': return '일반 유저';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#ef4444';
      case 'IDOL': return '#6366f1';
      case 'USER': return '#6c757d';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div>
      <h1 style={{ 
        margin: '0 0 var(--spacing-xl) 0',
        fontSize: '2rem',
        fontWeight: '700',
        letterSpacing: '-0.02em'
      }}>
        사용자 관리
      </h1>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <p style={{ 
          margin: 0, 
          color: 'var(--color-text-secondary)', 
          fontSize: '0.9375rem',
          lineHeight: '1.6'
        }}>
          총 <strong>{users.totalElements}</strong>명의 사용자가 등록되어 있습니다.
        </p>
      </div>

      {users.content.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
            등록된 사용자가 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.9375rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                  }}>
                    이메일
                  </th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                  }}>
                    사용자명
                  </th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                  }}>
                    권한
                  </th>
                  <th style={{ 
                    padding: 'var(--spacing-md)', 
                    textAlign: 'right',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                  }}>
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.content.map(user => (
                  <tr 
                    key={user.id}
                    style={{ 
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      {user.username}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value as 'USER' | 'IDOL' | 'ADMIN')}
                        disabled={updatingUserId === user.id}
                        style={{
                          padding: '0.375rem 0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius)',
                          background: 'var(--color-bg)',
                          color: getRoleColor(user.role),
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          cursor: updatingUserId === user.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="USER">일반 유저</option>
                        <option value="IDOL">지하아이돌</option>
                        <option value="ADMIN">관리자</option>
                      </select>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUserId === user.id}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: 'var(--color-error)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          color: 'white',
                          fontSize: '0.8125rem',
                          fontWeight: '500',
                          cursor: deletingUserId === user.id ? 'not-allowed' : 'pointer',
                          opacity: deletingUserId === user.id ? 0.6 : 1
                        }}
                      >
                        {deletingUserId === user.id ? '삭제 중...' : '🗑️ 삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-xl)'
            }}>
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                처음
              </button>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                이전
              </button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 var(--spacing-md)',
                color: 'var(--color-text-secondary)'
              }}>
                {page + 1} / {users.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(users.totalPages - 1, p + 1))}
                disabled={page >= users.totalPages - 1}
                className="btn btn-secondary"
              >
                다음
              </button>
              <button
                onClick={() => setPage(users.totalPages - 1)}
                disabled={page >= users.totalPages - 1}
                className="btn btn-secondary"
              >
                마지막
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

