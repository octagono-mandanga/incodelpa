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
        Schema::create('promover', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('matricula');
            $table->uuid('coordinador');
            $table->text('observacion');

            $table->foreign('matricula')->references('id')->on('matriculas');
            $table->foreign('coordinador')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promover');
    }
};
