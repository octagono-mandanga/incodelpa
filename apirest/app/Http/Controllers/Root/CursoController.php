<?php

namespace App\Http\Controllers\Root;
use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Lectivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CursoController extends Controller
{
    /*
    public function index()
    {
        // Aquí ajustamos para cargar las relaciones necesarias, por ejemplo: 'grado', 'sede', 'lectivo'

        $cursos = Curso::with(['grado', 'sede', 'lectivo.nivel', 'asignaciones.materia', 'asignaciones.docente', 'matriculas.alumno.alumno', 'director'])
        ->join('lectivos', 'lectivos.id', '=', 'cursos.lectivo')
        ->join('niveles', 'niveles.id', '=', 'lectivos.nivel') // Asume que 'lectivo' tiene una FK 'nivel_id'
        ->join('grados', 'grados.id', '=', 'cursos.grado')
        ->join('sedes', 'sedes.id', '=', 'cursos.sede')
        ->where('cursos.coordinador', Auth::id())
        ->where('lectivos.estado', '=', 'activo')
        ->orderBy('sedes.created_at')
        ->orderBy('niveles.orden')
        ->orderBy('grados.orden')
        ->orderBy('cursos.nombre')
        ->select('cursos.*') // Asegúrate de seleccionar solo las columnas de cursos para evitar conflictos de nombres de columnas
        ->get();


        return response()->json($cursos);
    }


    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            'grado' => 'required|exists:grados,id',
            'sede' => 'required|exists:sedes,id',
            'lectivo' => 'required|exists:lectivos,id',
            'director' => 'nullable|exists:users,id',
        ]);
        $orden = Curso::count();
        $orden++;
        $curso = Curso::create([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'orden' => $orden,
            'grado' => $request->grado,
            'sede' => $request->sede,
            'lectivo' => $request->lectivo,
            'director' => $request->director,
            'coordinador' => Auth::id(), // Asigna el id del usuario autenticado como coordinador_id
        ]);

        return response()->json(['message' => 'Curso creado con éxito', 'data' => $curso], 201);
    }


    public function show($id)
    {
        // Incluimos las relaciones al buscar el curso específico
        $curso = Curso::with(['grado', 'sede', 'lectivo.nivel', 'director'])->find($id);
        if ($curso) {
            return response()->json(['data' => $curso], 200);
        } else {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            // Valida las relaciones como en el método store
            'grado' => 'required|exists:grados,id',
            'sede' => 'required|exists:sedes,id',
            'lectivo' => 'required|exists:lectivos,id',
            'director' => 'nullable|exists:users,id',
        ]);

        $curso = Curso::find($id);

        if ($curso) {
            $curso->update([
                'nombre' => $request->nombre,
                'estado' => $request->estado,
                'grado' => $request->grado,
                'sede' => $request->sede,
                'lectivo' => $request->lectivo,
                'director' => $request->director,
            ]);
            return response()->json(['message' => 'Curso actualizado con éxito', 'data' => $curso], 200);
        } else {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
    }

    public function destroy($id)
    {
        $curso = Curso::find($id);
        if ($curso) {
            $curso->delete();
            return response()->json(['message' => 'Curso eliminado con éxito'], 200);
        } else {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
    }
    */
    public function inactivar($id)
    {
        $curso = Curso::find($id);
        if ($curso) {
            $curso->estado = 'inactivo';
            $curso->save();
            return response()->json(['data' => $curso], 200);
        } else {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }
    }

    public function lectivo($idlectivo)
    {
        $lectivo = Lectivo::with('nivel')->find($idlectivo);
        $cursos = Curso::with([
            'grado',
            'sede',
            'lectivo.nivel',
            'asignaciones.materia',
            'asignaciones.docente',
            'matriculas.alumno.alumno',
            'director'
        ])
        ->where('lectivo', $idlectivo)
        ->join('grados', 'grados.id', '=', 'cursos.grado') // Unión con la tabla grados
        ->orderBy('grados.orden', 'asc')  // Ordenar por el campo 'orden' de la tabla grados
        ->orderBy('cursos.nombre', 'asc') // Luego ordenar por el nombre del curso
        ->select('cursos.*') // Evita conflictos de nombres en la selección
        ->get();

        return response()->json([
            'message' => 'Cursos obtenidos con éxito',
            'data' => $cursos,
            'lectivo' => $lectivo
        ], 200);
    }

}
