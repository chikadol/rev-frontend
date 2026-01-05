import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// CSS 모킹
vi.mock('../../components/CommentList.css', () => ({}))

import ThreadDetailPage from '../ThreadDetailPage'

// API 클라이언트 모킹
const mockGetThread = vi.fn()
const mockGetComments = vi.fn()
const mockToggleReaction = vi.fn()
const mockToggleBookmark = vi.fn()
const mockCreateComment = vi.fn()
const mockDeleteThread = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    getThread: (...args: any[]) => mockGetThread(...args),
    getComments: (...args: any[]) => mockGetComments(...args),
    toggleReaction: (...args: any[]) => mockToggleReaction(...args),
    toggleBookmark: (...args: any[]) => mockToggleBookmark(...args),
    createComment: (...args: any[]) => mockCreateComment(...args),
    deleteThread: (...args: any[]) => mockDeleteThread(...args),
  },
}))

// useParams 모킹
const mockParams = { threadId: 'test-thread-id' }
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockParams,
    useNavigate: () => mockNavigate,
  }
})

// isAdmin 모킹
vi.mock('../../utils/auth', () => ({
  isAdmin: () => false,
}))

describe('ThreadDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderThreadDetailPage = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  it('로딩 상태 표시', () => {
    mockGetThread.mockImplementation(() => new Promise(() => {})) // 무한 대기
    mockGetComments.mockImplementation(() => new Promise(() => {}))

    renderThreadDetailPage()
    expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
  })

  it('게시글 상세 정보 표시', async () => {
    const mockThreadDetail = {
      thread: {
        id: 'test-thread-id',
        title: '테스트 게시글',
        content: '게시글 내용',
        authorId: 'user-1',
        boardId: 'board-1',
        createdAt: '2024-01-01T00:00:00Z',
        tags: ['태그1'],
      },
      reactions: { LIKE: 5, LOVE: 2 },
      myReaction: undefined,
      bookmarked: false,
      bookmarkCount: 3,
      commentCount: 2,
    }

    const mockComments = [
      {
        id: 'comment-1',
        content: '첫 번째 댓글',
        authorId: 'user-2',
        createdAt: '2024-01-01T01:00:00Z',
        parentId: null,
      },
    ]

    mockGetThread.mockResolvedValue(mockThreadDetail)
    mockGetComments.mockResolvedValue(mockComments)

    renderThreadDetailPage()

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글')).toBeInTheDocument()
      expect(screen.getByText('게시글 내용')).toBeInTheDocument()
      expect(screen.getByText(/좋아요 5/i)).toBeInTheDocument()
    })
  })

  it('게시글을 찾을 수 없을 때 메시지 표시', async () => {
    mockGetThread.mockRejectedValue(new Error('게시글을 찾을 수 없습니다'))
    mockGetComments.mockResolvedValue([])

    renderThreadDetailPage()

    await waitFor(() => {
      expect(screen.getByText(/게시글을 찾을 수 없습니다/i)).toBeInTheDocument()
    })
  })

  it('반응 버튼 클릭', async () => {
    const mockThreadDetail = {
      thread: {
        id: 'test-thread-id',
        title: '테스트 게시글',
        content: '게시글 내용',
        authorId: 'user-1',
        boardId: 'board-1',
        createdAt: '2024-01-01T00:00:00Z',
        tags: [],
      },
      reactions: { LIKE: 5, LOVE: 2 },
      myReaction: undefined,
      bookmarked: false,
      bookmarkCount: 3,
      commentCount: 0,
    }

    mockGetThread.mockResolvedValue(mockThreadDetail)
    mockGetComments.mockResolvedValue([])
    mockToggleReaction.mockResolvedValue({
      counts: { LIKE: 6, LOVE: 2 },
      toggled: true,
    })

    renderThreadDetailPage()

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글')).toBeInTheDocument()
    })

    const likeButton = screen.getByRole('button', { name: /좋아요/i })
    await userEvent.click(likeButton)

    await waitFor(() => {
      expect(mockToggleReaction).toHaveBeenCalledWith('test-thread-id', 'LIKE')
    })
  })

  it('댓글 작성', async () => {
    const user = userEvent.setup()
    const mockThreadDetail = {
      thread: {
        id: 'test-thread-id',
        title: '테스트 게시글',
        content: '게시글 내용',
        authorId: 'user-1',
        boardId: 'board-1',
        createdAt: '2024-01-01T00:00:00Z',
        tags: [],
      },
      reactions: { LIKE: 0, LOVE: 0 },
      myReaction: undefined,
      bookmarked: false,
      bookmarkCount: 0,
      commentCount: 0,
    }

    const mockNewComment = {
      id: 'comment-new',
      content: '새 댓글',
      authorId: 'user-2',
      createdAt: '2024-01-01T02:00:00Z',
      parentId: null,
    }

    mockGetThread.mockResolvedValue(mockThreadDetail)
    mockGetComments.mockResolvedValue([])
    mockCreateComment.mockResolvedValue(mockNewComment)

    renderThreadDetailPage()

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글')).toBeInTheDocument()
    })

    const commentInput = screen.getByPlaceholderText(/댓글을 입력하세요/i)
    const submitButton = screen.getByRole('button', { name: /댓글 작성/i })

    await user.type(commentInput, '새 댓글')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateComment).toHaveBeenCalledWith({
        threadId: 'test-thread-id',
        content: '새 댓글',
      })
    })
  })
})

