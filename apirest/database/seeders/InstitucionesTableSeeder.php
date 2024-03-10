<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // Importar la clase Str para generar UUIDs
use App\Models\Institucion;

class InstitucionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        Institucion::create([
            'id' => Str::uuid(), // Generar un UUID
            'tipo' => 'Institución Educativa',
            'nombre' => 'Nuestra Senora de los Remedios',
            'direccion' => 'Calle Falsa 123',
            'telefono' => '123456789',
            'email' => 'contacto@institucion1.edu',
            'dane' => '1111111111',
            'url' => 'http://www.institucion1.edu',
        ]);
    }
}
