<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * GET /api/books
     * Fetch books with optional search and category filters, paginated.
     */
    public function index(Request $request)
    {
        $query = Book::query();

        // Search by title
        if ($request->has('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        // Filter by category
        if ($request->has('category')) {
            $query->whereJsonContains('categories', $request->category);
        }

        // Pagination
        $limit = $request->input('limit', 6);
        $books = $query->paginate($limit);

        return response()->json([
            'items' => $books->items(),
            'totalPages' => $books->lastPage(),
        ], 200);
    }

    /**
     * GET /api/books/{id}
     * Fetch details of a specific book by ID.
     */
    public function show($id)
    {
        try {
            $book = Book::findOrFail($id);
            return response()->json($book, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Book not found'], 404);
        }
    }

    /**
     * GET /api/categories
     * Fetch list of available categories.
     */
    public function categories()
    {
        $categories = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Biography'];
        return response()->json($categories, 200);
    }
}