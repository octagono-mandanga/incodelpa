<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Nivel;
use App\Models\Grado;
class GradoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $grados = [/* tus datos de grados aquí, ajustando 'nivel' por 'nivel_id' según los UUID reales de niveles en tu DB */

            ['nombre' => 'Prejardín', 'estado' => 'activo', 'nivel' => 'Preescolar'],
            ['nombre' => 'Jardín', 'estado' => 'activo', 'nivel' => 'Preescolar'],
            ['nombre' => 'Transición', 'estado' => 'activo', 'nivel' => 'Preescolar'],
            ['nombre' => 'Primero', 'estado' => 'activo', 'nivel' => 'Básica Primaria'],
            ['nombre' => 'Segundo', 'estado' => 'activo', 'nivel' => 'Básica Primaria'],
            ['nombre' => 'Tercero', 'estado' => 'activo', 'nivel' => 'Básica Primaria'],
            ['nombre' => 'Cuarto', 'estado' => 'activo', 'nivel' => 'Básica Primaria'],
            ['nombre' => 'Quinto', 'estado' => 'activo', 'nivel' => 'Básica Primaria'],
            ['nombre' => 'Sexto', 'estado' => 'activo', 'nivel' => 'Básica Secundaria'],
            ['nombre' => 'Séptimo', 'estado' => 'activo', 'nivel' => 'Básica Secundaria'],
            ['nombre' => 'Octavo', 'estado' => 'activo', 'nivel' => 'Básica Secundaria'],
            ['nombre' => 'Noveno', 'estado' => 'activo', 'nivel' => 'Básica Secundaria'],
            ['nombre' => 'Décimo', 'estado' => 'activo', 'nivel' => 'Media'],
            ['nombre' => 'Once', 'estado' => 'activo', 'nivel' => 'Media'],

        ];
        $orden = 1;
        foreach ($grados as $grado) {
            $nivel = Nivel::where('nombre', $grado['nivel'])->first();
            Grado::create([
                'id' =>  Str::uuid(),
                'nombre' => $grado['nombre'],
                'estado' => $grado['estado'],
                'orden' => $orden,
                'nivel' => $nivel->id, // Asume que tienes una instancia de Nivel correspondiente
                'created_at' => now()
            ]);
            $orden++;
        }
    }
}
