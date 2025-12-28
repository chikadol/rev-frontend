import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import BoardPage from './pages/BoardPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import MePage from './pages/MePage';
import NotificationsPage from './pages/NotificationsPage';
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
                    <Route path="/" element={<Home />} />
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
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
