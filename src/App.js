import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container-fluid px-0">
          <div className="container mt-4 pb-5">
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Member protected */}
              <Route path="/books" element={
                <ProtectedRoute>
                  <div className="card shadow-sm p-4 mt-5">
                    <h2 className="text-success">Trang Sách (Độc giả)</h2>
                    <p>Chào mừng độc giả! Bạn đã đăng nhập và truy cập thành công.</p>
                    <button className="btn btn-danger w-25 mt-3" onClick={() => {
                      localStorage.removeItem('account');
                      window.location.href = '/login';
                    }}>Đăng xuất</button>
                  </div>
                </ProtectedRoute>
              } />

              {/* Librarian protected */}
              <Route path="/librarian/books" element={
                <ProtectedRoute requireLibrarian>
                  <div className="card shadow-sm p-4 mt-5">
                    <h2 className="text-primary">Trang Quản lý Sách (Thủ thư)</h2>
                    <p>Chào mừng Thủ thư! Bạn có toàn quyền quản trị hệ thống.</p>
                    <button className="btn btn-danger w-25 mt-3" onClick={() => {
                      localStorage.removeItem('account');
                      window.location.href = '/login';
                    }}>Đăng xuất</button>
                  </div>
                </ProtectedRoute>
              } />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<div className="alert alert-warning mt-5">404 — Trang không tồn tại</div>} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
