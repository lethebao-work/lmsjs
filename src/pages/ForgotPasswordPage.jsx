import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.get(`/users?email=${email}`);
      if (res.data.length === 0) {
        toast.error('Email không tồn tại trong hệ thống!');
        return;
      }

      const user = res.data[0];
      const newPassword = generatePassword();

      await api.patch(`/users/${user.id}`, { password: newPassword });

      toast.success(
        `Mật khẩu mới đã được tạo!\nMật khẩu mới: ${newPassword}`,
        { autoClose: 10000 }
      );
      setSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
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
                <i className="bi bi-key-fill fs-3"></i>
              </div>
              <h3 className="fw-extrabold text-dark mb-1">Quên mật khẩu</h3>
              <p className="text-muted small mb-0">
                Nhập email để hệ thống cấp lại mật khẩu mới.
              </p>
            </div>

            {sent ? (
              <div>
                <div className="alert alert-success small">
                  <strong>Thành công!</strong> Mật khẩu mới đã được tạo. Vui lòng kiểm tra thông báo để lấy mật khẩu mới.
                </div>
                <Link to="/login" className="btn btn-primary w-100 py-2.5 font-bold" style={{ backgroundColor: '#8B4000', borderColor: '#8B4000' }}>
                  Quay lại đăng nhập
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Email tài khoản</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email đã đăng ký"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 mb-3 fw-bold shadow-sm"
                  disabled={isLoading}
                  style={{ backgroundColor: '#8B4000', borderColor: '#8B4000' }}
                >
                  {isLoading ? 'Đang xử lý...' : 'Lấy lại mật khẩu'}
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none fw-semibold small" style={{ color: '#8B4000' }}>
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
