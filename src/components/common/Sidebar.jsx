import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { to: '/librarian/books', label: '📚 Quản lý sách' },
    { to: '/librarian/categories', label: '🏷️ Quản lý thể loại' },
    { to: '/librarian/members', label: '👤 Quản lý độc giả' },
    { to: '/librarian/borrow-records', label: '📋 Mượn / Trả sách' },
  ];

  return (
    <div 
      className="d-flex flex-column p-4 bg-light border-end" 
      style={{ minHeight: 'calc(100vh - 72px)', width: '260px' }}
    >
      <h6 className="text-secondary text-uppercase fw-bold mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
        Phân hệ quản trị
      </h6>
      <ul className="nav nav-pills flex-column gap-2">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <NavLink
              className={({ isActive }) => 
                `nav-link py-3 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${
                  isActive 
                    ? 'active text-white' 
                    : 'text-dark hover-bg-light'
                }`
              }
              to={link.to}
              style={({ isActive }) => 
                isActive 
                  ? { backgroundColor: '#d97706', borderRadius: '8px' } 
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
