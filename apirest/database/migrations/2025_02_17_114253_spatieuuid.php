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
        // Ajustar la tabla model_has_roles
        Schema::table('model_has_roles', function (Blueprint $table) {
            $table->string('model_id', 36)->change();
        });

        // Ajustar la tabla model_has_permissions
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->string('model_id', 36)->change();
        });
    }

    public function down()
    {
        // Revertir cambios en model_has_roles
        Schema::table('model_has_roles', function (Blueprint $table) {
            $table->integer('model_id')->change();
        });

        // Revertir cambios en model_has_permissions
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->integer('model_id')->change();
        });
    }
};
