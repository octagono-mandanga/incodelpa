<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AreasTableSeeder extends Seeder
{
    public function run()
    {
        // Primero, obtenemos los ids de los niveles basados en los nombres.
        $niveles = [
            'Preescolar' => null,
            'Básica Primaria' => null,
            'Básica Secundaria' => null,
            'Media' => null,
        ];

        foreach ($niveles as $nombre => $id) {
            $nivel = DB::table('niveles')->where('nombre', $nombre)->first();
            if ($nivel) {
                $niveles[$nombre] = $nivel->id;
            }
        }

        // Datos de áreas a insertar, organizados por nivel y luego alfabéticamente por nombre.
        $areasDatos = [
            // Asumiendo que tienes los datos de las áreas aquí.
            // Ejemplo:
            // ['nivel' => 'Preescolar', 'nombre' => 'Matemáticas', 'estado' => 'activo', 'obligatoriedad' => 'obligatoria'],
            // ... otros datos ...
            ["nombre" => "Educación Artística", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Educación Artística", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Educación Artística", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Educación Artística", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Ciencias Naturales", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Ciencias Naturales", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Ciencias Naturales", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Ciencias Sociales", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Ciencias Sociales", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Comerciales", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Comerciales", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Disciplina", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Disciplina", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Disciplina", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Educación Física Recreación y Deportes", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Educación Física Recreación y Deportes", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Educación Física Recreación y Deportes", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Educación Física Recreación y Deportes", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Ética y Valores", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Ética y Valores", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Ética y Valores", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Filosofía", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Humanidades", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Humanidades", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Humanidades", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Informática", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Informática", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Informática", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Informática", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Inglés", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Integradas", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Matemáticas", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Matemáticas", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Matemáticas", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],
            ["nombre" => "Pre-escritura", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Pre-matemáticas", "obligatoriedad" => "obligatoria", "nivel" => "Preescolar", "estado" => "activo"],
            ["nombre" => "Religión", "obligatoriedad" => "obligatoria", "nivel" => "Básica Primaria", "estado" => "activo"],
            ["nombre" => "Religión", "obligatoriedad" => "obligatoria", "nivel" => "Básica Secundaria", "estado" => "activo"],
            ["nombre" => "Religión", "obligatoriedad" => "obligatoria", "nivel" => "Media", "estado" => "activo"],

        ];

        // Ordenamos los datos por nivel y nombre.
        usort($areasDatos, function ($a, $b) use ($niveles) {
            $nivelA = array_search($a['nivel'], array_keys($niveles));
            $nivelB = array_search($b['nivel'], array_keys($niveles));

            if ($nivelA == $nivelB) {
                return $a['nombre'] <=> $b['nombre'];
            }

            return $nivelA <=> $nivelB;
        });

        // Insertamos los datos en la base de datos.
        foreach ($areasDatos as $area) {
            DB::table('areas')->insert([
                'id' => (string) Str::uuid(),
                'nivel' => $niveles[$area['nivel']] ?? null, // Asignamos el id del nivel correspondiente.
                'nombre' => $area['nombre'],
                'estado' => $area['estado'],
                'obligatoriedad' => $area['obligatoriedad'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
