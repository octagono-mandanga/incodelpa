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
        Schema::create('sedes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('institucion');
            $table->string('nombre');
            $table->string('direccion');
            $table->string('estado');
            $table->timestamps();

            $table->foreign('institucion')->references('id')->on('instituciones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sedes');
    }
};
