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
        Schema::create('expedientes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tipoexpediente');
            $table->uuid('alumno');
            $table->uuid('matricula');
            $table->jsonb('cabecera');
            $table->jsonb('detalle');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('alumno')->references('id')->on('users');
            $table->foreign('matricula')->references('id')->on('matriculas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expedientes');
    }
};
