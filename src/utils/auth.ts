// JWT 토큰에서 사용자 정보 추출
export function getUserRole(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // roles가 배열인 경우 첫 번째 요소, 문자열인 경우 그대로 사용
    const roles = payload.roles;
    if (Array.isArray(roles) && roles.length > 0) {
      return roles[0];
    } else if (typeof roles === 'string') {
      return roles;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN';
}

