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
        Schema::create('lectivos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('nivel');
            $table->date('inicio');
            $table->date('fin');
            $table->string('estado');
            $table->integer('orden')->nullable();
            $table->timestamps();

            $table->foreign('nivel')->references('id')->on('niveles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lectivos');
    }
};
