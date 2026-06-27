import BookCard from './BookCard';

export default function BookList({ books = [] }) {
  if (books.length === 0) {
    return <p className="text-center text-muted my-4">Không có sách nào.</p>;
  }
  return (
    <div className="row g-3">
      {books.map(book => (
        <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
