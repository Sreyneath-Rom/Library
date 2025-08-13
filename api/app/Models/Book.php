<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'title', 'authors', 'categories', 'published_date', 'description', 'thumbnail'];
    protected $casts = ['authors' => 'array', 'categories' => 'array'];
    public $incrementing = false;
    protected $keyType = 'string';

}
