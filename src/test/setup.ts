import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup()
})

// 전역 matcher 추가
expect.extend({
  // 커스텀 matcher를 여기에 추가할 수 있습니다
})
