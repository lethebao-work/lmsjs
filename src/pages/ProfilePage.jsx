import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import memberService from '../services/memberService';
import categoryService from '../services/categoryService';
import Sidebar from '../components/common/Sidebar';
import { toast } from 'react-toastify';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Phú Thọ', 'Huế', 'Nha Trang'];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Thông tin học vụ
  const [memberType, setMemberType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [className, setClassName] = useState('');
  const [major, setMajor] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/users/${user.uId}`);
        const u = res.data;
        setFullname(u.fullname || '');
        setEmail(u.email || '');
        setPassword(u.password || '');
        
        // Tải danh mục thể loại động từ CSDL
        const cats = await categoryService.getAllCategories();
        setAvailableCategories(cats);
        
        // Nếu là độc giả thì tải thêm các thông tin mở rộng của member
        if (u.role === 'member') {
          const member = await memberService.getMemberByUserId(u.id);
          if (member) {
            setPhone(member.phone || '');
            setGender(member.gender || 'Nam');
            setDob(member.dob || '');
            setCity(member.city || '');
            setAddress(member.address || '');
            setFavorites(member.favorites || []);
            setMemberType(member.memberType || 'student');
            setStudentId(member.studentId || '');
            setClassName(member.className || '');
            setMajor(member.major || '');
            setEnrollmentYear(member.enrollmentYear || '');
            setDepartment(member.department || '');
            setPosition(member.position || '');
          }
        }
      } catch {
        toast.error('Không thể tải thông tin cá nhân!');
      } finally {
        setLoading(false);
      }
    };
    if (user?.uId) loadProfile();
  }, [user?.uId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      toast.warning('Vui lòng nhập đầy đủ thông tin tài khoản!');
      return;
    }
    if (user.role === 'member' && !phone.trim()) {
      toast.warning('Vui lòng nhập số điện thoại!');
      return;
    }

    setSaving(true);
    try {
      // 1. Cập nhật bảng users
      await api.patch(`/users/${user.uId}`, {
        fullname,
        email,
        password
      });

      // 2. Nếu là member, cập nhật thông tin trong bảng members tương ứng
      if (user.role === 'member') {
        const member = await memberService.getMemberByUserId(user.uId);
        if (member) {
          const memberData = {
            phone, gender, dob, city, address, favorites, major
          };

          // Không cho member tự đổi memberType, studentId — chỉ cập nhật các field khác
          await api.patch(`/members/${member.id}`, memberData);
        }
      }

      // Cập nhật lại context state
      login({ ...user, name: fullname });
      toast.success('Cập nhật hồ sơ cá nhân thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thông tin!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải thông tin...</div>;

  const memberTypeLabel = memberType === 'teacher' ? 'Giảng viên' : 'Sinh viên';

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="justify-content-center mt-4">
          <Col md={user.role === 'member' ? 10 : 6}>
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
              <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <h3 className="mb-0 text-primary fw-bold">Hồ sơ cá nhân</h3>
                  {user.role === 'member' && (
                    <span className={`badge ${memberType === 'teacher' ? 'bg-info text-dark' : 'bg-primary'}`}>
                      {memberTypeLabel}
                    </span>
                  )}
                </div>
                <Form onSubmit={handleSave}>
                  <Row>
                    {/* Cột 1: Thông tin tài khoản */}
                    <Col md={user.role === 'member' ? 4 : 12}>
                      <h5 className="fw-bold text-secondary mb-3">Thông tin tài khoản</h5>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Họ và tên</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={fullname} 
                          onChange={(e) => setFullname(e.target.value)} 
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                        <Form.Control 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                        />
                      </Form.Group>
                    </Col>

                    {/* Cột 2: Thông tin học vụ + cá nhân */}
                    {user.role === 'member' && (
                      <Col md={4} className="border-start ps-4">
                        <h5 className="fw-bold text-secondary mb-3">
                          {memberType === 'student' ? 'Thông tin sinh viên' : 'Thông tin giảng viên'}
                        </h5>

                        {memberType === 'student' ? (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">MSSV</Form.Label>
                              <Form.Control type="text" value={studentId} disabled
                                className="bg-light" />
                              <Form.Text className="text-muted">Liên hệ thủ thư để thay đổi</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Lớp</Form.Label>
                              <Form.Control type="text" value={className} disabled
                                className="bg-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Ngành</Form.Label>
                              <Form.Control type="text" value={major}
                                onChange={(e) => setMajor(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Khoá</Form.Label>
                              <Form.Control type="text" value={enrollmentYear} disabled
                                className="bg-light" />
                            </Form.Group>
                          </>
                        ) : (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Khoa</Form.Label>
                              <Form.Control type="text" value={department} disabled
                                className="bg-light" />
                              <Form.Text className="text-muted">Liên hệ thủ thư để thay đổi</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Chuyên ngành</Form.Label>
                              <Form.Control type="text" value={major}
                                onChange={(e) => setMajor(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Chức danh</Form.Label>
                              <Form.Control type="text" value={position} disabled
                                className="bg-light" />
                            </Form.Group>
                          </>
                        )}
                      </Col>
                    )}

                    {/* Cột 3: Thông tin cá nhân */}
                    {user.role === 'member' && (
                      <Col md={4} className="border-start ps-4">
                        <h5 className="fw-bold text-secondary mb-3">Thông tin cá nhân</h5>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Giới tính</Form.Label>
                          <div className="py-1">
                            <Form.Check inline type="radio" label="Nam" name="gender" value="Nam"
                              checked={gender === 'Nam'} onChange={(e) => setGender(e.target.value)} />
                            <Form.Check inline type="radio" label="Nữ" name="gender" value="Nữ"
                              checked={gender === 'Nữ'} onChange={(e) => setGender(e.target.value)} />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
                          <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Thành phố</Form.Label>
                          <Form.Select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">-- Chọn --</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Địa chỉ</Form.Label>
                          <Form.Control as="textarea" rows={2} value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Thể loại yêu thích</Form.Label>
                          <div>
                            {availableCategories.map((cat) => (
                              <Form.Check
                                inline key={cat.id} type="checkbox" label={cat.name}
                                checked={favorites.includes(cat.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFavorites([...favorites, cat.name]);
                                  } else {
                                    setFavorites(favorites.filter((f) => f !== cat.name));
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 fw-semibold py-2 mt-3" 
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
