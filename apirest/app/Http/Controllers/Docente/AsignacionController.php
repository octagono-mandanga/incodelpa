<?php

namespace App\Http\Controllers\Docente;
use App\Http\Controllers\Controller;

use App\Models\Asignacion;
use App\Models\Curso;
use App\Models\Materia;
use App\Models\Periodo;
use App\Models\Competencia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AsignacionController extends Controller
{
    public function index()
    {
        $asignaciones = Asignacion::with(['curso', 'materia', 'curso.director', 'curso.coordinador', 'curso.sede', 'curso.grado'])
            ->join('cursos', 'cursos.id', '=', 'asignaciones.curso')
            ->join('materias', 'materias.id', '=', 'asignaciones.materia') // Asume que 'lectivo' tiene una FK 'nivel_id'
            ->join('grados', 'grados.id', '=', 'cursos.grado') // Asume que 'lectivo' tiene una FK 'nivel_id'
            ->where('asignaciones.docente', Auth::id())
            ->orderBy('grados.orden')
            ->orderBy('cursos.orden')
            ->orderBy('materias.nombre')
            ->select('asignaciones.*') // Asegúrate de seleccionar solo las columnas de cursos para evitar conflictos de nombres de columnas
            ->get();


        return response()->json(['data' => $asignaciones], 200);
    }

    public function show($id)
    {
        // Busca una asignación por su UUID

        $docenteId = Auth::id();

        $asignacion = Asignacion::with([
            'curso' => function ($query) {
                $query->with([
                    'director',
                    'coordinador',
                    'sede',
                    'grado',
                    'matriculas' => function ($query) {
                        // Carga las matrículas y ordena por datos del alumno asociado
                        $query->join('users', 'users.id', '=', 'matriculas.alumno')
                            ->orderBy('users.primer_apellido')
                            ->orderBy('users.segundo_apellido')
                            ->orderBy('users.primer_nombre')
                            ->orderBy('users.segundo_nombre')
                            ->select('matriculas.*'); // Asegúrate de seleccionar solo las columnas de matrículas aquí
                    }
                ]);
            },
            'materia',
            'curso.matriculas.alumno.alumno',
            'curso.lectivo',
        ])
        ->where('docente', $docenteId)
        ->where('id', $id)
        ->first();


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


    /**
     * Periodo Activo para calificar
     * @param id Asignacion
     * @return data Periodo activo si existe
     */
    public function periodoActivo($id)
    {

        $fechaActual = Carbon::now();



        $periodoActivo = Periodo::join('lectivos', 'lectivos.id', '=', 'periodos.lectivo')
            ->join('cursos', 'cursos.lectivo', '=', 'lectivos.id')
            ->join('asignaciones', 'asignaciones.curso', '=', 'cursos.id')
            ->where('asignaciones.id', $id)
            ->where('periodos.estado', 'activo')
            ->whereDate('periodos.inicio', '<=', $fechaActual)
            ->whereDate('periodos.fin', '>=', $fechaActual)
            ->select('periodos.*') // Selecciona todos los campos de la tabla periodos
            ->first(); // Asume que solo habrá un período activo que coincida con estas condiciones

        if ($periodoActivo) {
            return response()->json(['data' => $periodoActivo], 200);
        } else {
            return response()->json(['data' => ''], 200);
        }

    }

    /**
     * Competencias activo para calificar
     * @param id Asignacion
     * @return data Competencia activo si existe
     */
    public function competencias($id)
    {


        $competencias = Competencia::join('materias', 'materias.id', '=', 'competencias.materia')
            ->join('asignaciones', 'asignaciones.materia', '=', 'materias.id')
            ->where('asignaciones.id', $id)
            ->where('competencias.estado', 'activo')
            ->orderBy('competencias.orden')
            ->select('competencias.*')
            ->get();

        if ($competencias) {
            return response()->json(['data' => $competencias], 200);
        } else {
            return response()->json(['message' => 'No se encontró un periodo activo para la asignación dada.'], 404);
        }

    }




}
