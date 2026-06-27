import React, { useState } from 'react';

export default function FilterPanel({ categories = [], onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availability, setAvailability] = useState('all');

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    onFilterChange(catId, availability);
  };

  const handleAvailabilityChange = (e) => {
    const avail = e.target.value;
    setAvailability(avail);
    onFilterChange(selectedCategory, avail);
  };

  return (
    <div className="row g-2 mb-3">
      <div className="col-md-6">
        <select
          className="form-select shadow-sm"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ borderRadius: '8px' }}
        >
          <option value="">Tất cả thể loại</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <select
          className="form-select shadow-sm"
          value={availability}
          onChange={handleAvailabilityChange}
          style={{ borderRadius: '8px' }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Còn sách trong thư viện</option>
          <option value="unavailable">Hết sách (Đã mượn hết)</option>
        </select>
      </div>
    </div>
  );
}
