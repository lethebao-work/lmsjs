import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { isLibrarian, isMember } = useAuth();

  const sections = [];

  if (isLibrarian()) {
    sections.push(
      {
        title: 'LƯU THÔNG TẠI QUẦY',
        items: [
          { to: '/librarian/dashboard', label: 'Bảng điều khiển', icon: 'bi-grid-fill' },
          { to: '/librarian/borrow-records', label: 'Mượn / Trả sách', icon: 'bi-arrow-left-right' },
          { to: '/librarian/fines', label: 'Khoản phạt', icon: 'bi-cash-coin' }
        ]
      },
      {
        title: 'QUẢN LÝ SÁCH',
        items: [
          { to: '/librarian/books', label: 'Đầu sách', icon: 'bi-book' },
          { to: '/librarian/categories', label: 'Thể loại', icon: 'bi-tags' },
          { to: '/librarian/book-suggestions', label: 'Đề xuất sách', icon: 'bi-inbox' },
          { to: '/librarian/members', label: 'Quản lý thành viên', icon: 'bi-people' }
        ]
      },
      {
        title: 'TÀI KHOẢN',
        items: [
          { to: '/profile', label: 'Hồ sơ của tôi', icon: 'bi-person-gear' }
        ]
      }
    );
  } else if (isMember()) {
    sections.push(
      {
        title: 'CỔNG TÀI LIỆU',
        items: [
          { to: '/dashboard', label: 'Bảng điều khiển', icon: 'bi-grid-fill' },
          { to: '/books', label: 'Tra cứu sách', icon: 'bi-book' },
          { to: '/my-borrow-records', label: 'Lịch sử mượn', icon: 'bi-journal-bookmark' },
          { to: '/my-fines', label: 'Khoản phạt của tôi', icon: 'bi-cash-coin' },
          { to: '/book-suggestions', label: 'Đề xuất thêm sách', icon: 'bi-chat-left-quote' }
        ]
      },
      {
        title: 'TÀI KHOẢN',
        items: [
          { to: '/profile', label: 'Hồ sơ của tôi', icon: 'bi-person-gear' }
        ]
      }
    );
  }

  if (sections.length === 0) return null;

  return (
    <div className="lms-sidebar d-flex flex-column justify-content-between">
      <div>
        {/* Navigation Section Grouping matching screenshot 4 */}
        {sections.map((sec, idx) => (
          <div key={idx} className="lms-sidebar-section">
            <h6 
              className="lms-sidebar-title"
            >
              {sec.title}
            </h6>
            <ul className="nav nav-pills flex-column gap-1">
              {sec.items.map((link) => (
                <li key={link.to} className="nav-item">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-link py-2 px-3 d-flex align-items-center gap-2.5 rounded-3 fw-semibold ${
                        isActive ? 'shadow-sm' : ''
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? '#FDF2E9' : 'transparent',
                      color: isActive ? '#8B4000' : '#4B5563',
                      borderLeft: isActive ? '4px solid #8B4000' : '4px solid transparent',
                      fontSize: '0.9rem'
                    })}
                  >
                    <i className={`bi ${link.icon} fs-5`} style={{ color: '#8B4000' }}></i>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom System Status Box matching screenshot 4 */}
      <div className="lms-sidebar-status">
        <h6 className="fw-bold mb-1 d-flex align-items-center gap-1.5" style={{ color: '#8B4000', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          <i className="bi bi-sliders"></i> TRẠNG THÁI HỆ THỐNG
        </h6>
        <div className="d-flex align-items-center gap-2 small text-secondary" style={{ fontSize: '0.8rem' }}>
          <span className="bg-success rounded-circle d-inline-block" style={{ width: '8px', height: '8px' }}></span>
          <span>Hệ thống hoạt động bình thường</span>
        </div>
      </div>
    </div>
  );
}
