<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Book;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /** REGISTER */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'trim'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'], // password_confirmation required
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success('Registration successful', [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /** LOGIN */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials)) {
            return $this->error('Invalid credentials', 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success('Login successful', [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /** LOGOUT */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success('Logged out successfully');
    }

    /** GET PROFILE */
    public function profile(Request $request)
    {
        return $this->success('Profile retrieved', $request->user());
    }

    /** UPDATE PROFILE */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return $this->success('Profile updated', $user);
    }

    /** SAVED BOOKS */
    public function savedBooks(Request $request)
    {
        $bookIds = $request->user()->saved_books ?? [];
        $books = Book::whereIn('id', $bookIds)->get();

        return $this->success('Saved books retrieved', $books);
    }

    public function saveBook(Request $request, $bookId)
    {
        $user = $request->user();
        $book = Book::findOrFail($bookId);

        DB::transaction(function () use ($user, $bookId) {
            $saved = $user->saved_books ?? [];
            if (!in_array($bookId, $saved)) {
                $saved[] = $bookId;
                $user->saved_books = $saved;
                $user->save();
            }
        });

        return $this->success('Book saved', $user->saved_books);
    }

    public function removeSavedBook(Request $request, $bookId)
    {
        $user = $request->user();

        DB::transaction(function () use ($user, $bookId) {
            $saved = $user->saved_books ?? [];
            $user->saved_books = array_values(array_filter($saved, fn($id) => $id != $bookId));
            $user->save();
        });

        return $this->success('Book removed', $user->saved_books);
    }

    /** BORROWED BOOKS */
    public function borrowedBooks(Request $request)
    {
        $books = $request->user()->borrowedBooks()->with('book')->get();
        return $this->success('Borrowed books retrieved', $books);
    }

    public function borrowBook(Request $request, $bookId)
    {
        $user = $request->user();
        $book = Book::findOrFail($bookId);

        if ($user->borrowedBooks()->where('book_id', $bookId)->exists()) {
            return $this->error('Book already borrowed', 400);
        }

        $user->borrowedBooks()->create(['book_id' => $book->id]);

        return $this->success('Book borrowed');
    }

    public function returnBook(Request $request, $bookId)
    {
        $request->user()->borrowedBooks()->where('book_id', $bookId)->delete();
        return $this->success('Book returned');
    }

    /** NOTIFICATIONS */
    public function notifications(Request $request)
    {
        $notifications = $request->user()->notifications()->latest()->get();
        return $this->success('Notifications retrieved', $notifications);
    }

    /** RESPONSE HELPERS */
    protected function success($message, $data = null, $status = 200)
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    protected function error($message, $status = 400, $data = null)
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'data' => $data
        ], $status);
    }
}
