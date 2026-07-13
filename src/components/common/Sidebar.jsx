import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { isLibrarian, isMember } = useAuth();

  const links = [];
  let title = '';

  if (isLibrarian()) {
    title = 'Phân hệ thủ thư';
    links.push(
      { to: '/librarian/dashboard', label: 'Bảng điều khiển' },
      { to: '/librarian/books', label: 'Quản lý sách' },
      { to: '/librarian/categories', label: 'Quản lý thể loại' },
      { to: '/librarian/members', label: 'Quản lý độc giả' },
      { to: '/librarian/borrow-records', label: 'Mượn / Trả sách' },
      { to: '/profile', label: 'Hồ sơ cá nhân' }
    );
  } else if (isMember()) {
    title = 'Phân hệ độc giả';
    links.push(
      { to: '/dashboard', label: 'Bảng điều khiển' },
      { to: '/books', label: 'Danh mục sách' },
      { to: '/my-borrow-records', label: 'Lịch sử mượn' },
      { to: '/profile', label: 'Hồ sơ cá nhân' }
    );
  }

  if (links.length === 0) return null;

  return (
    <div
      className="d-flex flex-column p-4"
      style={{
        minHeight: 'calc(100vh - 72px)',
        width: '260px',
        flexShrink: 0,
        backgroundColor: '#e2f0d9', // Light green background like the image
        borderRight: '1px solid #d0e1cc'
      }}
    >
      <h6 className="text-success text-uppercase fw-bold mb-4" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
        {title}
      </h6>
      <ul className="nav nav-pills flex-column gap-2">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link py-3 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${isActive
                  ? 'text-dark'
                  : 'text-dark hover-bg-light'
                }`
              }
              to={link.to}
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: '#a9d08e', borderRadius: '8px' } // Soft dark green for active tab like in the image
                  : { borderRadius: '8px' }
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
