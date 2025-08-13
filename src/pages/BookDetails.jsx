import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["book", id],
    queryFn: () =>
      fetch(`https://www.googleapis.com/books/v1/volumes/${id}`).then((res) =>
        res.json()
      ),
  });

  if (isPending) {
    return (
      <div className="p-6 text-center text-sky-500 animate-pulse">
        Loading book details...
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

  const book = data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">{book.volumeInfo.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={book.volumeInfo.imageLinks?.thumbnail || "/images/fallback.jpg"}
          alt={book.volumeInfo.title}
          className="w-full h-64 object-cover rounded"
        />
        <div>
          <p className="text-gray-600 mb-2">👤 <strong>Author:</strong> {book.volumeInfo.authors?.join(", ") || "Unknown"}</p>
          <p className="text-gray-600 mb-2">📚 <strong>Genre:</strong> {book.volumeInfo.categories?.[0] || "Uncategorized"}</p>
          <p className="text-gray-600 mb-2">📅 <strong>Published:</strong> {book.volumeInfo.publishedDate || "Unknown"}</p>
          <p className="text-gray-600 mb-4">{book.volumeInfo.description || "No description available."}</p>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => alert("Save functionality coming soon!")}
          >
            Save Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;