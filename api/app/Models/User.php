<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\BorrowedBook;
use App\Models\Notification;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'saved_books',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for arrays and JSON responses.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'saved_books' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Automatically hash password when set.
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Relationship: User has many borrowed books.
     */
    public function borrowedBooks()
    {
        return $this->hasMany(BorrowedBook::class);
    }

    /**
     * Relationship: User has many notifications.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Revoke all tokens for this user.
     */
    public function revokeAllTokens()
    {
        $this->tokens()->delete();
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}