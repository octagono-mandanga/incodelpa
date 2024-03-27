<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CriterioPromocion; // Importa el modelo
use App\Models\Nivel; // Importa el modelo
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EscalaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Asegúrate de que existe un criterio_promocion o usa un valor existente
        $criterioPromocion = CriterioPromocion::first(); // Obtiene el primer criterio_promocion
        // Obtener todos los niveles existentes
        $niveles = Nivel::all();
        if ($criterioPromocion) {
            foreach ($niveles as $nivel) {
                DB::table('escalas')->insert([
                    ['id' => Str::uuid(), 'nombre' => 'bajo', 'minimo' => 1, 'maximo' => 2.9, 'concepto' => 'reprobado', 'color' => '#E57373', 'estado' => 'activo', 'nivel' => $nivel->id, 'criterio_promocion' => $criterioPromocion->id],
                    ['id' => Str::uuid(), 'nombre' => 'básico', 'minimo' => 3, 'maximo' => 3.9, 'concepto' => 'aprobado', 'color' => '#FFB74D', 'estado' => 'activo', 'nivel' => $nivel->id, 'criterio_promocion' => $criterioPromocion->id],
                    ['id' => Str::uuid(), 'nombre' => 'alto', 'minimo' => 4, 'maximo' => 4.4, 'concepto' => 'aprobado', 'color' => '#81C784', 'estado' => 'activo', 'nivel' => $nivel->id, 'criterio_promocion' => $criterioPromocion->id],
                    ['id' => Str::uuid(), 'nombre' => 'superior', 'minimo' => 4.5, 'maximo' => 5, 'concepto' => 'aprobado', 'color' => '#4DB6AC', 'estado' => 'activo', 'nivel' => $nivel->id, 'criterio_promocion' => $criterioPromocion->id],
                ]);
            }
        }
    }
}
