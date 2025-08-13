
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->json('authors')->nullable();
            $table->json('categories')->nullable();
            $table->string('published_date')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->timestamps();
            $table->index('title');
            $table->index('categories');
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};