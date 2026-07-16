import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validations
    if (!fullname || !email || !password || !confirmPassword || !phone || !dob || !address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp!');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Số điện thoại phải chứa đúng 10 chữ số!');
      return;
    }

    try {
      setIsLoading(true);

      // Check if email already exists
      const checkEmailRes = await api.get(`/users?email=${email}`);
      if (checkEmailRes.data.length > 0) {
        toast.error('Email này đã được sử dụng. Vui lòng chọn email khác!');
        setIsLoading(false);
        return;
      }

      // Step 1: Create user in users table
      const newUser = {
        fullname,
        email,
        password,
        role: 'member'
      };

      const userRes = await api.post('/users', newUser);
      const createdUser = userRes.data;

      // Step 2: Create member details in members table
      const newMember = {
        userId: createdUser.id,
        phone,
        gender,
        dob,
        city,
        address,
        favorites: []
      };

      await api.post('/members', newMember);

      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Đăng ký thất bại. Đã xảy ra lỗi hệ thống!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 border-0">
            <h3 className="text-primary text-center mb-4">Đăng ký Độc giả</h3>
            <form onSubmit={handleRegister}>
              <h5 className="text-secondary border-bottom pb-2 mb-3">Thông tin tài khoản</h5>
              
              <div className="mb-3">
                <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập họ và tên"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h5 className="text-secondary border-bottom pb-2 mb-3 mt-4">Thông tin cá nhân</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Ví dụ: 0356965077"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ngày sinh <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tỉnh / Thành phố</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Địa chỉ cụ thể <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập địa chỉ nhà, tên đường..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </button>

              <div className="text-center">
                <span>Đã có tài khoản? </span>
                <Link to="/login" className="text-primary text-decoration-none fw-semibold">Đăng nhập</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
