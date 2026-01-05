import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('기본 렌더링', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
  })

  it('small 크기 렌더링', () => {
    render(<LoadingSpinner size="small" />)
    const spinner = document.querySelector('.spinner-small')
    expect(spinner).toBeInTheDocument()
  })

  it('medium 크기 렌더링', () => {
    render(<LoadingSpinner size="medium" />)
    const spinner = document.querySelector('.spinner-medium')
    expect(spinner).toBeInTheDocument()
  })

  it('large 크기 렌더링', () => {
    render(<LoadingSpinner size="large" />)
    const spinner = document.querySelector('.spinner-large')
    expect(spinner).toBeInTheDocument()
  })

  it('fullScreen 모드 렌더링', () => {
    render(<LoadingSpinner fullScreen />)
    const overlay = document.querySelector('.loading-overlay')
    expect(overlay).toBeInTheDocument()
  })

  it('메시지 표시', () => {
    const message = '로딩 중...'
    render(<LoadingSpinner message={message} />)
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('fullScreen 모드에서 메시지 표시', () => {
    const message = '데이터를 불러오는 중...'
    render(<LoadingSpinner fullScreen message={message} />)
    expect(screen.getByText(message)).toBeInTheDocument()
  })
})

