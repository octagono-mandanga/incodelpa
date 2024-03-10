<?php

namespace App\Http\Controllers\Secretaria;
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
