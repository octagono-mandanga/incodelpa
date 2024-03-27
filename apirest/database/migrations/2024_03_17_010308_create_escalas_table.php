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
        Schema::create('escalas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre', 45);
            $table->float('minimo')->nullable();
            $table->float('maximo')->nullable();
            $table->string('concepto', 25);
            $table->string('color', 10)->nullable();
            $table->string('estado', 11);
            $table->uuid('nivel');
            $table->uuid('criterio_promocion');
            $table->timestamps();

            $table->foreign('criterio_promocion')->references('id')->on('criterio_promocion');
            $table->foreign('nivel')->references('id')->on('niveles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escalas');
    }
};
