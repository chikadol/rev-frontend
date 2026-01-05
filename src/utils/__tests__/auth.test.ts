import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getUserRole, isAdmin } from '../auth'

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

describe('getUserRole', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('토큰이 없으면 null 반환', () => {
    expect(getUserRole()).toBeNull()
  })

  it('유효한 JWT 토큰에서 역할 추출 (배열)', () => {
    // JWT payload: {"roles":["USER"]}
    const payload = btoa(JSON.stringify({ roles: ['USER'] }))
    const token = `header.${payload}.signature`
    localStorage.setItem('accessToken', token)

    const role = getUserRole()
    expect(role).toBe('USER')
  })

  it('유효한 JWT 토큰에서 역할 추출 (문자열)', () => {
    // JWT payload: {"roles":"ADMIN"}
    const payload = btoa(JSON.stringify({ roles: 'ADMIN' }))
    const token = `header.${payload}.signature`
    localStorage.setItem('accessToken', token)

    const role = getUserRole()
    expect(role).toBe('ADMIN')
  })

  it('역할이 없으면 null 반환', () => {
    const payload = btoa(JSON.stringify({}))
    const token = `header.${payload}.signature`
    localStorage.setItem('accessToken', token)

    const role = getUserRole()
    expect(role).toBeNull()
  })

  it('잘못된 토큰 형식이면 null 반환', () => {
    localStorage.setItem('accessToken', 'invalid-token')

    const role = getUserRole()
    expect(role).toBeNull()
  })
})

describe('isAdmin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('토큰이 없으면 false 반환', () => {
    expect(isAdmin()).toBe(false)
  })

  it('ADMIN 역할이 있으면 true 반환', () => {
    const payload = btoa(JSON.stringify({ roles: ['ADMIN'] }))
    const token = `header.${payload}.signature`
    localStorage.setItem('accessToken', token)

    expect(isAdmin()).toBe(true)
  })

  it('USER 역할만 있으면 false 반환', () => {
    const payload = btoa(JSON.stringify({ roles: ['USER'] }))
    const token = `header.${payload}.signature`
    localStorage.setItem('accessToken', token)

    expect(isAdmin()).toBe(false)
  })

  it('토큰이 없으면 false 반환', () => {
    expect(isAdmin()).toBe(false)
  })
})

