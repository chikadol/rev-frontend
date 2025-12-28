import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardPage from './pages/BoardPage';
import CreateBoardPage from './pages/CreateBoardPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import MePage from './pages/MePage';
import NotificationsPage from './pages/NotificationsPage';
import PerformancesPage from './pages/PerformancesPage';
import PerformanceDetailPage from './pages/PerformanceDetailPage';
import MyTicketsPage from './pages/MyTicketsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<PerformancesPage />} />
                    <Route path="/boards" element={<Home />} />
                    <Route path="/boards/new" element={
                        <PrivateRoute>
                            <CreateBoardPage />
                        </PrivateRoute>
                    } />
                    <Route path="/boards/:boardId" element={<BoardPage />} />
                    <Route path="/boards/:boardId/threads/new" element={
                        <PrivateRoute>
                            <CreateThreadPage />
                        </PrivateRoute>
                    } />
                    <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
                    <Route path="/me" element={
                        <PrivateRoute>
                            <MePage />
                        </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                        <PrivateRoute>
                            <NotificationsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/performances" element={<PerformancesPage />} />
                    <Route path="/performances/:id" element={<PerformanceDetailPage />} />
                    <Route path="/my-tickets" element={
                        <PrivateRoute>
                            <MyTicketsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/tickets/:ticketId/payment" element={
                        <PrivateRoute>
                            <PaymentPage />
                        </PrivateRoute>
                    } />
                    <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
