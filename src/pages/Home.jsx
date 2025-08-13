import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Home = () => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/fallback.jpg";
  };

  const { data, isPending } = useQuery({
    queryKey: ["featuredBooks"],
    queryFn: () =>
      fetch("https://www.googleapis.com/books/v1/volumes?q=featured").then((res) =>
        res.json()
      ),
  });

  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      <section id="home" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Escape into a World of Books</h2>
          <p className="text-lg md:text-xl mb-8">
            Discover stories that inspire, educate, and entertain. Your next adventure awaits at BookHaven.
          </p>
          <Link to="/browse" className="bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">
            Browse Catalog
          </Link>
        </div>
      </section>

      <section id="featured" className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-yellow-600 mb-12 text-center">Featured Books</h3>
          {isPending ? (
            <div className="text-center text-sky-500 animate-pulse">Loading featured books...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {(data?.items || []).slice(0, 3).map((book) => (
                <Link to={`/book/${book.id}`} key={book.id} className="block">
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || "/images/fallback.jpg"}
                      alt={book.volumeInfo.title}
                      className="w-full h-48 object-cover mb-4"
                      onError={handleImageError}
                    />
                    <h4 className="font-semibold text-sky-600">{book.volumeInfo.title}</h4>
                    <p className="text-gray-600">{book.volumeInfo.authors?.join(", ") || "Unknown"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">What Readers Are Saying</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Sarah L.", text: "BookHaven helped me rediscover my love for reading. The selection is incredible!" },
              { name: "David P.", text: "Fantastic customer service and fast delivery. Highly recommended!" },
              { name: "Emily R.", text: "I’ve found so many amazing books here. It’s my go-to bookstore now." },
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <p className="text-gray-600 italic mb-4">"{review.text}"</p>
                <h4 className="font-semibold">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 BookHaven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;