<?php

namespace App\Http\Controllers\Coordinacion;
use App\Http\Controllers\Controller;

use App\Models\Asignacion; // Asegúrate de tener el modelo Asignacion correctamente definido
use App\Models\Curso; // Asegúrate de tener el modelo Asignacion correctamente definido
use App\Models\Materia; // Asegúrate de tener el modelo Asignacion correctamente definido
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AsignacionController extends Controller
{
    public function index()
    {
        // Obtén todas las asignaciones con sus relaciones necesarias
        $asignaciones = Asignacion::with(['curso', 'materia', 'docente']) // Asegúrate de que el modelo Asignacion tenga definidas estas relaciones
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json($asignaciones);
    }

    public function show($id)
    {
        // Busca una asignación por su UUID
        $asignacion = Asignacion::where('uuid', $id)->with(['curso', 'materia', 'docente'])->first();

        if (!$asignacion) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        return response()->json(['data' => $asignacion], 200);
    }

    public function store(Request $request)
    {
        // Valida los datos de entrada
        /*
        $validatedData = $request->validate([
            'curso' => 'required|exists:cursos,id',
            'materia' => 'required|exists:materias,id',
            'docente' => 'nullable|exists:usuarios,id',
            'estado' => 'required|string',
        ]);
        */
        $validatedData = $request->validate([
            'curso' => 'required|exists:cursos,id',
            'materias' => 'required|array', // Cambio aquí para recibir un array de materias
            'materias.*' => 'exists:materias,id', // Cada materia dentro del array debe existir en la tabla materias
            'docente' => 'nullable|exists:users,id',
            'estado' => 'required|string',
        ]);

        // Crea una nueva asignación
        $asignaciones = [];
        foreach ($validatedData['materias'] as $materiaId) {
            // Crea una nueva asignación por cada materia
            $asignacion = new Asignacion();
            $asignacion->curso = $validatedData['curso'];
            $asignacion->materia = $materiaId;
            $asignacion->docente = $validatedData['docente'] ?? null; // Asume que puede ser null
            $asignacion->estado = $validatedData['estado'];
            $asignacion->save();
            $asignaciones[] = $asignacion; // Guarda la asignación en el array
        }

        // Retorna todas las asignaciones creadas
        return response()->json(['data' => $asignaciones], 201);

    }

    public function update(Request $request, $id)
    {
        // Busca la asignación por UUID y actualízala
        $asignacion = Asignacion::where('uuid', $id)->first();

        if (!$asignacion) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        $asignacion->update($request->all());

        return response()->json(['data' => $asignacion], 200);
    }

    public function destroy($id)
    {
        // Elimina la asignación buscándola por su UUID
        $asignacion = Asignacion::where('id', $id)->first();

        if (!$asignacion) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        $asignacion->delete();

        return response()->json(['message' => 'Asignación eliminada correctamente'], 200);
    }

    public function asignaciones($id)
    {
        // Obtén el curso por su ID para asegurarte de que exista
        $curso = Curso::find($id);

        if (!$curso) {
            return response()->json(['error' => 'Curso no encontrado'], 404);
        }

        // Primero, obtén las asignaciones existentes para este curso
        $asignaciones = Asignacion::select('asignaciones.*')
            ->where('curso', $id)
            ->join('materias', 'materias.id', '=', 'asignaciones.materia')
            ->with(['materia', 'docente'])
            ->orderBy('materias.nombre', 'asc')
            ->get();

        // Luego, encuentra las materias que pertenecen al mismo grado del curso y que aún no están asignadas

        $disponibles = Materia::where('grado', $curso->grado)
            ->where('estado', 'activo')
            ->whereDoesntHave('asignaciones', function ($query) use ($id) {
                $query->where('curso', $id);
            })
            ->orderBy('nombre')
            ->get();

        // Retorna tanto las asignaciones como las materias disponibles
        return response()->json([
            'asignaciones' => $asignaciones,
            'disponibles' => $disponibles
        ]);
    }

    public function libres($id)
    {
        // Obtén el curso por su ID para asegurarte de que exista
        $curso = Curso::find($id);

        if (!$curso) {
            return response()->json(['error' => 'Curso no encontrado'], 404);
        }

        // Luego, encuentra las materias que pertenecen al mismo grado del curso y que aún no están asignadas
        $disponibles = Materia::where('grado', $curso->grado)
            ->where('estado', 'activo')
            ->whereDoesntHave('asignaciones', function ($query) use ($id) {
                $query->where('curso', $id);
            })
            ->orderBy('nombre')
            ->get();

        // Retorna tanto las asignaciones como las materias disponibles
        return response()->json(['data' => $disponibles], 200);
    }



}
