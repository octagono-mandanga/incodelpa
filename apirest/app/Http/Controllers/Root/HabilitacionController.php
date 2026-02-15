<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Habilitacion;
use App\Models\Matricula;

class HabilitacionController extends Controller
{

    public function show($idmatricula)
    {
        try {
            // Realizar la consulta con JOIN para evitar problemas con relaciones
            $habilitaciones = Habilitacion::select(
                    'habilitacion.id',
                    'habilitacion.nota',
                    'materias.nombre as materia_nombre',
                    'areas.nombre as area_nombre' // Asegurar que se obtiene el nombre
                )
                ->join('asignaciones', 'asignaciones.id', '=', 'habilitacion.asignacion')
                ->join('materias', 'materias.id', '=', 'asignaciones.materia')
                ->join('areas', 'areas.id', '=', 'materias.area')
                ->where('habilitacion.matricula', $idmatricula)
                ->where('habilitacion.nota', '>=', 3.0)
                ->get();

            if ($habilitaciones->isEmpty()) {
                return response()->json([
                    'message' => 'No hay habilitaciones aprobadas para esta matrícula.',
                    'data' => [],
                ], 200);
            }

            // Construir la lista de asignaturas aprobadas con su área
            $asignaturasAprobadas = $habilitaciones->map(function ($habilitacion) {
                return [
                    'area' => $habilitacion->area_nombre, // Asegurar que devuelve el nombre
                    'materia' => $habilitacion->materia_nombre,
                ];
            });

            return response()->json([
                'message' => 'El alumno aprobó la habilitación.',
                'data' => [
                    'asignaturas_aprobadas' => $asignaturasAprobadas,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al verificar la habilitación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }






}
