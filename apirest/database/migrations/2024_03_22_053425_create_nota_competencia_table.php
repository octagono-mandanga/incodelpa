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
        Schema::create('nota_competencia', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('asignacion');
            $table->uuid('matricula');
            $table->uuid('competencia');
            $table->uuid('periodo');
            $table->decimal('nota', 5, 2);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('asignacion')->references('id')->on('asignaciones');
            $table->foreign('matricula')->references('id')->on('matriculas');
            $table->foreign('competencia')->references('id')->on('competencias');
            $table->foreign('periodo')->references('id')->on('periodos');

            $table->unique(['matricula', 'competencia', 'periodo'], 'idx_matricula_competencia_periodo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nota_competencia');
    }
};
