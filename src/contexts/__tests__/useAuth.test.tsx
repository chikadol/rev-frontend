import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { apiClient } from '../../lib/api'

// API 클라이언트 모킹
vi.mock('../../lib/api', () => ({
  apiClient: {
    login: vi.fn(),
    getMe: vi.fn(),
  },
}))

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('AuthProvider 없이 사용 시 에러 발생', () => {
    // 에러를 잡기 위해 콘솔 에러를 무시
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleError.mockRestore()
  })

  it('초기 상태 - 토큰 없음', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('초기 상태 - 토큰 있음 (사용자 정보 로드 성공)', async () => {
    localStorage.setItem('accessToken', 'test-access-token')

    const mockUserData = {
      userId: 'user-123',
      username: 'testuser',
      roles: ['USER'],
    }

    vi.mocked(apiClient.getMe).mockResolvedValue({
      data: mockUserData,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      userId: 'user-123',
      username: 'testuser',
      roles: ['USER'],
    })
  })

  it('초기 상태 - 토큰 있음 (사용자 정보 로드 실패)', async () => {
    localStorage.setItem('accessToken', 'invalid-token')

    vi.mocked(apiClient.getMe).mockRejectedValue(new Error('인증 실패'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(localStorage.getItem('accessToken')).toBe(null)
  })

  it('login - 성공', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    const mockTokenResponse = {
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
    }

    const mockUserData = {
      userId: 'user-123',
      username: 'testuser',
      roles: ['USER'],
    }

    vi.mocked(apiClient.login).mockResolvedValue(mockTokenResponse)
    vi.mocked(apiClient.getMe).mockResolvedValue({
      data: mockUserData,
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(localStorage.getItem('accessToken')).toBe('new-access-token')
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token')
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      userId: 'user-123',
      username: 'testuser',
      roles: ['USER'],
    })
  })

  it('login - 실패', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    vi.mocked(apiClient.login).mockRejectedValue(new Error('로그인 실패'))

    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrongpassword')
      })
    ).rejects.toThrow('로그인 실패')

    expect(localStorage.getItem('accessToken')).toBe(null)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('logout', async () => {
    localStorage.setItem('accessToken', 'test-token')
    localStorage.setItem('refreshToken', 'test-refresh-token')

    // 먼저 로그인 상태로 만들기
    const mockUserData = {
      userId: 'user-123',
      username: 'testuser',
      roles: ['USER'],
    }

    vi.mocked(apiClient.getMe).mockResolvedValue({
      data: mockUserData,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    // 초기 로드 대기
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('accessToken')).toBe(null)
    expect(localStorage.getItem('refreshToken')).toBe(null)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('refreshUser - 성공', async () => {
    localStorage.setItem('accessToken', 'test-token')

    const mockUserData = {
      userId: 'user-456',
      username: 'updateduser',
      roles: ['USER', 'ADMIN'],
    }

    vi.mocked(apiClient.getMe).mockResolvedValue({
      data: mockUserData,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      userId: 'user-456',
      username: 'updateduser',
      roles: ['USER', 'ADMIN'],
    })
  })

  it('refreshUser - 토큰 없음', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('refreshUser - API 실패', async () => {
    localStorage.setItem('accessToken', 'test-token')

    vi.mocked(apiClient.getMe).mockRejectedValue(new Error('인증 실패'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(localStorage.getItem('accessToken')).toBe(null)
  })
})

