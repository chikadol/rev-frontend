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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText || `HTTP error! status: ${response.status}`;
        
        // JSON 형식의 에러 응답 파싱 시도
        try {
          const errorJson = JSON.parse(errorText);
          console.error('API 에러 응답:', errorJson);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // JSON 파싱 실패 시 원본 텍스트 사용
          console.error('API 에러 응답 (텍스트):', errorText);
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
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

  // Threads
  async getThreads(
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
}

export const apiClient = new ApiClient(API_BASE_URL);

