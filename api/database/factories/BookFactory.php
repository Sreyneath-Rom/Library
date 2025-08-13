<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        return [
            // If you're using a custom string ID, ensure your migration supports it
            'id' => 'book' . $this->faker->unique()->numberBetween(1000, 9999),

            'title' => $this->faker->sentence(3),
            'authors' => $this->faker->randomElements([
                $this->faker->name,
                $this->faker->name,
                $this->faker->name,
            ], rand(1, 2)),

            'categories' => $this->faker->randomElements([
                'Fiction',
                'Science',
                'History',
                'Biography',
                'Fantasy',
                'Technology',
            ], rand(1, 2)),

            'published_date' => $this->faker->date('Y-m-d'),
            'description' => $this->faker->paragraphs(2, true),
            'thumbnail' => $this->faker->imageUrl(200, 300, 'books', true, 'Book Cover'),
        ];
    }
}