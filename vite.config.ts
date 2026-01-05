import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 인증 엔드포인트만 프록시하고, /auth/callback은 프론트 라우터가 처리하도록 제외
      '/auth/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth/refresh': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 코드 스플리팅 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 라이브러리 분리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 페이지별 청크 (필요시 추가)
        },
      },
    },
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
    // 소스맵 생성 (프로덕션에서는 false 권장)
    sourcemap: false,
  },
  // 성능 최적화
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
