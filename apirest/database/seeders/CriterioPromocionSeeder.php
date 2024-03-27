<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CriterioPromocionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('criterio_promocion')->insert([
            'id' => Str::uuid(),
            'nombre' => 'Numérico 1290',
            'num_areas' => 3,
            'num_materias' => 0,
            'hab_areas' => 2,
            'hab_materias' => null,
            'estado' => 'activo',
        ]);
    }
}
