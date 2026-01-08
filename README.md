# RE-V Frontend

React + TypeScript + Vite 기반 프론트엔드 프로젝트

## 📋 목차

- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [성능 최적화](#성능-최적화)
- [테스트](#테스트)
- [백엔드 연동](#백엔드-연동)

---

## 기술 스택

- **언어**: TypeScript
- **프레임워크**: React 18
- **라우팅**: React Router
- **빌드 도구**: Vite
- **스타일링**: CSS Variables (커스텀 디자인 시스템)
- **테스트**: Vitest, Testing Library
- **E2E 테스트**: Playwright

---

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# .env 파일 생성
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8080
EOF
```

또는 직접 `.env` 파일을 편집:
```
VITE_API_BASE_URL=http://localhost:8080
```

**참고**: 백엔드 서버 주소가 다르면 `VITE_API_BASE_URL`을 변경하세요.

### 3. 개발 서버 실행
```bash
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 프로젝트 구조

```
src/
  ├── assets/                # 정적 자원
  ├── components/            # 재사용 가능한 컴포넌트
  │   ├── CommentList.tsx
  │   ├── ErrorMessage.tsx
  │   ├── ErrorBoundary.tsx
  │   ├── LoadingSpinner.tsx
  │   ├── Layout.tsx
  │   └── OptimizedImage.tsx # 이미지 최적화 컴포넌트
  ├── contexts/              # React Context
  │   └── AuthContext.tsx    # 인증 상태 관리
  ├── lib/                   # 유틸리티 및 API
  │   └── api.ts            # API 클라이언트
  ├── pages/                 # 페이지 컴포넌트
  │   ├── Login.tsx
  │   ├── Home.tsx
  │   ├── BoardPage.tsx
  │   ├── ThreadDetailPage.tsx
  │   └── ...
  ├── utils/                 # 유틸리티 함수
  │   ├── auth.ts           # 인증 관련 유틸
  │   └── performance.ts    # 성능 최적화 유틸
  ├── types/                 # TypeScript 타입 정의
  ├── App.tsx                # 메인 앱 컴포넌트
  └── main.tsx              # 진입점
```

---

## 성능 최적화

### React.memo 활용
불필요한 리렌더링을 방지하기 위해 다음 컴포넌트에 `React.memo`를 적용했습니다:
- `CommentList`: 댓글 목록 컴포넌트
- `ErrorMessage`: 에러 메시지 컴포넌트
- `LoadingSpinner`: 로딩 스피너 컴포넌트
- `Layout`: 레이아웃 컴포넌트
- `BoardPage`: 게시판 페이지

### 코드 스플리팅
`React.lazy`와 `Suspense`를 사용하여 페이지별 동적 로딩을 구현했습니다:
- 초기 번들 크기 감소
- 필요한 페이지만 로드하여 초기 로딩 속도 향상

```typescript
const BoardPage = lazy(() => import('./pages/BoardPage'));
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'));
```

### 이미지 최적화
`OptimizedImage` 컴포넌트를 통해 이미지 lazy loading을 구현했습니다:
- Intersection Observer를 사용한 뷰포트 기반 로딩
- 에러 처리 및 placeholder 지원
- `decoding="async"` 속성으로 메인 스레드 블로킹 방지

### useCallback 활용
함수 참조를 안정화하여 불필요한 리렌더링을 방지했습니다.

---

## 테스트

### 단위 테스트 (Vitest)
```bash
npm run test
```

주요 테스트:
- `Login.test.tsx`: 로그인 페이지 테스트
- `BoardPage.test.tsx`: 게시판 페이지 테스트
- `ThreadDetailPage.test.tsx`: 게시글 상세 페이지 테스트
- `useAuth.test.tsx`: 인증 훅 테스트

### E2E 테스트 (Playwright)
```bash
npm run test:e2e
```

테스트 시나리오:
- 홈 페이지 렌더링
- 로그인 플로우
- 게시판 탐색

## 백엔드 연동

백엔드 서버가 `http://localhost:8080`에서 실행되어야 합니다.

### API 응답 형식
모든 API는 통일된 응답 형식을 사용합니다:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

### 주요 API 엔드포인트
- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입
- `POST /auth/refresh` - 토큰 갱신
- `GET /api/me` - 내 정보 조회
- `GET /api/boards` - 게시판 목록
- `GET /api/threads/{boardId}/threads` - 게시글 목록
- `GET /api/threads/detail/{threadId}` - 게시글 상세

### 인증 처리
- JWT 토큰은 `localStorage`에 저장
- Access Token 만료 시 자동으로 Refresh Token으로 갱신
- 인증 실패 시 자동으로 로그인 페이지로 리다이렉트

---

## 빌드

### 개발 빌드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프로덕션 미리보기
```bash
npm run preview
```

---

## 최근 개선 사항 (2025-01-04)

### 성능 최적화
- ✅ React.memo 적용 (CommentList, ErrorMessage, LoadingSpinner 등)
- ✅ 코드 스플리팅 (React.lazy, Suspense)
- ✅ 이미지 최적화 (OptimizedImage 컴포넌트, lazy loading)
- ✅ useCallback으로 함수 참조 안정화

### 테스트
- ✅ Vitest 단위 테스트 추가
- ✅ Playwright E2E 테스트 추가

### 코드 품질
- ✅ TypeScript 타입 안정성 향상
- ✅ 컴포넌트 구조화 및 재사용성 개선

---

마지막 업데이트: 2025-01-04  
버전: 1.1.0
