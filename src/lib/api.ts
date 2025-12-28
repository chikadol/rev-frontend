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
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface LoginRequest {
  email: string;
  password: string;
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

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(credentials: LoginRequest): Promise<TokenResponse> {
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

  async getMyBookmarks(): Promise<BookmarkedThread[]> {
    return this.request<BookmarkedThread[]>('/api/me/bookmarks/threads');
  }

  async getMyComments(): Promise<MyComment[]> {
    return this.request<MyComment[]>('/api/me/comments');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
