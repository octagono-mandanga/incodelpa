<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('criterio_promocion', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre', 45);
            $table->integer('num_areas')->nullable();
            $table->integer('num_materias')->nullable();
            $table->integer('hab_areas')->nullable();
            $table->integer('hab_materias')->nullable();
            $table->string('estado', 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criterio_promocion');
    }
};
