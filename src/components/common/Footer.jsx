import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-top">
      {/* Top Portion matching screenshot 3 */}
      <div className="container-fluid px-4 py-5" style={{ maxWidth: '1400px' }}>
        <div className="row g-4">
          {/* Col 1: Brand & Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white rounded-2 px-2 py-1.5"
                style={{ backgroundColor: '#8B4000' }}
              >
                <i className="bi bi-book-half fs-5"></i>
              </div>
              <div className="d-flex flex-column leading-tight">
                <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                  Hệ thống quản lý thư viện Đại học
                </span>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#8B4000', letterSpacing: '0.08em' }}>
                  UNILIB LMS
                </span>
              </div>
            </div>

            <p className="small text-muted mb-3" style={{ lineHeight: '1.7', maxWidth: '340px' }}>
              Cung cấp quyền truy cập thông tin đẳng cấp thế giới cho cộng đồng học thuật. Cổng kết nối tri thức của bạn từ năm 1954.
            </p>

            <div className="d-flex flex-wrap gap-3 small text-muted">
              <a href="#privacy" className="text-muted text-decoration-none small">Chính sách bảo mật</a>
              <span>·</span>
              <a href="#terms" className="text-muted text-decoration-none small">Điều khoản sử dụng</a>
              <span>·</span>
              <a href="#faq" className="text-muted text-decoration-none small">Câu hỏi thường gặp</a>
            </div>
          </div>

          {/* Col 2: Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.95rem' }}>
              Liên hệ với chúng tôi
            </h6>

            <ul className="list-unstyled small text-muted mb-0 d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt mt-0.5" style={{ color: '#8B4000' }}></i>
                <span>123 Academic Row, Knowledge City, EDU 4567</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone" style={{ color: '#8B4000' }}></i>
                <span>+84 (0) 123 456 789</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope" style={{ color: '#8B4000' }}></i>
                <span>library@unilib.edu.vn</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-clock" style={{ color: '#8B4000' }}></i>
                <span>Thứ Hai – Thứ Bảy: 08:00 AM – 08:00 PM</span>
              </li>
              <li className="mt-1">
                <Link to="/login" className="fw-bold text-decoration-none small" style={{ color: '#8B4000' }}>
                  🎴 Đăng nhập Nhân viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Social */}
          <div className="col-lg-4 col-md-12">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.95rem' }}>
              Kết nối
            </h6>

            {/* Social Icons */}
            <div className="d-flex gap-2 mb-4">
              {['facebook', 'youtube', 'envelope-paper', 'globe'].map((icon, idx) => (
                <div 
                  key={idx}
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light border"
                  style={{ width: '36px', height: '36px', cursor: 'pointer', color: '#8B4000' }}
                >
                  <i className={`bi bi-${icon}`}></i>
                </div>
              ))}
            </div>

            <h6 className="fw-bold text-dark mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#8B4000' }}>
              LIÊN KẾT NHANH
            </h6>
            <div className="row g-2 small text-muted">
              <div className="col-6">
                <Link to="/" className="text-muted text-decoration-none d-block py-1">
                  › Trang chủ
                </Link>
                <Link to="/books" className="text-muted text-decoration-none d-block py-1">
                  › Tra cứu mục lục
                </Link>
                <Link to="/books" className="text-muted text-decoration-none d-block py-1">
                  › Dịch vụ
                </Link>
              </div>
              <div className="col-6">
                <Link to="/" className="text-muted text-decoration-none d-block py-1">
                  › Chính sách
                </Link>
                <Link to="/" className="text-muted text-decoration-none d-block py-1">
                  › Tin tức & Sự kiện
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solid Warm Wood Brown Bottom Banner matching screenshot 3 */}
      <div className="py-3 text-white small" style={{ backgroundColor: '#8B4000' }}>
        <div className="container-fluid px-4 d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ maxWidth: '1400px' }}>
          <span>© 2026 Hệ thống Quản lý Thư viện Đại học. Bảo lưu mọi quyền.</span>
          <span>♥ Xây dựng vì sự xuất sắc trong học thuật</span>
        </div>
      </div>
    </footer>
  );
}
