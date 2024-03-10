<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMateriasTable extends Migration
{
    public function up()
    {
        Schema::create('materias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->integer('ih');
            $table->string('estado');
            $table->uuid('grado');
            $table->uuid('area');
            $table->integer('porcentaje');
            $table->timestamps();

            $table->foreign('grado')->references('id')->on('grados')->onDelete('cascade');
            $table->foreign('area')->references('id')->on('areas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('materias');
    }
}
