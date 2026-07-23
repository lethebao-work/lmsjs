export default function MemberList({ members = [], onEdit, onDelete }) {
  const getMemberTypeLabel = (type) => {
    if (type === 'teacher') return <span className="badge bg-info text-dark">Giảng viên</span>;
    return <span className="badge bg-primary">Sinh viên</span>;
  };

  const getMemberDetail = (member) => {
    if (member.memberType === 'teacher') {
      return member.department || '—';
    }
    return member.studentId || '—';
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th className="border-0 px-3 py-3">Họ tên</th>
            <th className="border-0 px-3 py-3">Email</th>
            <th className="border-0 px-3 py-3">Loại</th>
            <th className="border-0 px-3 py-3">MSSV / Khoa</th>
            <th className="border-0 px-3 py-3">Trạng thái mượn</th>
            <th className="border-0 px-3 py-3">SĐT</th>
            <th className="border-0 px-3 py-3 text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">
                Chưa có thành viên nào trong hệ thống.
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id}>
                <td className="px-3 py-3 fw-semibold">{m.name}</td>
                <td className="px-3 py-3 text-muted">{m.email}</td>
                <td className="px-3 py-3">{getMemberTypeLabel(m.memberType)}</td>
                <td className="px-3 py-3">{getMemberDetail(m)}</td>
                <td className="px-3 py-3">
                  {m.borrowingStatus === 'blocked' ? (
                    <div>
                      <span className="badge bg-danger">Tạm khóa mượn</span>
                      <div className="small text-danger mt-1">{Number(m.unpaidFineAmount || 0).toLocaleString('vi-VN')}đ chưa nộp</div>
                    </div>
                  ) : (
                    <span className="badge bg-success">Hoạt động</span>
                  )}
                </td>
                <td className="px-3 py-3">{m.phone}</td>
                <td className="px-3 py-3 text-end">
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => onEdit(m)}>
                    Sửa
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(m.id, m.userId)}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
