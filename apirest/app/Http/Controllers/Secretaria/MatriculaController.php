<?php

namespace App\Http\Controllers\Secretaria;

use App\Http\Controllers\Controller;
use App\Models\Matricula;
use App\Models\Lectivo;
use App\Models\Grado;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MatriculaController extends Controller
{
    /*
    public function index()
    {
        $matriculas = Matricula::with(['curso', 'alumno', 'matriculador'])->get();
        return response()->json($matriculas);
    }
    */
    public function store(Request $request)
    {
        $request->validate([
            'curso' => 'required|exists:cursos,id',
            'alumno' => 'required|exists:users,id'
        ]);

        $matricula = Matricula::create([
            'curso' => $request->curso,
            'alumno' => $request->alumno,
            'matriculador' => Auth::id(),
            'estado' => 'activo'
        ]);

        return response()->json(['message' => 'Matrícula creada con éxito', 'data' => $matricula], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'curso' => 'required|exists:cursos,id',
        ]);

        $matricula = Matricula::find($id);

        if ($matricula) {
            $matricula->update([
                'curso' => $request->curso
            ]);
        $matricula = Matricula::with('curso.director')->with('curso.grado')->find($id);
            return response()->json(['message' => 'Matricula actualizada con éxito', 'data' => $matricula], 200);
        } else {
            return response()->json(['message' => 'Matricula no encontrada'], 404);
        }
    }

    public function curso($id)
    {
        // Incluye las relaciones 'grado' y 'area' al recuperar las materias

        $data = Matricula::select('users.*', 'alumnos.*')
            ->join('users', 'users.id', '=', 'matriculas.alumno')
            ->join('alumnos', 'alumnos.id', '=', 'users.id')
            ->where('matriculas.curso', $id)
            ->orderBy('users.primer_apellido', 'asc')
            ->orderBy('users.segundo_apellido', 'asc')
            ->orderBy('users.primer_nombre', 'asc')
            ->orderBy('users.segundo_nombre', 'asc')
            ->get();
        $data->each(function ($item) {
            $avatarPath = "avatars/{$item->id}.png"; // La misma lógica que en tu accesorio.

            if (Storage::disk('public')->exists($avatarPath)) {
                $item->avatar_url = Storage::disk('public')->url($avatarPath);
            } else {
                $item->avatar_url = asset('storage/avatars/avatar.png');
            }
        });
        return response()->json(['data'=> $data], 200);
    }

    public function anteriores($id)
    {
        // 1. Obtener el grado actual por el id recibido.
        $gradoActual = Grado::find($id);
        if (!$gradoActual) {
            return response()->json(['message' => 'Grado no encontrado.'], 404);
        }
        $data = [];

        // 2. Calcular el orden del grado anterior.
        $ordenAnterior = $gradoActual->orden - 1;

        // 3. Buscar el grado anterior.
        $gradoAnterior = Grado::where('orden', $ordenAnterior)->first();
        if ($gradoAnterior) {
            // 4. Consultar las matrículas de cursos del grado anterior.
            // Se unen las tablas 'users' y 'cursos' para poder ordenar los resultados.
            $data = Matricula::with(['alumno_r', 'alumno_r.alumno', 'curso'])
            ->whereHas('curso', function ($query) use ($gradoAnterior) {
                $query->where('grado', $gradoAnterior->id);
            })
            ->join('users', 'users.id', '=', 'matriculas.alumno')
            ->join('cursos', 'cursos.id', '=', 'matriculas.curso')
            ->orderBy('cursos.nombre', 'asc')
            ->orderBy('users.primer_apellido', 'asc')
            ->orderBy('users.segundo_apellido', 'asc')
            ->orderBy('users.primer_nombre', 'asc')
            ->orderBy('users.segundo_nombre', 'asc')
            ->get();

             // 5. Obtener TODOS los lectivos activos.
            $activeLectivos = Lectivo::where('estado', 'activo')->get();
            $activeLectivoIds = $activeLectivos->pluck('id')->toArray();

            // 6. Para cada matrícula del grado anterior, determinar si el alumno está matriculado en algún lectivo activo.
            foreach ($data as $matricula) {
                $isActive = Matricula::join('cursos', 'cursos.id', '=', 'matriculas.curso')
                    ->where('matriculas.alumno', $matricula->alumno_r->id)
                    ->whereIn('cursos.lectivo', $activeLectivoIds)
                    ->exists();

                // Se agrega la propiedad "matriculado_actualmente" para marcarlo.
            $matricula->matriculado_actualmente = $isActive;
        }
        }



        return response()->json(['data' => $data], 200);
    }


    /**
     * Matricula a uno o varios estudiantes en un curso.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id  (opcional, si lo necesitas de la URL)
     * @return \Illuminate\Http\JsonResponse
     */
    public function matricular(Request $request, $id = null)
    {
        // Validamos que se envíen 'alumnos' (arreglo) y 'curso' (UUID)
        $data = $request->validate([
            'alumnos' => 'required|array',
            'curso'   => 'required|uuid',
        ]);

        DB::beginTransaction();

        try {
            $matriculas = [];

            foreach ($data['alumnos'] as $alumnoId) {
                // Opcional: Puedes verificar si ya existe una matrícula para evitar duplicados.
                $existe = Matricula::where('curso', $data['curso'])
                    ->where('alumno', $alumnoId)
                    ->first();

                if (!$existe) {
                    $matricula = Matricula::create([
                        'curso'       => $data['curso'],
                        'alumno'      => $alumnoId,
                        // Se asume que el usuario autenticado es quien realiza la matriculación.
                        'matriculador'=> auth()->user()->id,
                        // Puedes ajustar estos valores según tu lógica de negocio.
                        'estado'      => 'activo'
                    ]);
                    $matriculas[] = $matricula;
                }
            }

            DB::commit();

           $curso = Curso::with(['grado', 'sede', 'lectivo.nivel', 'director', 'coordinador', 'matriculas.alumno.alumno'])->find($data['curso']);

            return response()->json([
                'message'    => 'Matriculación realizada exitosamente',
                'data' => $curso,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al matricular: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function anterioresGrado($id)
    {
        // 1. Obtener el grado actual por el id recibido.
        $grado = Grado::find($id);


        // 4. Consultar las matrículas de cursos del grado anterior.
        // Se unen las tablas 'users' y 'cursos' para poder ordenar los resultados.
        $data = Matricula::with(['alumno_r', 'alumno_r.alumno', 'curso'])
            ->whereHas('curso', function ($query) use ($grado) {
                $query->where('grado', $grado->id);
            })
            ->join('users', 'users.id', '=', 'matriculas.alumno')
            ->join('cursos', 'cursos.id', '=', 'matriculas.curso')
            ->orderBy('cursos.nombre', 'asc')
            ->orderBy('users.primer_apellido', 'asc')
            ->orderBy('users.segundo_apellido', 'asc')
            ->orderBy('users.primer_nombre', 'asc')
            ->orderBy('users.segundo_nombre', 'asc')
            ->get();

        // 5. Obtener TODOS los lectivos activos.
        $activeLectivos = Lectivo::where('estado', 'activo')->get();
        $activeLectivoIds = $activeLectivos->pluck('id')->toArray();

        // 6. Para cada matrícula del grado anterior, determinar si el alumno está matriculado en algún lectivo activo.
        foreach ($data as $matricula) {
            $isActive = Matricula::join('cursos', 'cursos.id', '=', 'matriculas.curso')
                ->where('matriculas.alumno', $matricula->alumno_r->id)
                ->whereIn('cursos.lectivo', $activeLectivoIds)
                ->exists();

            // Se agrega la propiedad "matriculado_actualmente" para marcarlo.
            $matricula->matriculado_actualmente = $isActive;
        }

        return response()->json(['data' => $data], 200);
    }



}
