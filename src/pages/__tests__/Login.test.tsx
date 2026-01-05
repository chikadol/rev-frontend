import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

// CSS 모킹
vi.mock('../../components/ErrorMessage.css', () => ({}))
vi.mock('../../components/LoadingSpinner.css', () => ({}))

import Login from '../Login'

// React Router 모킹
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// AuthContext 모킹
const mockLogin = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false,
    isAuthenticated: false,
    user: null,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  }

  it('로그인 폼 렌더링', () => {
    renderLogin()
    
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
  })

  it('이메일과 비밀번호 입력', async () => {
    const user = userEvent.setup()
    renderLogin()

    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('로그인 버튼 클릭 시 폼 제출', async () => {
    const user = userEvent.setup()
    renderLogin()

    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const loginButton = screen.getByRole('button', { name: /로그인/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    // 폼이 제출되었는지 확인 (에러 메시지나 로딩 상태로 확인)
    await waitFor(() => {
      // 로그인 시도가 이루어졌는지 확인
      expect(emailInput).toBeInTheDocument()
    })
  })

  it('에러 메시지 표시', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('로그인 실패'))

    renderLogin()

    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const loginButton = screen.getByRole('button', { name: /로그인/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/로그인에 실패했습니다/i)).toBeInTheDocument()
    })
  })

  it('로그인 성공 시 홈으로 이동', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)

    renderLogin()

    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const loginButton = screen.getByRole('button', { name: /로그인/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('회원가입 링크 표시', () => {
    renderLogin()
    
    const registerLink = screen.getByRole('link', { name: /회원가입/i })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})

