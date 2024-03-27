<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoCompetencia;
use Illuminate\Support\Str;

class TipoCompetenciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        TipoCompetencia::create([
            'id' => Str::uuid(),
            'nombre' => 'Cognitiva',
            'porcentaje' => 100,
            'estado' => 'activo',
        ]);
    }
}
