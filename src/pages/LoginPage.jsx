import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
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
        `/users?email=${email}&password=${password}`
      );
      if (res.data.length === 0) {
        setMsgError('Email hoặc mật khẩu không đúng!');
        return;
      }
      const u = res.data[0];
      login({ uId: u.id, role: u.role, name: u.fullname });
      navigate(u.role === 'librarian' ? '/librarian/books' : '/books');
    } catch {
      setMsgError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="col-md-4 offset-md-4 mt-5">
      <div className="card shadow-sm p-4">
        <h3 className="text-primary mb-3">Đăng nhập</h3>
        {msgError && <div className="alert alert-danger">{msgError}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>Đăng nhập</button>
      </div>
    </div>
  );
}
