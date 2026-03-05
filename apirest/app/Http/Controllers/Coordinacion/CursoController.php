<?php

namespace App\Http\Controllers\Coordinacion;
use App\Http\Controllers\Controller;
use App\Models\Curso; // Usamos el modelo Curso
use App\Models\Lectivo;
use App\Models\Asignacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CursoController extends Controller
{
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

    /**
     * Obtener todos los cursos de lectivos anteriores del coordinador actual.
     * Estos cursos pueden ser importados al año lectivo activo.
     */
    public function anteriores()
    {
        $cursos = Curso::with(['grado', 'sede', 'lectivo.nivel', 'asignaciones.materia', 'asignaciones.docente', 'matriculas.alumno.alumno', 'director'])
            ->join('lectivos', 'lectivos.id', '=', 'cursos.lectivo')
            ->join('niveles', 'niveles.id', '=', 'lectivos.nivel')
            ->join('grados', 'grados.id', '=', 'cursos.grado')
            ->join('sedes', 'sedes.id', '=', 'cursos.sede')
            ->where('cursos.coordinador', Auth::id())
            ->where('lectivos.estado', '=', 'anterior')
            ->orderBy('lectivos.anio', 'desc')
            ->orderBy('sedes.created_at')
            ->orderBy('niveles.orden')
            ->orderBy('grados.orden')
            ->orderBy('cursos.nombre')
            ->select('cursos.*')
            ->get();

        return response()->json([
            'message' => 'Cursos de lectivos anteriores obtenidos con éxito',
            'data' => $cursos
        ]);
    }

    /**
     * Importar un curso de un lectivo anterior al lectivo activo del mismo nivel.
     * Copia el curso y sus asignaciones.
     */
    public function importar($id)
    {
        try {
            DB::beginTransaction();

            // Obtener el curso original con sus relaciones
            $cursoOriginal = Curso::with(['lectivo.nivel', 'asignaciones'])->find($id);

            if (!$cursoOriginal) {
                return response()->json([
                    'message' => 'Curso no encontrado',
                    'success' => false
                ], 404);
            }

            // Verificar que el curso pertenece al coordinador actual
            if ($cursoOriginal->coordinador !== Auth::id()) {
                return response()->json([
                    'message' => 'No tiene permisos para importar este curso',
                    'success' => false
                ], 403);
            }

            // Obtener el nivel del curso original
            $nivelId = $cursoOriginal->lectivo->nivel;

            // Buscar el lectivo activo del mismo nivel
            $lectivoActivo = Lectivo::where('nivel', $nivelId)
                ->where('estado', 'activo')
                ->first();

            if (!$lectivoActivo) {
                return response()->json([
                    'message' => 'No existe un lectivo activo para el nivel ' . $cursoOriginal->lectivo->nivel->nombre,
                    'success' => false
                ], 400);
            }

            // Verificar si ya existe un curso con el mismo nombre en el lectivo activo
            $cursoExistente = Curso::where('nombre', $cursoOriginal->nombre)
                ->where('lectivo', $lectivoActivo->id)
                ->where('grado', $cursoOriginal->grado)
                ->where('sede', $cursoOriginal->sede)
                ->first();

            if ($cursoExistente) {
                return response()->json([
                    'message' => 'Ya existe el curso "' . $cursoOriginal->nombre . '" en el lectivo activo',
                    'success' => false
                ], 400);
            }

            // Obtener el orden para el nuevo curso
            $orden = Curso::count() + 1;

            // Crear el nuevo curso
            $nuevoCurso = Curso::create([
                'nombre' => $cursoOriginal->nombre,
                'estado' => 'activo',
                'orden' => $orden,
                'grado' => $cursoOriginal->grado,
                'sede' => $cursoOriginal->sede,
                'lectivo' => $lectivoActivo->id,
                'director' => $cursoOriginal->director,
                'coordinador' => Auth::id(),
            ]);

            // Copiar las asignaciones
            $asignacionesCopiadas = 0;
            foreach ($cursoOriginal->asignaciones as $asignacion) {
                Asignacion::create([
                    'curso' => $nuevoCurso->id,
                    'materia' => $asignacion->materia,
                    'docente' => $asignacion->docente,
                    'estado' => $asignacion->estado,
                ]);
                $asignacionesCopiadas++;
            }

            DB::commit();

            // Cargar el curso con sus relaciones para la respuesta
            $nuevoCurso->load(['grado', 'sede', 'lectivo.nivel', 'director', 'asignaciones.materia', 'asignaciones.docente']);

            return response()->json([
                'message' => 'Curso importado con éxito',
                'success' => true,
                'data' => $nuevoCurso,
                'asignaciones_copiadas' => $asignacionesCopiadas
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al importar el curso: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
