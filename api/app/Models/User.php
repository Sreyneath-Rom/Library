<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\BorrowedBook;
use App\Models\Notification;

/**
 * @method array only(array|string $attributes)
 * @method bool update(array $attributes = [], array $options = [])
 * @method \Laravel\Sanctum\NewAccessToken createToken(string $name, array $abilities = ['*'])
 * @method \Illuminate\Database\Eloquent\Relations\MorphMany tokens()
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'saved_books',
    ];

    protected $casts = [
        'saved_books' => 'array',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function borrowedBooks()
    {
        return $this->hasMany(BorrowedBook::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
