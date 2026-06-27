import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isLibrarian, isMember, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ backgroundColor: '#262626' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ color: '#d97706', fontSize: '1.25rem' }}>
          <span className="me-2" style={{ fontSize: '1.5rem' }}>📚</span> LMSJS
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent" 
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
            <li className="nav-item">
              <Link className="nav-link px-3 text-white-50" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-white-50" to="/books">Danh mục sách</Link>
            </li>
            {isMember() && (
              <li className="nav-item">
                <Link className="nav-link px-3 text-white-50" to="/my-borrow-records">Lịch sử mượn</Link>
              </li>
            )}
            {isLibrarian() && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle px-3 text-white-50" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Quản lý thư viện
                </a>
                <ul className="dropdown-menu border-0 shadow mt-2" aria-labelledby="navbarDropdown" style={{ borderRadius: '8px' }}>
                  <li><Link className="dropdown-item py-2 px-3" to="/librarian/books">📚 Quản lý sách</Link></li>
                  <li><Link className="dropdown-item py-2 px-3" to="/librarian/categories">🏷️ Quản lý thể loại</Link></li>
                  <li><Link className="dropdown-item py-2 px-3" to="/librarian/members">👤 Quản lý độc giả</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item py-2 px-3" to="/librarian/borrow-records">📋 Mượn / Trả sách</Link></li>
                </ul>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated() ? (
              <>
                <span className="text-white-50 small">
                  Xin chào, <strong className="text-white">{user?.name}</strong> ({isLibrarian() ? 'Thủ thư' : 'Độc giả'})
                </span>
                <button 
                  className="btn btn-outline-light btn-sm px-3" 
                  onClick={handleLogout}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link 
                className="btn btn-primary btn-sm px-4 py-2" 
                to="/login"
                style={{ backgroundColor: '#d97706', borderColor: '#d97706', borderRadius: '8px', fontWeight: '600' }}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
