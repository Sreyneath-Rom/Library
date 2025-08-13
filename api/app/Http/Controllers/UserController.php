<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\BorrowedBook;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * GET /api/user/profile
     * Fetch authenticated user's profile.
     */
    public function profile()
    {
        /** @var User $user */
        $user = Auth::user();
        return response()->json($user->only(['id', 'name', 'email']), 200);
    }

    /**
     * PUT /api/user/profile
     * Update authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . Auth::id(),
            ]);

            /** @var User $user */
            $user = Auth::user();
            $user->update($request->only(['name', 'email']));

            return response()->json($user->only(['id', 'name', 'email']), 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * GET /api/user/books/saved
     * Fetch user's saved books.
     */
    public function savedBooks()
    {
        /** @var User $user */
        $user = Auth::user();
        $savedBooks = $user->saved_books ?? [];
        $books = Book::whereIn('id', $savedBooks)->get();
        return response()->json($books, 200);
    }

    /**
     * POST /api/user/books/saved/{bookId}
     * Save a book to user's saved list.
     */
    public function saveBook(int $bookId)
    {
        try {
            Book::findOrFail($bookId); // Ensure book exists

            /** @var User $user */
            $user = Auth::user();
            $savedBooks = $user->saved_books ?? [];

            if (!in_array($bookId, $savedBooks)) {
                $savedBooks[] = $bookId;
                $user->update(['saved_books' => $savedBooks]);

                Notification::create([
                    'user_id' => $user->id,
                    'message' => "Book $bookId added to your library.",
                ]);
            }

            return response()->json(['message' => 'Book saved'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Book not found'], 404);
        }
    }

    /**
     * DELETE /api/user/books/saved/{bookId}
     * Remove a book from user's saved list.
     */
    public function removeSavedBook(int $bookId)
    {
        /** @var User $user */
        $user = Auth::user();
        $savedBooks = $user->saved_books ?? [];
        $savedBooks = array_filter($savedBooks, fn($id) => $id !== $bookId);
        $user->update(['saved_books' => $savedBooks]);
        return response()->json(['message' => 'Book removed'], 200);
    }

    /**
     * GET /api/user/books/borrowed
     * Fetch user's borrowed books with due dates.
     */
    public function borrowedBooks()
    {
        /** @var User $user */
        $user = Auth::user();
        $borrowed = BorrowedBook::where('user_id', $user->id)->get();
        $books = Book::whereIn('id', $borrowed->pluck('book_id'))->get();

        $result = $borrowed->map(function ($b) use ($books) {
            $book = $books->firstWhere('id', $b->book_id);
            return array_merge($book->toArray(), ['due_date' => $b->due_date->toDateString()]);
        });

        return response()->json($result, 200);
    }

    /**
     * POST /api/user/books/borrowed/{bookId}
     * Borrow a book.
     */
    public function borrowBook(int $bookId)
    {
        try {
            Book::findOrFail($bookId); // Ensure book exists

            /** @var User $user */
            $user = Auth::user();
            $dueDate = now()->addDays(14);

            BorrowedBook::create([
                'user_id' => $user->id,
                'book_id' => $bookId,
                'due_date' => $dueDate,
            ]);

            Notification::create([
                'user_id' => $user->id,
                'message' => "Book $bookId borrowed. Due: {$dueDate->toDateString()}",
            ]);

            return response()->json(['message' => 'Book borrowed'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Book not found'], 404);
        }
    }

    /**
     * DELETE /api/user/books/borrowed/{bookId}
     * Return a borrowed book.
     */
    public function returnBook(int $bookId)
    {
        /** @var User $user */
        $user = Auth::user();
        $deleted = BorrowedBook::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Book returned'], 200);
        }
        return response()->json(['error' => 'Book not found in borrowed list'], 404);
    }

    /**
     * POST /api/login
     * Authenticate user and issue token.
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($request->only('email', 'password'))) {
                /** @var User $user */
                $user = Auth::user();
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'user' => $user->only(['id', 'name', 'email']),
                    'token' => $token,
                ], 200);
            }

            return response()->json(['error' => 'Invalid credentials'], 401);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * POST /api/logout
     * Log out user and revoke tokens.
     */
    public function logout()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }

    /**
     * POST /api/register
     * Register a new user and issue token.
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user->only(['id', 'name', 'email']),
                'token' => $token,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
