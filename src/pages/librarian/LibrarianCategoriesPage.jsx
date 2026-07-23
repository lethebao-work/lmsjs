import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import categoryService from '../../services/categoryService';
import bookService from '../../services/bookService';
import DataTable from '../../components/common/DataTable';
import Sidebar from '../../components/common/Sidebar';
import CategoryForm from '../../components/category/CategoryForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function LibrarianCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usageFilter, setUsageFilter] = useState('all');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [categoryData, bookData] = await Promise.all([
        categoryService.getAllCategories(),
        bookService.getAllBooks()
      ]);
      setCategories(categoryData);
      setBooks(bookData);
    } catch {
      toast.error('Không thể tải danh sách thể loại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        await categoryService.updateCategory(selected.id, data);
      } else {
        await categoryService.createCategory(data);
      }
      toast.success(selected ? 'Cập nhật thể loại thành công!' : 'Thêm thể loại mới thành công!');
      setSelected(null);
      fetchCategories();
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thể loại!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Xóa thể loại thành công!');
      fetchCategories();
    } catch {
      toast.error('Không thể xóa thể loại!');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên thể loại' },
    {
      key: 'bookCount',
      label: 'Số đầu sách',
      render: (category) => books.filter(book => String(book.categoryId) === String(category.id)).length
    }
  ];

  const filteredCategories = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return categories.filter((category) => {
      const bookCount = books.filter(book => String(book.categoryId) === String(category.id)).length;
      const haystack = normalizeText([category.id, category.name].join(' '));
      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesUsage =
        usageFilter === 'all' ||
        (usageFilter === 'used' && bookCount > 0) ||
        (usageFilter === 'unused' && bookCount === 0);

      return matchesSearch && matchesUsage;
    });
  }, [categories, books, searchTerm, usageFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="lms-page-header">
              <div>
                <h2 className="lms-page-title">Quản lý thể loại</h2>
                <p className="lms-page-subtitle">Tìm kiếm thể loại và kiểm tra nhóm nào đang được dùng.</p>
              </div>
            </div>

            <div className="lms-toolbar">
              <div className="row g-3 align-items-end">
                <div className="col-md-7">
                  <label className="form-label small fw-semibold text-secondary">Tìm kiếm</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                    <input
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tên thể loại hoặc ID..."
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Trạng thái sử dụng</label>
                  <select className="form-select" value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="used">Đang có sách</option>
                    <option value="unused">Chưa có sách</option>
                  </select>
                </div>
                <div className="col-md-1 d-grid">
                  <button
                    className="btn btn-light border"
                    title="Xóa bộ lọc"
                    onClick={() => {
                      setSearchTerm('');
                      setUsageFilter('all');
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="lms-result-count mt-3">
                Hiển thị {filteredCategories.length} / {categories.length} thể loại
              </div>
            </div>

            <DataTable data={filteredCategories} columns={columns} onEdit={setSelected} onDelete={handleDelete} />
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
              <h5>{selected ? 'Sửa thể loại' : 'Thêm thể loại'}</h5>
              <CategoryForm 
                category={selected} 
                onSave={handleSave} 
                onCancel={() => setSelected(null)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
