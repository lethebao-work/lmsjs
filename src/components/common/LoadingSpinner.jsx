import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="text-center my-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" role="status" style={{ color: '#d97706', width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Đang tải...</span>
      </div>
      <div className="mt-3 text-muted fw-semibold">Đang tải dữ liệu, vui lòng đợi...</div>
    </div>
  );
}
