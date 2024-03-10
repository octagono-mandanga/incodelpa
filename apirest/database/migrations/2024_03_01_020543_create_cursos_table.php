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
        Schema::create('cursos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('estado');
            $table->integer('orden')->nullable();
            $table->uuid('grado');
            $table->uuid('sede');
            $table->uuid('lectivo');
            $table->uuid('director')->nullable();
            $table->uuid('coordinador');
            $table->timestamps();

            $table->foreign('grado')->references('id')->on('grados');
            $table->foreign('sede')->references('id')->on('sedes');
            $table->foreign('lectivo')->references('id')->on('lectivos');
            $table->foreign('director')->references('id')->on('users');
            $table->foreign('coordinador')->references('id')->on('users');

            // Indice único para nombre, lectivo y sede
            $table->unique(['nombre', 'lectivo', 'sede'], 'curso_nombre_lectivo_sede_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
