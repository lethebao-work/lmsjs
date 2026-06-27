import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

// [Người 4] Common — sẽ thêm sau khi common-components PR được merge
// import Navbar from './components/common/Navbar';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import LoadingSpinner from './components/common/LoadingSpinner';

// [Người 3] Auth
// import LoginPage from './pages/LoginPage';

// [Người 1] Book Module
// import HomePage from './pages/HomePage';
// import BooksPage from './pages/BooksPage';
// import BookDetailPage from './pages/BookDetailPage';

// [Người 2] BorrowRecord
// import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';
// const LibrarianBorrowRecordsPage = lazy(() => import('./pages/librarian/LibrarianBorrowRecordsPage'));

// [Người 3] Member + Category
// const LibrarianMembersPage = lazy(() => import('./pages/librarian/LibrarianMembersPage'));
// const LibrarianCategoriesPage = lazy(() => import('./pages/librarian/LibrarianCategoriesPage'));

// [Người 1] Book Librarian
// const LibrarianBooksPage = lazy(() => import('./pages/librarian/LibrarianBooksPage'));

function App() {
  return (
    <div>App đang trong quá trình xây dựng...</div>
  );
}

export default App;
