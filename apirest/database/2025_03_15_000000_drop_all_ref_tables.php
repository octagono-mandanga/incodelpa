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
        // Eliminar todas las tablas del esquema 'ref'
        $tables = DB::select("
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'ref'
        ");

        foreach ($tables as $table) {
            DB::statement("DROP TABLE IF EXISTS ref.\"{$table->tablename}\" CASCADE;");
        }
    }

    public function down(): void
    {
        // No se requiere rollback
    }
};
