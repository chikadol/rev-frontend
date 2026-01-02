// API Response Types
export interface Board {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  boardId?: string;
  parentThreadId?: string;
  authorId?: string;
  isPrivate: boolean;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  tags: string[];
}

export interface ThreadDetail {
  thread: Thread;
  commentCount: number;
  bookmarkCount: number;
  reactions: Record<string, number>;
  myReaction?: string;
  bookmarked: boolean;
}

export interface Comment {
  id: string;
  threadId: string;
  authorId?: string;
  parentId?: string;
  content: string;
  createdAt?: string;
  isAuthor?: boolean; // 게시물 작성자인지 여부
}

export interface Notification {
  id: string;
  type: string;
  threadId: string;
  commentId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MeOverview {
  threadCount: number;
  commentCount: number;
  bookmarkCount: number;
  unreadNotificationCount: number;
}

export interface BookmarkedThread {
  threadId: string;
  title: string;
  boardId?: string;
  boardName?: string;
  createdAt?: string;
  bookmarkedAt?: string;
}

export interface MyComment {
  commentId: string;
  threadId: string;
  threadTitle: string;
  boardId?: string;
  boardName?: string;
  content: string;
  createdAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ToggleReactionResponse {
  toggled: boolean;
  counts: Record<string, number>;
}

export interface BookmarkCountResponse {
  count: number;
}

// Ticket Types
export interface Performance {
  id: string;
  title: string;
  description?: string;
  venue: string;
  performanceDateTime: string;
  price: number;
  advPrice?: number; // 사전예매 가격
  doorPrice?: number; // 현장예매 가격
  totalSeats: number;
  remainingSeats: number;
  imageUrl?: string;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  idolId?: string;
  performers?: string[];
}

export interface Ticket {
  id: string;
  performanceId: string;
  performanceTitle: string;
  performanceDateTime: string;
  venue: string;
  price: number;
  seatNumber?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  purchaseDate?: string;
}

export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  paymentMethod: 'NAVER_PAY' | 'TOSS' | 'KAKAO_PAY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentUrl?: string; // 결제 URL (결제 제공자로 리다이렉트)
}

export interface Idol {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

