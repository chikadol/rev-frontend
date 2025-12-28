# RE-V Frontend

React + TypeScript + Vite 기반 프론트엔드 프로젝트

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. 개발 서버 실행
```bash
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 프로젝트 구조

```
src/
  ├── assets/
  │   └── pages/
  │       └── Login.tsx      # 로그인 페이지
  ├── lib/
  │   └── api.ts             # API 클라이언트
  ├── App.tsx                # 메인 앱 컴포넌트
  └── main.tsx              # 진입점
```

## 백엔드 연동

백엔드 서버가 `http://localhost:8080`에서 실행되어야 합니다.

### API 엔드포인트
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.
