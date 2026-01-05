import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  debounce,
  throttle,
  createImageObserver,
  calculateVisibleRange,
  SimpleCache,
} from '../performance'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('연속 호출 시 마지막 호출만 실행', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn(1)
    debouncedFn(2)
    debouncedFn(3)

    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(3)
  })

  it('대기 시간 내 재호출 시 타이머 리셋', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn(1)
    vi.advanceTimersByTime(50)
    debouncedFn(2)
    vi.advanceTimersByTime(50)
    debouncedFn(3)
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(3)
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('일정 시간 간격으로만 실행', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn(1)
    throttledFn(2)
    throttledFn(3)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(1)

    vi.advanceTimersByTime(100)

    throttledFn(4)
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenCalledWith(4)
  })

  it('제한 시간 내 호출은 무시', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn(1)
    vi.advanceTimersByTime(50)
    throttledFn(2)
    vi.advanceTimersByTime(50)
    throttledFn(3)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(1)
  })
})

describe('createImageObserver', () => {
  it('IntersectionObserver 생성', () => {
    const callback = vi.fn()
    const observer = createImageObserver(callback)

    expect(observer).toBeInstanceOf(IntersectionObserver)
  })

  it('커스텀 옵션 적용', () => {
    const callback = vi.fn()
    const options = {
      rootMargin: '100px',
      threshold: 0.5,
    }
    const observer = createImageObserver(callback, options)

    expect(observer).toBeInstanceOf(IntersectionObserver)
  })
})

describe('calculateVisibleRange', () => {
  it('기본 계산', () => {
    const result = calculateVisibleRange(1000, 100, 0, 50)
    expect(result.start).toBe(0)
    expect(result.end).toBe(11) // 1000 / 100 + 1 = 11
  })

  it('스크롤 위치 고려', () => {
    const result = calculateVisibleRange(1000, 100, 500, 50)
    expect(result.start).toBe(5) // 500 / 100 = 5
    expect(result.end).toBe(16) // 5 + 11 = 16
  })

  it('전체 아이템 수 초과 방지', () => {
    const result = calculateVisibleRange(1000, 100, 0, 5)
    expect(result.start).toBe(0)
    expect(result.end).toBe(5) // 전체 아이템 수보다 작아야 함
  })
})

describe('SimpleCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('값 저장 및 조회', () => {
    const cache = new SimpleCache<string, number>(1000)

    cache.set('key1', 100)
    expect(cache.get('key1')).toBe(100)
  })

  it('TTL 만료 후 조회 시 undefined 반환', () => {
    const cache = new SimpleCache<string, number>(1000)

    cache.set('key1', 100)
    vi.advanceTimersByTime(1001)

    expect(cache.get('key1')).toBeUndefined()
  })

  it('TTL 만료 전 조회 시 값 반환', () => {
    const cache = new SimpleCache<string, number>(1000)

    cache.set('key1', 100)
    vi.advanceTimersByTime(500)

    expect(cache.get('key1')).toBe(100)
  })

  it('캐시 삭제', () => {
    const cache = new SimpleCache<string, number>(1000)

    cache.set('key1', 100)
    cache.delete('key1')

    expect(cache.get('key1')).toBeUndefined()
  })

  it('캐시 전체 삭제', () => {
    const cache = new SimpleCache<string, number>(1000)

    cache.set('key1', 100)
    cache.set('key2', 200)
    cache.clear()

    expect(cache.get('key1')).toBeUndefined()
    expect(cache.get('key2')).toBeUndefined()
  })
})

