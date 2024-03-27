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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('regclases');
            $table->uuid('alumno');
            $table->text('observacion')->nullable();

            $table->foreign('regclases')->references('id')->on('regclases')->onDelete('cascade');
            $table->foreign('alumno')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
