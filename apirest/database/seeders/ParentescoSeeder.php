<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ParentescoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $parentescos = [
            ['id' => Str::uuid(), 'nombre' => 'Padre'],
            ['id' => Str::uuid(), 'nombre' => 'Madre'],
            ['id' => Str::uuid(), 'nombre' => 'Tia'],
            ['id' => Str::uuid(), 'nombre' => 'Tia Abuela'],
            ['id' => Str::uuid(), 'nombre' => 'Abuela'],
            ['id' => Str::uuid(), 'nombre' => 'Prima'],
            ['id' => Str::uuid(), 'nombre' => 'Hermana'],
            ['id' => Str::uuid(), 'nombre' => 'Cuñada'],
            ['id' => Str::uuid(), 'nombre' => 'Tio'],
            ['id' => Str::uuid(), 'nombre' => 'Tio Abuelo'],
            ['id' => Str::uuid(), 'nombre' => 'Abuelo'],
            ['id' => Str::uuid(), 'nombre' => 'Primo'],
            ['id' => Str::uuid(), 'nombre' => 'Hermano'],
            ['id' => Str::uuid(), 'nombre' => 'Cuñado'],
            ['id' => Str::uuid(), 'nombre' => 'Padrino'],
            ['id' => Str::uuid(), 'nombre' => 'Madrina'],
            ['id' => Str::uuid(), 'nombre' => 'Padrastro'],
            ['id' => Str::uuid(), 'nombre' => 'Madrastra'],
            ['id' => Str::uuid(), 'nombre' => 'Otro'],
        ];

        DB::table('parentesco')->insert($parentescos);
    }
}
