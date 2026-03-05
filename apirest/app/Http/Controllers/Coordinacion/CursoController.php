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
            ->orderBy('lectivos.inicio', 'desc')
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
        $resultado = $this->importarCursoIndividual($id);
        return response()->json($resultado['response'], $resultado['status']);
    }

    /**
     * Importar múltiples cursos de un lectivo anterior.
     * Cada curso tiene su propia transacción - si uno falla, no afecta los demás.
     */
    public function importarMultiple(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json([
                'message' => 'No se proporcionaron cursos para importar',
                'success' => false
            ], 400);
        }

        $resultados = [
            'exitosos' => [],
            'fallidos' => [],
            'total' => count($ids),
            'importados' => 0,
            'errores' => 0
        ];

        foreach ($ids as $id) {
            $resultado = $this->importarCursoIndividual($id);

            if ($resultado['success']) {
                $resultados['exitosos'][] = [
                    'id' => $id,
                    'curso' => $resultado['response']['data'] ?? null,
                    'asignaciones_copiadas' => $resultado['response']['asignaciones_copiadas'] ?? 0
                ];
                $resultados['importados']++;
            } else {
                $resultados['fallidos'][] = [
                    'id' => $id,
                    'mensaje' => $resultado['response']['message']
                ];
                $resultados['errores']++;
            }
        }

        $mensaje = "Importación completada: {$resultados['importados']} de {$resultados['total']} cursos importados";
        if ($resultados['errores'] > 0) {
            $mensaje .= ", {$resultados['errores']} con errores";
        }

        return response()->json([
            'message' => $mensaje,
            'success' => $resultados['errores'] === 0,
            'resultados' => $resultados
        ], $resultados['importados'] > 0 ? 200 : 400);
    }

    /**
     * Método privado que importa un curso individual con su propia transacción.
     */
    private function importarCursoIndividual($id): array
    {
        try {
            DB::beginTransaction();

            // Obtener el curso original con sus relaciones
            $cursoOriginal = Curso::with(['asignaciones'])->find($id);

            if (!$cursoOriginal) {
                DB::rollBack();
                return [
                    'success' => false,
                    'status' => 404,
                    'response' => [
                        'message' => 'Curso no encontrado',
                        'success' => false
                    ]
                ];
            }

            // Verificar que el curso pertenece al coordinador actual
            if ($cursoOriginal->coordinador !== Auth::id()) {
                DB::rollBack();
                return [
                    'success' => false,
                    'status' => 403,
                    'response' => [
                        'message' => 'No tiene permisos para importar este curso',
                        'success' => false
                    ]
                ];
            }

            // Obtener el lectivo del curso original usando la relación explícitamente
            $lectivoOriginal = Lectivo::with('nivel')->find($cursoOriginal->getAttributes()['lectivo']);

            if (!$lectivoOriginal) {
                DB::rollBack();
                return [
                    'success' => false,
                    'status' => 400,
                    'response' => [
                        'message' => 'No se encontró el lectivo del curso',
                        'success' => false
                    ]
                ];
            }

            // Obtener el nivel ID del lectivo original
            $nivelId = $lectivoOriginal->getAttributes()['nivel'];
            $nivelModel = $lectivoOriginal->getRelation('nivel');

            // Buscar el lectivo activo del mismo nivel
            $lectivoActivo = Lectivo::where('nivel', $nivelId)
                ->where('estado', 'activo')
                ->first();

            if (!$lectivoActivo) {
                DB::rollBack();
                return [
                    'success' => false,
                    'status' => 400,
                    'response' => [
                        'message' => 'No existe un lectivo activo para el nivel ' . ($nivelModel ? $nivelModel->nombre : $nivelId),
                        'success' => false
                    ]
                ];
            }

            // Verificar si ya existe un curso con el mismo nombre en el lectivo activo
            $cursoExistente = Curso::where('nombre', $cursoOriginal->nombre)
                ->where('lectivo', $lectivoActivo->id)
                ->where('grado', $cursoOriginal->getAttributes()['grado'])
                ->where('sede', $cursoOriginal->getAttributes()['sede'])
                ->first();

            if ($cursoExistente) {
                DB::rollBack();
                return [
                    'success' => false,
                    'status' => 400,
                    'response' => [
                        'message' => 'Ya existe el curso "' . $cursoOriginal->nombre . '" en el lectivo activo',
                        'success' => false
                    ]
                ];
            }

            // Obtener el orden para el nuevo curso
            $orden = Curso::count() + 1;

            // Crear el nuevo curso
            $nuevoCurso = Curso::create([
                'nombre' => $cursoOriginal->nombre,
                'estado' => 'activo',
                'orden' => $orden,
                'grado' => $cursoOriginal->getAttributes()['grado'],
                'sede' => $cursoOriginal->getAttributes()['sede'],
                'lectivo' => $lectivoActivo->id,
                'director' => $cursoOriginal->getAttributes()['director'],
                'coordinador' => Auth::id(),
            ]);

            // Copiar las asignaciones
            $asignacionesCopiadas = 0;
            foreach ($cursoOriginal->asignaciones as $asignacion) {
                Asignacion::create([
                    'curso' => $nuevoCurso->id,
                    'materia' => $asignacion->getAttributes()['materia'],
                    'docente' => $asignacion->getAttributes()['docente'],
                    'estado' => $asignacion->estado,
                ]);
                $asignacionesCopiadas++;
            }

            DB::commit();

            // Cargar el curso con sus relaciones para la respuesta
            $nuevoCurso->load(['grado', 'sede', 'lectivo.nivel', 'director', 'asignaciones.materia', 'asignaciones.docente']);

            return [
                'success' => true,
                'status' => 201,
                'response' => [
                    'message' => 'Curso importado con éxito',
                    'success' => true,
                    'data' => $nuevoCurso,
                    'asignaciones_copiadas' => $asignacionesCopiadas
                ]
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'status' => 500,
                'response' => [
                    'message' => 'Error al importar el curso: ' . $e->getMessage(),
                    'success' => false
                ]
            ];
        }
    }
}
