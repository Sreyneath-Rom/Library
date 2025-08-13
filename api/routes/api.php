<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::get('/books/saved', [AuthController::class, 'savedBooks']);
    Route::post('/books/save/{bookId}', [AuthController::class, 'saveBook']);
    Route::delete('/books/save/{bookId}', [AuthController::class, 'removeSavedBook']);

    Route::get('/books/borrowed', [AuthController::class, 'borrowedBooks']);
    Route::post('/books/borrow/{bookId}', [AuthController::class, 'borrowBook']);
    Route::delete('/books/return/{bookId}', [AuthController::class, 'returnBook']);

    Route::get('/notifications', [AuthController::class, 'notifications']);
});

