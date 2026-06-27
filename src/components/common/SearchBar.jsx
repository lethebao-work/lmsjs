import React, { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Tìm kiếm...' }) {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <div className="input-group mb-3 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <span className="input-group-text bg-white border-end-0 text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </span>
      <input
        type="text"
        className="form-control border-start-0 border-end-0 ps-0"
        placeholder={placeholder}
        value={term}
        onChange={handleChange}
        style={{ boxShadow: 'none' }}
      />
      {term && (
        <button 
          className="btn btn-white border-start-0 border-top border-bottom border-end text-muted" 
          type="button" 
          onClick={handleClear}
          style={{ borderColor: '#dee2e6' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
