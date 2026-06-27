import React from 'react';

export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      <div 
        className="modal show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(38, 38, 38, 0.5)', zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Xác nhận thao tác</h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body py-3">
              <p className="mb-0 text-secondary">{message}</p>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button 
                type="button" 
                className="btn btn-light" 
                onClick={onCancel}
                style={{ borderRadius: '8px' }}
              >
                Hủy bỏ
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={onConfirm}
                style={{ borderRadius: '8px' }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
    </>
  );
}
