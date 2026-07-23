import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';
import MyFinesPage from './pages/member/MyFinesPage';
import ProfilePage from './pages/ProfilePage';

const LibrarianBooksPage = lazy(() => import('./pages/librarian/LibrarianBooksPage'));
const LibrarianCategoriesPage = lazy(() => import('./pages/librarian/LibrarianCategoriesPage'));
const LibrarianMembersPage = lazy(() => import('./pages/librarian/LibrarianMembersPage'));
const LibrarianBorrowRecordsPage = lazy(() => import('./pages/librarian/LibrarianBorrowRecordsPage'));
const LibrarianFinesPage = lazy(() => import('./pages/librarian/LibrarianFinesPage'));
const LibrarianBookSuggestionsPage = lazy(() => import('./pages/librarian/LibrarianBookSuggestionsPage'));
const LibrarianDashboard = lazy(() => import('./pages/librarian/LibrarianDashboard'));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));
const BookSuggestionPage = lazy(() => import('./pages/member/BookSuggestionPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Navbar />
          <div className="flex-grow-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><MemberDashboard /></ProtectedRoute>
                } />
                <Route path="/my-borrow-records" element={
                  <ProtectedRoute><MyBorrowRecordsPage /></ProtectedRoute>
                } />
                <Route path="/my-fines" element={
                  <ProtectedRoute><MyFinesPage /></ProtectedRoute>
                } />
                <Route path="/book-suggestions" element={
                  <ProtectedRoute><BookSuggestionPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/librarian/dashboard" element={
                  <ProtectedRoute requireLibrarian><LibrarianDashboard /></ProtectedRoute>
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
                <Route path="/librarian/fines" element={
                  <ProtectedRoute requireLibrarian><LibrarianFinesPage /></ProtectedRoute>
                } />
                <Route path="/librarian/book-suggestions" element={
                  <ProtectedRoute requireLibrarian><LibrarianBookSuggestionsPage /></ProtectedRoute>
                } />
                <Route path="*" element={<div className="container mt-5"><div className="alert alert-warning">404 — Trang không tồn tại</div></div>} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
