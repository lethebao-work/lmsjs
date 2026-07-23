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
      const res = await api.get(`/users?email=${email}`);

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
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-2"
                style={{ width: '56px', height: '56px', backgroundColor: '#8B4000' }}
              >
                <i className="bi bi-book-half fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-dark mb-1">Đăng nhập</h3>
              <p className="text-muted small mb-0">
                Tài khoản do thư viện trường cấp cho SV & GV.
              </p>
            </div>

            {msgError && <div className="alert alert-danger small">{msgError}</div>}
            
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Email tài khoản</label>
              <input
                type="email"
                className="form-control"
                placeholder="VD: quyet.vu@student.lmsjs.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-primary w-100 py-2.5 mb-3 fw-bold shadow-sm" 
              onClick={handleLogin}
              style={{ backgroundColor: '#8B4000', borderColor: '#8B4000' }}
            >
              Đăng nhập
            </button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-decoration-none fw-semibold small" style={{ color: '#8B4000' }}>
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
