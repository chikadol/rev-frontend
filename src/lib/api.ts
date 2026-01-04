import type {
  Board,
  Thread,
  ThreadDetail,
  Comment,
  Notification,
  MeOverview,
  BookmarkedThread,
  MyComment,
  PageResponse,
  ToggleReactionResponse,
  BookmarkCountResponse,
  Performance,
  Ticket,
  Payment,
} from '../types';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role?: "USER" | "IDOL";
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const responseData = await response.json();

      // 새로운 통일된 응답 형식 처리
      let tokenData;
      if (responseData.success !== undefined) {
        if (!responseData.success) {
          return null;
        }
        tokenData = responseData.data || responseData;
      } else {
        tokenData = responseData;
      }

      if (tokenData?.accessToken && tokenData?.refreshToken) {
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        return tokenData.accessToken;
      }

      return null;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // 401 에러 발생 시 토큰 갱신 시도
      if (response.status === 401 && retryCount === 0) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          // 새 토큰으로 재시도
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
          });
          
          const retryResponseData = await retryResponse.json();
          
          // 새로운 통일된 응답 형식 처리
          if (retryResponseData.success !== undefined) {
            if (!retryResponseData.success) {
              const errorMessage = retryResponseData.message || 
                                  retryResponseData.error?.message || 
                                  '요청 처리 중 오류가 발생했습니다.';
              throw new Error(errorMessage);
            }
            return retryResponseData.data !== undefined ? retryResponseData.data : retryResponseData;
          }

          if (!retryResponse.ok) {
            const errorMessage = retryResponseData.message || 
                              retryResponseData.error?.message || 
                              retryResponseData.error ||
                              `HTTP error! status: ${retryResponse.status}`;
            throw new Error(errorMessage);
          }

          return retryResponseData;
        } else {
          // 토큰 갱신 실패 - 로그아웃 처리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
      }

      const responseData = await response.json();

      // 새로운 통일된 응답 형식 처리
      if (responseData.success !== undefined) {
        if (!responseData.success) {
          const errorMessage = responseData.message || 
                              responseData.error?.message || 
                              '요청 처리 중 오류가 발생했습니다.';
          throw new Error(errorMessage);
        }
        // 성공 응답이면 data 필드 반환 (없으면 전체 응답 반환)
        return responseData.data !== undefined ? responseData.data : responseData;
      }

      // 기존 형식 호환성 (success 필드가 없으면 기존 방식)
      if (!response.ok) {
        const errorMessage = responseData.message || 
                            responseData.error?.message || 
                            responseData.error ||
                            `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error: any) {
      // 네트워크 에러 처리 (Failed to fetch 등)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${this.baseUrl})가 실행 중인지 확인해주세요.`
        );
      }
      throw error;
    }
  }

  // Auth
  async register(credentials: RegisterRequest): Promise<TokenResponse> {
    console.log('회원가입 요청:', credentials);
    return this.request<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    console.log('로그인 요청:', credentials);
    return this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe(): Promise<any> {
    return this.request('/api/me');
  }

  // Boards
  async getBoards(): Promise<Board[]> {
    return this.request<Board[]>('/api/boards');
  }

  async getBoard(id: string): Promise<Board> {
    return this.request<Board>(`/api/boards/${id}`);
  }

  async createBoard(data: { name: string; slug: string; description?: string }): Promise<Board> {
    return this.request<Board>('/api/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(boardId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/boards/${boardId}`, {
      method: 'DELETE',
    });
  }

  // Board Requests
  async createBoardRequest(data: { 
    name: string; 
    slug: string; 
    description?: string; 
    reason?: string 
  }): Promise<BoardRequest> {
    return this.request<BoardRequest>('/api/board-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBoardRequests(page: number = 0, size: number = 20): Promise<PageResponse<BoardRequest>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return this.request<PageResponse<BoardRequest>>(`/api/board-requests/my?${params.toString()}`);
  }

  async getPendingBoardRequests(page: number = 0, size: number = 20): Promise<PageResponse<BoardRequest>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return this.request<PageResponse<BoardRequest>>(`/api/board-requests/pending?${params.toString()}`);
  }

  async processBoardRequest(
    requestId: string, 
    approved: boolean, 
    comment?: string
  ): Promise<BoardRequest> {
    return this.request<BoardRequest>(`/api/board-requests/${requestId}/process`, {
      method: 'POST',
      body: JSON.stringify({ approved, comment }),
    });
  }

  // Threads
  async getThreads(
    boardId: string,
    page: number = 0,
    size: number = 20,
    tags?: string[],
    search?: string
  ): Promise<PageResponse<Thread>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }
    if (search) {
      params.append('search', search);
    }
    return this.request<PageResponse<Thread>>(
      `/api/threads/${boardId}/threads?${params.toString()}`
    );
  }

  async getThreadsOld(
    boardId: string,
    page: number = 0,
    size: number = 20,
    tags?: string[]
  ): Promise<PageResponse<Thread>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }
    return this.request<PageResponse<Thread>>(
      `/api/threads/${boardId}/threads?${params.toString()}`
    );
  }

  async getThread(threadId: string): Promise<ThreadDetail> {
    return this.request<ThreadDetail>(`/api/threads/${threadId}`);
  }

  async createThread(
    boardId: string,
    data: { title: string; content: string; isPrivate?: boolean }
  ): Promise<Thread> {
    return this.request<Thread>(`/api/threads/${boardId}/threads`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteThread(threadId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/threads/${threadId}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(threadId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/api/comments/threads/${threadId}`);
  }

  async createComment(data: {
    threadId: string;
    content: string;
    parentId?: string;
  }): Promise<Comment> {
    return this.request<Comment>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Reactions
  async toggleReaction(
    threadId: string,
    type: string
  ): Promise<ToggleReactionResponse> {
    return this.request<ToggleReactionResponse>(
      `/api/threads/${threadId}/reactions/${type}`,
      {
        method: 'POST',
      }
    );
  }

  // Bookmarks
  async toggleBookmark(threadId: string): Promise<{ toggled: boolean }> {
    return this.request<{ toggled: boolean }>(
      `/api/bookmarks/threads/${threadId}/toggle`,
      {
        method: 'POST',
      }
    );
  }

  async getBookmarkCount(threadId: string): Promise<BookmarkCountResponse> {
    return this.request<BookmarkCountResponse>(
      `/api/bookmarks/threads/${threadId}/count`
    );
  }

  // Notifications
  async getNotifications(
    page: number = 0,
    size: number = 20,
    type?: string
  ): Promise<PageResponse<Notification>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (type) {
      params.append('type', type);
    }
    return this.request<PageResponse<Notification>>(
      `/api/notifications?${params.toString()}`
    );
  }

  async markNotificationRead(notificationId: string): Promise<Notification> {
    return this.request<Notification>(
      `/api/notifications/${notificationId}/read`,
      {
        method: 'POST',
      }
    );
  }

  async markAllNotificationsRead(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('/api/notifications/read-all', {
      method: 'POST',
    });
  }

  async getUnreadNotificationCount(): Promise<{ unreadCount: number }> {
    return this.request<{ unreadCount: number }>(
      '/api/notifications/unread-count'
    );
  }

  // Me
  async getMeOverview(): Promise<MeOverview> {
    return this.request<MeOverview>('/api/me/overview');
  }

  async getMyBookmarks(page: number = 0, size: number = 20): Promise<PageResponse<BookmarkedThread>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    return this.request<PageResponse<BookmarkedThread>>(`/api/me/bookmarks/threads?${params.toString()}`);
  }

  async getMyComments(page: number = 0, size: number = 20): Promise<PageResponse<MyComment>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    return this.request<PageResponse<MyComment>>(`/api/me/comments?${params.toString()}`);
  }

  async getMyThreads(page: number = 0, size: number = 20): Promise<PageResponse<Thread>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    return this.request<PageResponse<Thread>>(`/api/me/threads?${params.toString()}`);
  }

  // Performances
  async getPerformances(): Promise<Performance[]> {
    return this.request<Performance[]>('/api/performances');
  }

  async getUpcomingPerformances(): Promise<Performance[]> {
    return this.request<Performance[]>('/api/performances/upcoming');
  }

  async getPerformance(id: string): Promise<Performance> {
    return this.request<Performance>(`/api/performances/${id}`);
  }

  async createPerformance(data: {
    title: string;
    description?: string;
    venue: string;
    performanceDateTime: string;
    advPrice?: number;
    doorPrice?: number;
    totalSeats: number;
    imageUrl?: string;
    idolId?: string;
    performers?: string[];
  }): Promise<Performance> {
    return this.request<Performance>('/api/performances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tickets
  async purchaseTicket(data: {
    performanceId: string;
    quantity?: number;
    seatNumber?: string;
  }): Promise<Ticket> {
    return this.request<Ticket>('/api/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify({
        performanceId: data.performanceId,
        quantity: data.quantity || 1,
        seatNumber: data.seatNumber,
      }),
    });
  }

  async getMyTickets(page: number = 0, size: number = 20): Promise<PageResponse<Ticket>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    return this.request<PageResponse<Ticket>>(`/api/tickets/my?${params.toString()}`);
  }

  async getTicket(id: string): Promise<Ticket> {
    return this.request<Ticket>(`/api/tickets/${id}`);
  }

  // Payments
  async createPayment(data: {
    ticketId: string;
    paymentMethod: 'NAVER_PAY' | 'TOSS' | 'KAKAO_PAY';
  }): Promise<Payment> {
    return this.request<Payment>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentByTicketId(ticketId: string): Promise<Payment | null> {
    return this.request<Payment | null>(`/api/payments/ticket/${ticketId}`);
  }

  // Crawler (Admin)
  async triggerCrawl(clear: boolean = false, fast: boolean = false): Promise<{ message: string }> {
    const params = new URLSearchParams();
    if (clear) {
      params.append('clear', 'true');
    }
    if (fast) {
      params.append('fast', 'true');
    } else {
      params.append('fast', 'false');
    }
    return this.request<{ message: string }>(
      `/api/admin/agito-crawler/crawl?${params.toString()}`,
      {
        method: 'POST',
      }
    );
  }

  async triggerAgitoCrawl(clear: boolean = false): Promise<{ message: string }> {
    const params = new URLSearchParams();
    if (clear) {
      params.append('clear', 'true');
    }
    return this.request<{ message: string }>(
      `/api/admin/agito-crawler/crawl-agito?${params.toString()}`,
      {
        method: 'POST',
      }
    );
  }

  // Idols
  async getIdols(): Promise<Array<{ id: string; name: string; description?: string; imageUrl?: string }>> {
    return this.request('/api/idols');
  }

  async getIdol(id: string) {
    return this.request(`/api/idols/${id}`);
  }

  async getIdolPerformances(id: string): Promise<Performance[]> {
    return this.request<Performance[]>(`/api/idols/${id}/performances`);
  }

  async createIdol(data: { name: string; description?: string; imageUrl?: string }) {
    return this.request('/api/idols', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin - User Management
  async getUsers(page: number = 0, size: number = 20): Promise<PageResponse<UserManagement>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return this.request<PageResponse<UserManagement>>(`/api/admin/users?${params.toString()}`);
  }

  async getUser(userId: string): Promise<UserManagement> {
    return this.request<UserManagement>(`/api/admin/users/${userId}`);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request<void>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId: string, role: 'USER' | 'IDOL' | 'ADMIN'): Promise<UserManagement> {
    return this.request<UserManagement>(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }
}

export interface UserManagement {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'IDOL' | 'ADMIN';
  createdAt?: string;
}

export const apiClient = new ApiClient(API_BASE_URL);

