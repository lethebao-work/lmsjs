import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isLibrarian, isMember, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom py-2 shadow-sm sticky-top">
      <div className="container-fluid px-4">
        {/* Brand Logo matching exact screenshot */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div 
            className="d-flex align-items-center justify-content-center text-white rounded-2 px-2 py-1.5"
            style={{ backgroundColor: '#8B4000' }}
          >
            <i className="bi bi-book-half" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <div className="d-flex flex-column leading-tight">
            <span className="fw-bold text-dark" style={{ fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Hệ thống Quản lý Thư viện Đại học
            </span>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#8B4000', letterSpacing: '0.08em' }}>
              UNILIB LMS
            </span>
          </div>
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
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-1 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/') ? 'fw-bold text-dark' : 'text-secondary'}`} to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/books') ? 'fw-bold text-dark' : 'text-secondary'}`} to="/books">
                Danh mục sách
              </Link>
            </li>
            {isLibrarian() && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/librarian/dashboard') ? 'fw-bold text-dark' : 'text-secondary'}`} to="/librarian/dashboard">
                  Bảng điều khiển
                </Link>
              </li>
            )}
            {isMember() && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/dashboard') ? 'fw-bold text-dark' : 'text-secondary'}`} to="/dashboard">
                  Bảng điều khiển
                </Link>
              </li>
            )}
          </ul>
          
          {/* Right Section matching exact screenshot */}
          <div className="d-flex align-items-center gap-4">
            {/* Live Library Working Hours Indicator */}
            <div className="d-none d-xl-flex align-items-center gap-2 small text-muted">
              <span className="bg-success rounded-circle" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
              <span>Giờ làm việc hôm nay:</span>
              <strong className="text-dark">08:00 AM – 08:00 PM</strong>
            </div>

            {isAuthenticated() ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 bg-light px-3 py-1.5 rounded-pill border">
                  <i className="bi bi-person-circle fs-5" style={{ color: '#8B4000' }}></i>
                  <div className="d-flex flex-column leading-tight">
                    <span className="text-dark fw-bold small mb-0">{user?.name}</span>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {isLibrarian() ? 'Thủ thư' : 'Thành viên'}
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-outline-dark btn-sm px-3" 
                  onClick={handleLogout}
                  style={{ borderRadius: '8px' }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link 
                className="btn btn-brown px-4 py-2 text-white font-bold text-decoration-none shadow-sm" 
                to="/login"
                style={{ backgroundColor: '#8B4000', borderRadius: '8px' }}
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
