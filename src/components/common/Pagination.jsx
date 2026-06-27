import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            style={{ color: currentPage === 1 ? '#737373' : '#d97706', border: '1px solid #e5e5e5' }}
          >
            Trước
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(p)}
              style={
                p === currentPage
                  ? { backgroundColor: '#d97706', borderColor: '#d97706', color: '#fff' }
                  : { color: '#262626', border: '1px solid #e5e5e5' }
              }
            >
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            style={{ color: currentPage === totalPages ? '#737373' : '#d97706', border: '1px solid #e5e5e5' }}
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  );
}
