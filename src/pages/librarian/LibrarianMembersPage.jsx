import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import memberService from '../../services/memberService';
import MemberList from '../../components/member/MemberList';
import Sidebar from '../../components/common/Sidebar';
import MemberForm from '../../components/member/MemberForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function LibrarianMembersPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('all');

  const fetchMembers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch {
      toast.error('Không thể tải danh sách thành viên!');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(true);
  }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        // Cập nhật User
        await api.patch(`/users/${selected.userId}`, {
          fullname: data.fullname,
          email: data.email,
          ...(data.password ? { password: data.password } : {})
        });
        // Cập nhật Member
        const memberData = {
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          city: data.city,
          address: data.address,
          favorites: data.favorites || selected.favorites || [],
          memberType: data.memberType,
          major: data.major || ''
        };

        if (data.memberType === 'student') {
          memberData.studentId = data.studentId || '';
          memberData.className = data.className || '';
          memberData.enrollmentYear = data.enrollmentYear || '';
          // Xoá fields giảng viên nếu đổi từ GV sang SV
          memberData.department = '';
          memberData.position = '';
        } else {
          memberData.department = data.department || '';
          memberData.position = data.position || '';
          // Xoá fields sinh viên nếu đổi từ SV sang GV
          memberData.studentId = '';
          memberData.className = '';
          memberData.enrollmentYear = '';
        }

        await memberService.updateMember(selected.id, memberData);
        toast.success('Cập nhật thành viên thành công!');
      } else {
        // Kiểm tra email
        const exist = await api.get(`/users?email=${data.email}`);
        if (exist.data.length > 0) {
          toast.error('Email này đã được sử dụng!');
          return;
        }
        // Tạo User mới
        const newUserRes = await api.post('/users', {
          fullname: data.fullname,
          email: data.email,
          password: data.password,
          role: 'member'
        });
        // Tạo Member
        const memberData = {
          userId: newUserRes.data.id,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          city: data.city,
          address: data.address,
          favorites: [],
          memberType: data.memberType,
          major: data.major || ''
        };

        if (data.memberType === 'student') {
          memberData.studentId = data.studentId || '';
          memberData.className = data.className || '';
          memberData.enrollmentYear = data.enrollmentYear || '';
        } else {
          memberData.department = data.department || '';
          memberData.position = data.position || '';
        }

        await memberService.createMember(memberData);
        toast.success('Thêm thành viên mới thành công!');
      }
      setSelected(null);
      fetchMembers(false);
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thành viên!');
    }
  };

  const handleDelete = async (id, userId) => {
    try {
      await memberService.deleteMember(id);
      if (userId) {
        await api.delete(`/users/${userId}`);
      }
      toast.success('Xóa thành viên thành công!');
      if (selected && selected.id === id) setSelected(null);
      fetchMembers(false);
    } catch {
      toast.error('Không thể xóa thành viên!');
    }
  };

  const filteredMembers = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return members.filter((member) => {
      const haystack = normalizeText([
        member.id,
        member.userId,
        member.name,
        member.email,
        member.phone,
        member.memberType,
        member.studentId,
        member.className,
        member.department,
        member.position,
        member.major,
        member.city
      ].join(' '));

      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesType = memberTypeFilter === 'all' || member.memberType === memberTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [members, searchTerm, memberTypeFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="lms-page-header">
              <div>
                <h2 className="lms-page-title">Quản lý thành viên</h2>
                <p className="lms-page-subtitle">Tìm kiếm tài khoản, lọc sinh viên/giảng viên và cập nhật hồ sơ.</p>
              </div>
            </div>

            <div className="lms-toolbar">
              <div className="row g-3 align-items-end">
                <div className="col-md-7">
                  <label className="form-label small fw-semibold text-secondary">Tìm kiếm</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                    <input
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tên, email, MSSV, khoa, SĐT..."
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Loại thành viên</label>
                  <select className="form-select" value={memberTypeFilter} onChange={(e) => setMemberTypeFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="student">Sinh viên</option>
                    <option value="teacher">Giảng viên</option>
                  </select>
                </div>
                <div className="col-md-1 d-grid">
                  <button
                    className="btn btn-light border"
                    title="Xóa bộ lọc"
                    onClick={() => {
                      setSearchTerm('');
                      setMemberTypeFilter('all');
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="lms-result-count mt-3">
                Hiển thị {filteredMembers.length} / {members.length} thành viên
              </div>
            </div>

            <MemberList
              members={filteredMembers}
              onEdit={setSelected}
              onDelete={handleDelete}
            />
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
              <h5>{selected ? 'Sửa thành viên' : 'Thêm thành viên'}</h5>
              <MemberForm
                member={selected}
                onSave={handleSave}
                onCancel={() => setSelected(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
