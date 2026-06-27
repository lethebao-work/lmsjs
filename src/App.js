import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';

const LibrarianBooksPage = lazy(() => import('./pages/librarian/LibrarianBooksPage'));
const LibrarianCategoriesPage = lazy(() => import('./pages/librarian/LibrarianCategoriesPage'));
const LibrarianMembersPage = lazy(() => import('./pages/librarian/LibrarianMembersPage'));
const LibrarianBorrowRecordsPage = lazy(() => import('./pages/librarian/LibrarianBorrowRecordsPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container-fluid px-0">
          <Navbar />
          <div className="container mt-4 pb-5">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/my-borrow-records" element={
                  <ProtectedRoute><MyBorrowRecordsPage /></ProtectedRoute>
                } />
                <Route path="/librarian/books" element={
                  <ProtectedRoute requireLibrarian><LibrarianBooksPage /></ProtectedRoute>
                } />
                <Route path="/librarian/categories" element={
                  <ProtectedRoute requireLibrarian><LibrarianCategoriesPage /></ProtectedRoute>
                } />
                <Route path="/librarian/members" element={
                  <ProtectedRoute requireLibrarian><LibrarianMembersPage /></ProtectedRoute>
                } />
                <Route path="/librarian/borrow-records" element={
                  <ProtectedRoute requireLibrarian><LibrarianBorrowRecordsPage /></ProtectedRoute>
                } />
                <Route path="*" element={<div className="alert alert-warning mt-5">404 — Trang không tồn tại</div>} />
              </Routes>
            </Suspense>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
