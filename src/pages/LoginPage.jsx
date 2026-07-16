import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.get(
        `/users?email=${email}`
      );
      console.log('Login API Response:', res.data);

      if (res.data.length === 0 || String(res.data[0].password) !== String(password)) {
        setMsgError('Email hoặc mật khẩu không đúng!');
        return;
      }
      const u = res.data[0];
      login({ uId: u.id, role: u.role, name: u.fullname });
      navigate(u.role === 'librarian' ? '/librarian/dashboard' : '/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setMsgError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h3 className="text-primary mb-3">Đăng nhập</h3>
            {msgError && <div className="alert alert-danger">{msgError}</div>}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Đăng nhập</button>
            <div className="text-center">
              <span>Chưa có tài khoản? </span>
              <Link to="/register" className="text-primary text-decoration-none fw-semibold">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
