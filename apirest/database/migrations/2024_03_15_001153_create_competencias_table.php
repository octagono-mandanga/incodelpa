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
        Schema::create('competencias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('materia');
            $table->text('detalle');
            $table->integer('orden');
            $table->uuid('tipo');
            $table->string('estado');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('materia')->references('id')->on('materias');
            $table->foreign('tipo')->references('id')->on('tipo_competencias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competencias');
    }
};
