import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './assets/pages/Login';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <div style={{ padding: 40 }}>
                        <h1>RE-V Frontend</h1>
                        <p>환영합니다!</p>
                        <a href="/login">로그인</a>
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
