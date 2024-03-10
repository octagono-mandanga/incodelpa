<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class NivelesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveles = [
            ['nombre' => 'Preescolar', 'estado' => 'activo'],
            ['nombre' => 'Básica Primaria', 'estado' => 'activo'],
            ['nombre' => 'Básica Secundaria', 'estado' => 'activo'],
            ['nombre' => 'Media', 'estado' => 'activo'],
        ];

        $orden = 1;
        foreach ($niveles as $nivel) {
            DB::table('niveles')->insert([
                'id' => Str::uuid(), // Genera un UUID nuevo para cada inserción
                'nombre' => $nivel['nombre'],
                'estado' => $nivel['estado'],
                'orden' => $orden,
                'created_at' => now()
            ]);
            $orden++;
        }
    }
}
