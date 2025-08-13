import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Simulated backend
const savedBooksStore = [
  { id: "1", title: "Atomic Habits", author: "James Clear", genre: "Self-help" },
  { id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Technology" },
];
const borrowedBooksStore = [
  { id: "3", title: "Sapiens", author: "Yuval Noah Harari", genre: "History", dueDate: "2025-08-20" },
  { id: "4", title: "Educated", author: "Tara Westover", genre: "Memoir", dueDate: "2025-08-25" },
];

const MyBooks = () => {
  const context = useAuth();
  const { user } = context || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const data = activeTab === "saved" ? savedBooksStore : borrowedBooksStore;
        setBooks(data);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setIsLoading(false);
      }
    }, 600);
  }, [activeTab, user]);

  if (!context) {
    return (
      <div className="p-6 text-center text-red-500">
        Authentication context is unavailable. Please check your app setup.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
        Please <Link to="/login" className="text-sky-600 underline">log in</Link> to view your books.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">My Books</h1>
      <p className="text-gray-700 mb-6">Your saved and borrowed books.</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 rounded ${
            activeTab === "saved" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Saved
        </button>
        <button
          onClick={() => setActiveTab("borrowed")}
          className={`px-4 py-2 rounded ${
            activeTab === "borrowed" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Borrowed
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-sky-500 animate-pulse">Loading books...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-500">No books found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="block">
              <div className="border rounded-lg p-4 shadow hover:shadow-lg hover:border-yellow-500 transition duration-300">
                <h2 className="text-xl font-semibold text-sky-600">{book.title}</h2>
                <p className="text-gray-600">👤 {book.author}</p>
                <p className="text-gray-500 text-sm">📚 {book.genre}</p>
                {book.dueDate && (
                  <p className="text-red-500 text-sm">📅 Due: {book.dueDate}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;