<?php

namespace App\Http\Controllers\Coordinacion;
use App\Http\Controllers\Controller;

use App\Models\Asignacion;
use App\Models\Curso;
use App\Models\Materia;
use App\Models\Matricula;
use App\Models\Periodo;
use App\Models\Lectivo;
use App\Models\Escala;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        $periodos = Periodo::where('lectivo', $curso->lectivo)->orderBy('orden')->get();
        $lectivo = Lectivo::find($curso->lectivo);
        $escalas = Escala::where('nivel', $lectivo->nivel)->get();
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

        foreach($asignaciones as $index => $asignacion){
            $data = Matricula::join('cursos', 'cursos.id', '=', 'matriculas.curso')
            ->join('users', 'matriculas.alumno', '=', 'users.id')
            ->join('asignaciones', 'asignaciones.curso', '=', 'cursos.id')
            ->leftjoin('periodos', 'periodos.lectivo', '=', 'cursos.lectivo')
            ->leftjoin('nota_competencia', function($join) {
                $join
                    ->on('nota_competencia.asignacion', '=', 'asignaciones.id')
                    ->on('nota_competencia.matricula', '=', 'matriculas.id')
                    ->on('nota_competencia.periodo', '=', 'periodos.id');
                }
            )
            ->where('asignaciones.id', $asignacion->id)
            ->where('matriculas.estado', 'activo')
            ->groupBy('users.id', 'periodos.id')
            ->orderBy('users.primer_apellido')
            ->orderBy('users.segundo_apellido')
            ->orderBy('users.primer_nombre')
            ->orderBy('users.segundo_nombre')
            ->orderBy('periodos.orden')
            ->select('users.*', 'periodos.nombre','periodos.id as pid', 'periodos.porcentaje as porcentaje', DB::raw('ROUND(AVG(nota_competencia.nota), 1) as lanota'))
            ->get();
            $data->each(function ($item) {
                $avatarPath = "avatars/{$item->id}.png"; // La misma lógica que en tu accesorio.

                if (Storage::disk('public')->exists($avatarPath)) {
                    $item->avatar_url = Storage::disk('public')->url($avatarPath);
                } else {
                    $item->avatar_url = asset('api/storage/avatars/avatar.png');
                }
            });
            $asignacion->matriculados=$data;
        }
        // Retorna tanto las asignaciones como las materias disponibles
        return response()->json([
            'asignaciones' => $asignaciones,
            'disponibles' => $disponibles,
            'periodos' => $periodos,
            'escalas' => $escalas,
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
