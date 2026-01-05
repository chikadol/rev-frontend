import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  it('기본 inline 렌더링', () => {
    render(<ErrorMessage error="오류가 발생했습니다" />)
    expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument()
  })

  it('full variant 렌더링', () => {
    render(<ErrorMessage error="심각한 오류" variant="full" />)
    expect(screen.getByText('심각한 오류')).toBeInTheDocument()
    expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument()
  })

  it('재시도 버튼 클릭', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorMessage error="오류" onRetry={onRetry} />)
    
    const retryButton = screen.getByText('재시도')
    await user.click(retryButton)
    
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('닫기 버튼 클릭', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<ErrorMessage error="오류" onDismiss={onDismiss} />)
    
    const dismissButton = screen.getByLabelText('닫기')
    await user.click(dismissButton)
    
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('full variant에서 재시도 버튼 클릭', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorMessage error="오류" variant="full" onRetry={onRetry} />)
    
    const retryButton = screen.getByText('다시 시도')
    await user.click(retryButton)
    
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('재시도 버튼이 없을 때 렌더링', () => {
    render(<ErrorMessage error="오류" />)
    expect(screen.queryByText('재시도')).not.toBeInTheDocument()
    expect(screen.queryByText('다시 시도')).not.toBeInTheDocument()
  })
})

