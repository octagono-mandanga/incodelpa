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
        Schema::create('habilitacion', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('registra'); // Supone que es una FK a una tabla de usuarios
            $table->uuid('asignacion');
            $table->uuid('matricula');
            $table->float('nota', 8, 2)->notNullable();
            $table->text('observacion')->nullable();
            $table->boolean('promover')->nullable();


            $table->foreign('registra')->references('id')->on('users');
            $table->foreign('asignacion')->references('id')->on('asignaciones');
            $table->foreign('matricula')->references('id')->on('matriculas');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habilitacion');
    }
};
