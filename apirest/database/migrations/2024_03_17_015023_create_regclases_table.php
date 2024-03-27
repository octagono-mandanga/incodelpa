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
        Schema::create('regclases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('tema')->nullable();
            $table->uuid('asignacion');
            $table->string('observacion', 2000)->nullable();

            $table->foreign('asignacion')->references('id')->on('asignaciones');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regclases');
    }
};
