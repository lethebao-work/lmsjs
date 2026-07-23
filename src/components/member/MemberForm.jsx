import { useState, useEffect } from 'react';

const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Phú Thọ', 'Huế', 'Nha Trang'];

export default function MemberForm({ member, onSave, onCancel }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [address, setAddress] = useState('');
  const [memberType, setMemberType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [className, setClassName] = useState('');
  const [major, setMajor] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('Giảng viên');

  useEffect(() => {
    if (member) {
      setFullname(member.name || '');
      setEmail(member.email || '');
      setPassword('');
      setPhone(member.phone || '');
      setGender(member.gender || 'Nam');
      setDob(member.dob || '');
      setCity(member.city || 'Hà Nội');
      setAddress(member.address || '');
      setMemberType(member.memberType || 'student');
      setStudentId(member.studentId || '');
      setClassName(member.className || '');
      setMajor(member.major || '');
      setEnrollmentYear(member.enrollmentYear || '');
      setDepartment(member.department || '');
      setPosition(member.position || 'Giảng viên');
    } else {
      resetForm();
    }
  }, [member]);

  const resetForm = () => {
    setFullname(''); setEmail(''); setPassword(''); setPhone('');
    setGender('Nam'); setDob(''); setCity('Hà Nội'); setAddress('');
    setMemberType('student'); setStudentId(''); setClassName('');
    setMajor(''); setEnrollmentYear(''); setDepartment('');
    setPosition('Giảng viên');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fullname, email, phone, gender, dob, city, address, memberType, major,
      ...(password ? { password } : {}),
      ...(memberType === 'student' ? { studentId, className, enrollmentYear: Number(enrollmentYear) } : {}),
      ...(memberType === 'teacher' ? { department, position } : {})
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Loại thành viên */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Loại thành viên <span className="text-danger">*</span></label>
        <div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="memberType" id="type-student"
              value="student" checked={memberType === 'student'}
              onChange={(e) => setMemberType(e.target.value)} />
            <label className="form-check-label" htmlFor="type-student">Sinh viên</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="memberType" id="type-teacher"
              value="teacher" checked={memberType === 'teacher'}
              onChange={(e) => setMemberType(e.target.value)} />
            <label className="form-check-label" htmlFor="type-teacher">Giảng viên</label>
          </div>
        </div>
      </div>

      <hr className="my-3" />

      {/* Thông tin tài khoản */}
      <h6 className="text-secondary mb-2">Thông tin tài khoản</h6>
      <div className="mb-2">
        <label className="form-label">Họ tên <span className="text-danger">*</span></label>
        <input className="form-control form-control-sm" value={fullname} onChange={e => setFullname(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Email <span className="text-danger">*</span></label>
        <input className="form-control form-control-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Mật khẩu {!member && <span className="text-danger">*</span>}</label>
        <input className="form-control form-control-sm" type="password" value={password}
          onChange={e => setPassword(e.target.value)} required={!member}
          placeholder={member ? 'Để trống nếu không đổi' : 'Tối thiểu 6 ký tự'} />
      </div>

      <hr className="my-3" />

      {/* Thông tin học vụ */}
      <h6 className="text-secondary mb-2">
        {memberType === 'student' ? 'Thông tin sinh viên' : 'Thông tin giảng viên'}
      </h6>

      {memberType === 'student' ? (
        <>
          <div className="row">
            <div className="col-6 mb-2">
              <label className="form-label">MSSV <span className="text-danger">*</span></label>
              <input className="form-control form-control-sm" value={studentId}
                onChange={e => setStudentId(e.target.value)} placeholder="VD: SE1701" required />
            </div>
            <div className="col-6 mb-2">
              <label className="form-label">Lớp</label>
              <input className="form-control form-control-sm" value={className}
                onChange={e => setClassName(e.target.value)} placeholder="VD: SE1809" />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-2">
              <label className="form-label">Ngành</label>
              <input className="form-control form-control-sm" value={major}
                onChange={e => setMajor(e.target.value)} placeholder="VD: Kỹ thuật PM" />
            </div>
            <div className="col-6 mb-2">
              <label className="form-label">Khoá (năm nhập học)</label>
              <input className="form-control form-control-sm" type="number" value={enrollmentYear}
                onChange={e => setEnrollmentYear(e.target.value)} placeholder="VD: 2023" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-2">
            <label className="form-label">Khoa <span className="text-danger">*</span></label>
            <input className="form-control form-control-sm" value={department}
              onChange={e => setDepartment(e.target.value)} placeholder="VD: Khoa CNTT" required />
          </div>
          <div className="row">
            <div className="col-6 mb-2">
              <label className="form-label">Chuyên ngành</label>
              <input className="form-control form-control-sm" value={major}
                onChange={e => setMajor(e.target.value)} placeholder="VD: Trí tuệ nhân tạo" />
            </div>
            <div className="col-6 mb-2">
              <label className="form-label">Chức danh</label>
              <select className="form-select form-select-sm" value={position} onChange={e => setPosition(e.target.value)}>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
                <option value="Phó Giáo sư">Phó Giáo sư</option>
                <option value="Giáo sư">Giáo sư</option>
              </select>
            </div>
          </div>
        </>
      )}

      <hr className="my-3" />

      {/* Thông tin cá nhân */}
      <h6 className="text-secondary mb-2">Thông tin cá nhân</h6>
      <div className="row">
        <div className="col-6 mb-2">
          <label className="form-label">SĐT <span className="text-danger">*</span></label>
          <input className="form-control form-control-sm" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div className="col-6 mb-2">
          <label className="form-label">Giới tính</label>
          <select className="form-select form-select-sm" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-6 mb-2">
          <label className="form-label">Ngày sinh</label>
          <input className="form-control form-control-sm" type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <div className="col-6 mb-2">
          <label className="form-label">Thành phố</label>
          <select className="form-select form-select-sm" value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Địa chỉ</label>
        <input className="form-control form-control-sm" value={address} onChange={e => setAddress(e.target.value)} />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm flex-grow-1">
          {member ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {member && (
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { onCancel(); resetForm(); }}>
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}
