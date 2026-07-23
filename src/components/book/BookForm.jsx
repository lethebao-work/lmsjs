import { useState, useEffect } from 'react';

export default function BookForm({ book, categories = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    bookCode: '', title: '', author: '', categoryId: '', totalCopies: 1, availableCopies: 1, coverImage: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) setForm(book);
    else setForm({ bookCode: '', title: '', author: '', categoryId: '', totalCopies: 1, availableCopies: 1, coverImage: '' });
  }, [book]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const totalCopies = Number(form.totalCopies);
    const availableCopies = Number(form.availableCopies);

    if (!form.title.trim() || !form.author.trim() || !form.categoryId) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      setError('Tổng số sách phải là số nguyên và lớn hơn hoặc bằng 1!');
      return;
    }
    if (!Number.isInteger(availableCopies) || availableCopies < 0) {
      setError('Số sách còn lại phải là số nguyên và không được âm!');
      return;
    }
    if (availableCopies > totalCopies) {
      setError('Số sách còn lại không được vượt quá tổng số!');
      return;
    }
    setError('');

    // Xử lý tự động tách đường dẫn ảnh bìa khi người dùng dán đường dẫn tuyệt đối
    let processedCoverImage = form.coverImage.trim();

    // Loại bỏ dấu ngoặc kép ở đầu và cuối (ví dụ khi Copy as path từ Windows)
    if (processedCoverImage.startsWith('"') && processedCoverImage.endsWith('"')) {
      processedCoverImage = processedCoverImage.slice(1, -1);
    }
    if (processedCoverImage.startsWith("'") && processedCoverImage.endsWith("'")) {
      processedCoverImage = processedCoverImage.slice(1, -1);
    }

    // Chuyển đổi dấu gạch chéo ngược thành xuôi
    processedCoverImage = processedCoverImage.replace(/\\/g, '/');

    // Tìm kiếm cụm từ /public/ hoặc public/ để lấy phần tương đối sau nó
    const publicIndex = processedCoverImage.indexOf('/public/');
    if (publicIndex !== -1) {
      processedCoverImage = processedCoverImage.substring(publicIndex + 8);
    } else {
      const altIndex = processedCoverImage.indexOf('public/');
      if (altIndex !== -1) {
        processedCoverImage = processedCoverImage.substring(altIndex + 7);
      }
    }

    onSave({
      ...form,
      bookCode: form.bookCode.trim(),
      coverImage: processedCoverImage,
      categoryId: form.categoryId,
      totalCopies,
      availableCopies,
    });
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Mã sách</label>
        <input name="bookCode" className="form-control" value={form.bookCode || ''} onChange={handleChange} placeholder="Tự tạo nếu bỏ trống" />
      </div>
      <div className="mb-2">
        <label className="form-label">Tên sách *</label>
        <input name="title" className="form-control" value={form.title} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label className="form-label">Tác giả *</label>
        <input name="author" className="form-control" value={form.author} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label className="form-label">Thể loại *</label>
        <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
          <option value="">-- Chọn thể loại --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Tổng số</label>
          <input name="totalCopies" type="number" min="1" step="1" className="form-control" value={form.totalCopies} onChange={handleChange} />
        </div>
        <div className="col">
          <label className="form-label">Còn lại</label>
          <input name="availableCopies" type="number" min="0" step="1" className="form-control" value={form.availableCopies} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Đường dẫn / URL ảnh bìa</label>
        <input 
          name="coverImage" 
          className="form-control" 
          value={form.coverImage} 
          onChange={handleChange} 
          placeholder="Ví dụ: D:\...\public\images\harrypotter.jpg hoặc images/harrypotter.jpg"
        />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {book ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {book && <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>}
      </div>
    </div>
  );
}
