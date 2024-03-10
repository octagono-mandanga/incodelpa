<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TipoDocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        $tipos = [
            ['nombre' => 'Cédula de Ciudadanía', 'estado' => 'activo'],
            ['nombre' => 'Tarjeta de Identidad', 'estado' => 'activo'],
            ['nombre' => 'Cédula de Extranjería', 'estado' => 'activo'],
            ['nombre' => 'Registro Civil de Nacimiento', 'estado' => 'activo'],
            ['nombre' => 'Número de Identificación Personal (NIP)', 'estado' => 'activo'],
            ['nombre' => 'Número único de Identificación Personal (NUIP)', 'estado' => 'activo'],
            ['nombre' => 'No. Identificación Secretaría de  Educación', 'estado' => 'activo'],
            ['nombre' => 'Certificado Cabildo', 'estado' => 'activo'],
            // Añade más tipos según necesites

        ];

        foreach ($tipos as $tipo) {
            DB::table('tipo_documentos')->insert([
                'id' => Str::uuid(),
                'nombre' => $tipo['nombre'],
                'estado' => $tipo['estado'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
