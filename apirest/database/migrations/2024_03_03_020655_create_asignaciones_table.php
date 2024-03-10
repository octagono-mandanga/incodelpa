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
        Schema::create('asignaciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('curso');
            $table->uuid('materia');
            $table->uuid('docente');

            $table->foreign('curso')->references('id')->on('cursos');
            $table->foreign('materia')->references('id')->on('materias');
            $table->foreign('docente')->references('id')->on('users')->nullable();

            $table->string('estado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignaciones');
    }
};
