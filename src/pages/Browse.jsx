import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const Browse = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { isPending, error, data } = useQuery({
    queryKey: ["books", category, searchTerm],
    queryFn: () =>
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm || category || "books"}`
      ).then((res) => res.json()),
  });

  if (isPending) {
    return (
      <div className="p-6 text-center text-sky-500 animate-pulse">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        An error has occurred: {error.message}
      </div>
    );
  }

  const books = data?.items || [];
  const filteredData = books.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Browse</h1>
      <p className="text-gray-700 mb-6">Explore books, authors, and genres.</p>

      <input
        type="text"
        placeholder="Search by book title..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-6 w-full sm:w-1/2 px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((book) => (
          <Link to={`/book/${book.id}`} key={book.id} className="block">
            <div className="border rounded-lg p-4 shadow hover:shadow-lg hover:border-sky-400 transition duration-300">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail || "/images/fallback.jpg"}
                alt={book.volumeInfo.title}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-sky-600">{book.volumeInfo.title}</h2>
              <p className="text-gray-600">👤 {book.volumeInfo.authors?.join(", ") || "Unknown"}</p>
              <p className="text-gray-500 text-sm">📚 {book.volumeInfo.categories?.[0] || "Uncategorized"}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-sky-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-sky-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Browse;