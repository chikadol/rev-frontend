import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// CSS 모킹
vi.mock('../../components/ErrorMessage.css', () => ({}))

import BoardPage from '../BoardPage'

// API 클라이언트 모킹
const mockGetBoard = vi.fn()
const mockGetThreads = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    getBoard: (...args: any[]) => mockGetBoard(...args),
    getThreads: (...args: any[]) => mockGetThreads(...args),
  },
}))

// useParams 모킹
const mockParams = { boardId: 'test-board-id' }
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockParams,
  }
})

describe('BoardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderBoardPage = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/boards/:boardId" element={<BoardPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  it('로딩 상태 표시', () => {
    mockGetBoard.mockImplementation(() => new Promise(() => {})) // 무한 대기
    mockGetThreads.mockImplementation(() => new Promise(() => {}))

    renderBoardPage()
    expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
  })

  it('게시판 정보와 게시글 목록 표시', async () => {
    const mockBoard = {
      id: 'test-board-id',
      name: '테스트 게시판',
      description: '테스트 설명',
      slug: 'test-board',
    }

    const mockThreads = {
      content: [
        {
          id: 'thread-1',
          title: '첫 번째 게시글',
          content: '내용',
          authorId: 'user-1',
          createdAt: '2024-01-01T00:00:00Z',
          tags: ['태그1'],
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 20,
      first: true,
      last: true,
    }

    mockGetBoard.mockResolvedValue(mockBoard)
    mockGetThreads.mockResolvedValue(mockThreads)

    renderBoardPage()

    await waitFor(() => {
      expect(screen.getByText('테스트 게시판')).toBeInTheDocument()
      expect(screen.getByText('테스트 설명')).toBeInTheDocument()
      expect(screen.getByText('첫 번째 게시글')).toBeInTheDocument()
    })
  })

  it('게시판을 찾을 수 없을 때 메시지 표시', async () => {
    mockGetBoard.mockRejectedValue(new Error('게시판을 찾을 수 없습니다'))
    mockGetThreads.mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
      first: true,
      last: true,
    })

    renderBoardPage()

    await waitFor(() => {
      expect(screen.getByText(/게시판을 찾을 수 없습니다/i)).toBeInTheDocument()
    })
  })

  it('게시글이 없을 때 빈 상태 메시지 표시', async () => {
    const mockBoard = {
      id: 'test-board-id',
      name: '테스트 게시판',
      description: '테스트 설명',
      slug: 'test-board',
    }

    const mockThreads = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
      first: true,
      last: true,
    }

    mockGetBoard.mockResolvedValue(mockBoard)
    mockGetThreads.mockResolvedValue(mockThreads)

    renderBoardPage()

    await waitFor(() => {
      expect(screen.getByText(/게시글이 없습니다/i)).toBeInTheDocument()
    })
  })

  it('검색 기능', async () => {
    const user = userEvent.setup()
    const mockBoard = {
      id: 'test-board-id',
      name: '테스트 게시판',
      slug: 'test-board',
    }

    const mockThreads = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 20,
      first: true,
      last: true,
    }

    mockGetBoard.mockResolvedValue(mockBoard)
    mockGetThreads.mockResolvedValue(mockThreads)

    renderBoardPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/제목, 내용, 댓글에서 검색/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/제목, 내용, 댓글에서 검색/i)
    const searchButton = screen.getByRole('button', { name: /검색/i })

    await user.type(searchInput, '검색어')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockGetThreads).toHaveBeenCalledWith(
        'test-board-id',
        0,
        20,
        undefined,
        '검색어'
      )
    })
  })
})

