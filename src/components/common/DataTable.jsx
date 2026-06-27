import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DataTable({ data = [], columns = [], onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirm = () => {
    onDelete(deleteId);
    setShowModal(false);
  };

  return (
    <>
      <div className="table-responsive shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ backgroundColor: '#f4f3f2' }}>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="py-3 px-4 text-secondary fw-semibold"
                  style={{ borderBottomWidth: '1px', borderColor: '#e5e5e5' }}
                >
                  {col.label}
                </th>
              ))}
              <th 
                className="py-3 px-4 text-secondary fw-semibold text-end"
                style={{ borderBottomWidth: '1px', borderColor: '#e5e5e5' }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-5 text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-dark">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-end">
                    <button 
                      className="btn btn-warning btn-sm me-2 fw-semibold px-3" 
                      onClick={() => onEdit(item)}
                      style={{ borderRadius: '8px', color: '#262626' }}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm fw-semibold px-3" 
                      onClick={() => handleDeleteClick(item.id)}
                      style={{ borderRadius: '8px' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        show={showModal}
        message="Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác."
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
