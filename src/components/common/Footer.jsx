export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Cột 1: Thông tin bản quyền */}
          <div className="col-md-6">
            <h5 className="fw-bold text-warning mb-3">UNILIB LMS</h5>
            <p className="small text-white-50 mb-0">
              © 2026 LMSJS - Hệ thống quản lý thư viện trường học thông minh.
            </p>
            <p className="small text-white-50 mb-0">
              Bản quyền thuộc về nhóm 5 - lớp SE2014JS.
            </p>
          </div>

          {/* Cột : Liên hệ */}
          <div className="col-md-6">
            <h6 className="fw-bold text-white mb-3">Thông tin liên hệ</h6>
            <ul className="list-unstyled mb-0 small text-white-50">
              <li className="mb-2">SDT: +0123456789 </li>
              <li>Email: support@lms.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
