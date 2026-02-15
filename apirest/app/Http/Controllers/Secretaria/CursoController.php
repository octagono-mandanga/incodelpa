<?php

namespace App\Http\Controllers\Secretaria;
use App\Http\Controllers\Controller;
use App\Models\Curso; // Usamos el modelo Curso
use App\Models\Grado; // Usamos el modelo Curso
use App\Models\Matricula; // Usamos el modelo Curso
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
        ->where('lectivos.estado', '=', 'activo')
        ->orderBy('sedes.created_at')
        ->orderBy('niveles.orden')
        ->orderBy('grados.orden')
        ->orderBy('cursos.nombre')
        ->select('cursos.*') // Asegúrate de seleccionar solo las columnas de cursos para evitar conflictos de nombres de columnas
        ->get();


        return response()->json(

            $cursos
        );
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
        $curso = Curso::with(['grado', 'sede', 'lectivo.nivel', 'director', 'coordinador', 'matriculas.alumno.alumno'])->find($id);
        if ($curso) {
            return response()->json(['data' => $curso], 200);
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


    /*
    @Pa-Matricular
    Verifiicar si hay una matricula anterior (ultima).
      Si existe, verificar el estado de esta matricula
        Si el estado es aprobado o promovido:
          Consulltar el curso y obtenemos el atributo grado.
          Con el grado consultamos el registro y de este el atributo orden.
          Obtenemos el grado superior que es igual a orden + 1
          Con esto claro consultamos todos los cursos que correspondan a grado superior y cuyo lectivo tenga estado igual a activo
        Si el estado es no aprobado:
          Consultar el curso y obtenemos el atributo grado.
          Con esto claro consultamos todos los cursos que correspondan a grado  y cuyo lectivo tenga estado igual a activo

      Si no existe
        Consultaar todos los cursos ordenados por grado.orden y cuyo lectivo sea activo
    */
    public function paMatricular($id)
    {
        // Obtener la última matrícula del estudiante
        $ultimaMatricula = Matricula::where('alumno', $id)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // Verificar si existe una última matrícula
        if ($ultimaMatricula) {
            // Verificar el estado de la última matrícula
            if (in_array($ultimaMatricula->estado, ['aprobado', 'promovido'])) {
                // Consultar el curso asociado a la última matrícula
                $curso = Curso::find($ultimaMatricula->curso);
                $grado = Grado::find($curso->grado);

                // Obtener el grado superior
                $gradoSuperior = Grado::where('orden', '>', $grado->orden)->orderBy('orden', 'asc')->first();

                if ($gradoSuperior) {
                    // Consultar todos los cursos del grado superior y cuyo lectivo sea activo
                    $cursos = Curso::where('grado', $gradoSuperior->id)
                                ->whereHas('lectivo', function ($query) {
                                        $query->where('estado', 'activo');
                                    })
                                ->get();
                }
            } elseif ($ultimaMatricula->estado == 'no aprobado') {
                // Consultar el curso asociado a la última matrícula
                $curso = Curso::find($ultimaMatricula->curso);

                // Consultar todos los cursos del mismo grado y cuyo lectivo sea activo
                $cursos = Curso::where('grado', $curso->grado)
                            ->whereHas('lectivo', function ($query) {
                                    $query->where('estado', 'activo');
                                })
                            ->get();
            }
        } else {
            // Si no existe una última matrícula, consultar todos los cursos ordenados por grado.orden y cuyo lectivo sea activo
            $cursos = Curso::select('cursos.*')
               ->join('grados', 'cursos.grado', '=', 'grados.id')
               ->join('lectivos', 'cursos.lectivo', '=', 'lectivos.id')
               ->where('lectivos.estado', 'activo')
               ->where('cursos.estado', 'activo')
               ->orderBy('grados.orden')
               ->orderBy('cursos.nombre')
               ->with('grado') // Si aún necesitas acceder a la relación completa
               ->get();
        }

        // Retornar los cursos obtenidos (este retorno depende de cómo quieras usar los datos, podría ser una vista, un JSON, etc.)
        return response()->json(['data' => $cursos], 200);
    }

    public function anteriores(){
        $grados = Grado::select('grados.*')
        ->join('cursos', 'grados.id', '=', 'cursos.grado')
        ->join('lectivos', 'cursos.lectivo', '=', 'lectivos.id')
        ->where('lectivos.estado', 'anterior')
        ->distinct()               // Para evitar duplicados en caso de que un grado tenga varios cursos
        ->orderBy('grados.orden')
        ->get();


        return response()->json(
            [
                'message' => 'Grados obtenidos con éxito',
                'data' => $grados
            ],
        );
    }
}
