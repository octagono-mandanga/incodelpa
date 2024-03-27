<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CondicionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $condiciones = [
            ['id' => Str::uuid(), 'nombre' => 'aprobo', 'estado' => 'activo'],
            ['id' => Str::uuid(), 'nombre' => 'no aprobo', 'estado' => 'activo'],
            ['id' => Str::uuid(), 'nombre' => 'desertó', 'estado' => 'activo'],
            ['id' => Str::uuid(), 'nombre' => 'aplazado', 'estado' => 'activo'],
            ['id' => Str::uuid(), 'nombre' => 'trasladado a otra institución educativa', 'estado' => 'activo'],
            ['id' => Str::uuid(), 'nombre' => 'no Aplica', 'estado' => 'activo'],
        ];

        DB::table('condiciones')->insert($condiciones);
    }
}
