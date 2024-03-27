<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // Importar la clase Str para generar UUIDs
use App\Models\Institucion;
use App\Models\Sede;
use App\Models\Lectivo;
use App\Models\Nivel;
use Carbon\Carbon;

class InstitucionesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $data = Institucion::create([
            'id' => Str::uuid(), // Generar un UUID
            'tipo' => 'Instituto',
            'nombre' => 'Comercial del Pacífico',
            'direccion' => 'Calle 2a No. 47-3 Bellavista',
            'telefono' => '24400306',
            'email' => 'incodelpa@yahoo.com.ar',
            'dane' => '376109006564',
            'url' => 'http://www.incodelpa.com',
        ]);

        Sede::create([
            'id' => Str::uuid(), // Generar un UUID
            'institucion' => $data->id,
            'nombre' => 'Principal',
            'direccion' => 'Calle 2a No. 47-3 Bellavista',
            'estado' => 'activo'
        ]);

        $cont = 0;
        $niveles = Nivel::all();
        foreach($niveles as $nivel){
            Lectivo::create([
                'id' => Str::uuid(), // Generar un UUID
                'nivel' => $nivel->id,
                'inicio' => Carbon::now()->startOfYear(),
                'fin' => Carbon::now()->endOfYear(),
                'estado' => 'activo',
                'orden' => ++$cont
            ]);
        }


    }
}
