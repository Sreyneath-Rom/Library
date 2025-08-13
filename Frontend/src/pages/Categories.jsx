import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Categories = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      Promise.resolve([
        "Fiction",
        "Non-Fiction",
        "Science Fiction",
        "Mystery",
        "Biography",
      ]),
  });

  if (isPending) {
    return (
      <div className="p-6 text-center text-sky-500 animate-pulse">
        Loading categories...
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Categories</h1>
      <p className="text-gray-700 mb-6">Browse books by category.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((category, index) => (
          <Link to={`/category/${encodeURIComponent(category)}`} key={index} className="block">
            <div className="border rounded-lg p-4 shadow hover:shadow-lg hover:border-yellow-500 transition duration-300 flex flex-col items-center text-center">
              <div className="text-4xl mb-2">📚</div>
              <h2 className="text-lg font-semibold text-sky-600 capitalize">
                {category.replace(/-/g, " ")}
              </h2>
              <p className="text-gray-500 text-sm">Explore books in this category</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;