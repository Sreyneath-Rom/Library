<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::get('/user/books/saved', [UserController::class, 'savedBooks']);
    Route::post('/user/books/saved/{bookId}', [UserController::class, 'saveBook']);
    Route::delete('/user/books/saved/{bookId}', [UserController::class, 'removeSavedBook']);
    Route::get('/user/books/borrowed', [UserController::class, 'borrowedBooks']);
    Route::post('/user/books/borrowed/{bookId}', [UserController::class, 'borrowBook']);
    Route::delete('/user/books/borrowed/{bookId}', [UserController::class, 'returnBook']);
    Route::get('/notifications', [NotificationController::class, 'index']);
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/categories', [BookController::class, 'categories']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
