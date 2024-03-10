<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('curso');
            $table->uuid('alumno');
            $table->uuid('matriculador');
            $table->string('estado');
            $table->string('condicion')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('curso')->references('id')->on('cursos');
            $table->foreign('alumno')->references('id')->on('users');
            $table->foreign('matriculador')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matriculas');
    }
};
