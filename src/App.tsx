import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// 코드 스플리팅: 페이지 컴포넌트들을 동적으로 로드
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const CreateBoardPage = lazy(() => import('./pages/CreateBoardPage'));
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'));
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'));
const MePage = lazy(() => import('./pages/MePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const PerformancesPage = lazy(() => import('./pages/PerformancesPage'));
const PerformanceDetailPage = lazy(() => import('./pages/PerformanceDetailPage'));
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PaymentCallbackPage = lazy(() => import('./pages/PaymentCallbackPage'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const IdolList = lazy(() => import('./pages/IdolList'));
const IdolDetail = lazy(() => import('./pages/IdolDetail'));
const CreatePerformancePage = lazy(() => import('./pages/CreatePerformancePage'));
const RequestBoardPage = lazy(() => import('./pages/RequestBoardPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));

// Suspense 래퍼 컴포넌트
const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen message="페이지를 불러오는 중..." />}>
    {children}
  </Suspense>
);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen message="로딩 중..." />;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen message="로딩 중..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const isAdmin = user?.roles?.some((role: string) => 
    role === 'ADMIN' || role === 'ROLE_ADMIN' || role.includes('ADMIN')
  ) || false;
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/login" element={
                        <PageLoader>
                            <Login />
                        </PageLoader>
                    } />
                    <Route path="/register" element={
                        <PageLoader>
                            <Register />
                        </PageLoader>
                    } />
                    <Route path="/" element={
                        <PageLoader>
                            <Landing />
                        </PageLoader>
                    } />
                    <Route path="/boards" element={
                        <PageLoader>
                            <Home />
                        </PageLoader>
                    } />
                    <Route path="/boards/new" element={
                        <PrivateRoute>
                            <PageLoader>
                                <CreateBoardPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/boards/request" element={
                        <PrivateRoute>
                            <PageLoader>
                                <RequestBoardPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/boards/:boardId" element={
                        <PageLoader>
                            <BoardPage />
                        </PageLoader>
                    } />
                    <Route path="/boards/:boardId/threads/new" element={
                        <PrivateRoute>
                            <PageLoader>
                                <CreateThreadPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/threads/:threadId" element={
                        <PageLoader>
                            <ThreadDetailPage />
                        </PageLoader>
                    } />
                    <Route path="/me" element={
                        <PrivateRoute>
                            <PageLoader>
                                <MePage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                        <PrivateRoute>
                            <PageLoader>
                                <NotificationsPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/performances" element={
                        <PageLoader>
                            <PerformancesPage />
                        </PageLoader>
                    } />
                    <Route path="/performances/new" element={
                        <PrivateRoute>
                            <PageLoader>
                                <CreatePerformancePage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/performances/:id" element={
                        <PageLoader>
                            <PerformanceDetailPage />
                        </PageLoader>
                    } />
                    <Route path="/my-tickets" element={
                        <PrivateRoute>
                            <PageLoader>
                                <MyTicketsPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/tickets/:ticketId/payment" element={
                        <PrivateRoute>
                            <PageLoader>
                                <PaymentPage />
                            </PageLoader>
                        </PrivateRoute>
                    } />
                    <Route path="/payment/callback" element={
                        <PageLoader>
                            <PaymentCallbackPage />
                        </PageLoader>
                    } />
                    <Route path="/idols" element={
                        <PageLoader>
                            <IdolList />
                        </PageLoader>
                    } />
                    <Route path="/idols/:idolId" element={
                        <PageLoader>
                            <IdolDetail />
                        </PageLoader>
                    } />
                    <Route path="/admin/users" element={
                        <AdminRoute>
                            <PageLoader>
                                <AdminUsersPage />
                            </PageLoader>
                        </AdminRoute>
                    } />
                    <Route path="/auth/callback" element={
                        <PageLoader>
                            <OAuthCallback />
                        </PageLoader>
                    } />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
