<?php

namespace App\Http\Controllers\Coordinacion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Habilitacion;
use App\Models\Matricula;

class HabilitacionController extends Controller
{
    /**
     * Mostrar las habilitaciones de un curso.
     *
     * @param  string  $cursoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(){

    }

    public function show($cursoId)
    {
        try {
            // Obtener todas las matrículas del curso
            $matriculas = Matricula::where('curso', $cursoId)->get();

            // Extraer los IDs de las matrículas
            $matriculaIds = $matriculas->pluck('id')->toArray();

            // Obtener las habilitaciones relacionadas con esas matrículas
            $habilitaciones = Habilitacion::whereIn('matricula', $matriculaIds)
                ->with(['matricula', 'asignacion']) // Cargar relaciones si es necesario
                ->get();

            return response()->json([
                'message' => 'Habilitaciones obtenidas exitosamente.',
                'data' => $habilitaciones,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las habilitaciones.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Guardar una nueva habilitación.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'matricula' => 'required|uuid',
            'asignacion' => 'required|uuid',
            'nota' => 'required|numeric|min:0|max:5',
        ]);

        try {
            // Verificar si ya existe un registro con la misma 'asignacion' y 'matricula'
            $habilitacion = Habilitacion::where('asignacion', $validatedData['asignacion'])
                ->where('matricula', $validatedData['matricula'])
                ->first();

            if ($habilitacion) {
                // Si existe, actualizar el registro
                $habilitacion->nota = $validatedData['nota'];
                $habilitacion->registra = auth()->user()->id; // Actualizar el usuario que registra
                $habilitacion->updated_at = now(); // Actualizar la fecha de modificación
                $habilitacion->save();

                return response()->json([
                    'message' => 'Habilitación actualizada exitosamente.',
                    'data' => $habilitacion,
                ], 200);
            } else {
                // Si no existe, crear un nuevo registro
                $habilitacion = new Habilitacion();
                $habilitacion->id = Str::uuid(); // Generar un UUID para el ID
                $habilitacion->registra = auth()->user()->id; // Usuario autenticado que registra
                $habilitacion->matricula = $validatedData['matricula'];
                $habilitacion->asignacion = $validatedData['asignacion'];
                $habilitacion->nota = $validatedData['nota'];
                $habilitacion->save();

                return response()->json([
                    'message' => 'Habilitación creada exitosamente.',
                    'data' => $habilitacion,
                ], 201);
            }
        } catch (\Exception $e) {
            // Manejar errores
            return response()->json([
                'message' => 'Error al procesar la habilitación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function verificarHabilitacion($matriculaId)
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
                ->where('habilitacion.matricula', $matriculaId)
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
                    'matricula' => $matriculaId,
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
