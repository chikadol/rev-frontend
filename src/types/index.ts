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

