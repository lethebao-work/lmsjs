import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import memberService from '../services/memberService';
import categoryService from '../services/categoryService';
import Sidebar from '../components/common/Sidebar';
import { toast } from 'react-toastify';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

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

      // 2. Nếu là độc giả, cập nhật thông tin trong bảng members tương ứng
      if (user.role === 'member') {
        const member = await memberService.getMemberByUserId(user.uId);
        if (member) {
          await api.patch(`/members/${member.id}`, {
            phone,
            gender,
            dob,
            city,
            address,
            favorites
          });
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

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="justify-content-center mt-4">
          <Col md={user.role === 'member' ? 8 : 6}>
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
              <Card.Body>
                <h3 className="mb-4 text-primary fw-bold">Hồ sơ cá nhân</h3>
                <Form onSubmit={handleSave}>
                  <Row>
                    {/* Cột 1: Thông tin tài khoản chính */}
                    <Col md={user.role === 'member' ? 6 : 12}>
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

                    {/* Cột 2: Thông tin mở rộng của Độc giả (Chỉ hiển thị cho member) */}
                    {user.role === 'member' && (
                      <Col md={6} className="border-start ps-4">
                        <h5 className="fw-bold text-secondary mb-3">Thông tin độc giả</h5>
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
                            <Form.Check
                              inline
                              type="radio"
                              label="Nam"
                              name="gender"
                              value="Nam"
                              checked={gender === 'Nam'}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Nữ"
                              name="gender"
                              value="Nữ"
                              checked={gender === 'Nữ'}
                              onChange={(e) => setGender(e.target.value)}
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Ngày sinh (DoB)</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Thành phố (City)</Form.Label>
                          <Form.Select 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)}
                          >
                            <option value="">-- Chọn thành phố --</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Địa chỉ (Address)</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Thể loại yêu thích (Favorites)</Form.Label>
                          <div>
                            {availableCategories.map((cat) => (
                              <Form.Check
                                inline
                                key={cat.id}
                                type="checkbox"
                                label={cat.name}
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
