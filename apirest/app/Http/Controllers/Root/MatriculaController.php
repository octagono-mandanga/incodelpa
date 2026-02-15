<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Matricula;
use App\Models\Condicion;
use App\Repositories\MatriculaRepository;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MatriculaController extends Controller
{
    //
    protected $matriculaRepo;

    public function __construct(MatriculaRepository $matriculaRepo)
    {
        $this->matriculaRepo = $matriculaRepo;
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

    /**
     * Función que muestra las matrículas de un alumno.
     *
     * @param string $matriculasAlumno El número de matrículas del alumno.
     * @return void
     */

    public function notasMatricula($id)
    {
        $data = $this->matriculaRepo->obtenerNotasMatricula($id);
        return response()->json(['data' => $data], 200);
    }

    public function matriculasCurso($id)
    {
        $data = $this->matriculaRepo->obtenerNotasCurso($id);
        return response()->json(['data' => $data], 200);
    }

    public function cerrarMatricula($id, $promocion)
    {
        // Buscar la matrícula con el ID dado
        $matricula = Matricula::find($id);

        if (!$matricula) {
            return response()->json(['error' => 'Matrícula no encontrada.'], 404);
        }

        // Verificar si la promoción es 1 o 3 para modificar la condición
        if ($promocion == 1 || $promocion == 3) {
            // Obtener el 'id' de la condición basado en el valor de 'promocion'
            $condicion = Condicion::where('nombre', $promocion == 1 ? 'aprobo' : 'no aprobo')->first();

            // Verificar si se encontró la condición
            if (!$condicion) {
                return response()->json(['error' => 'Condición no encontrada.'], 404);
            }

            // Asignar la condición a la matrícula
            $matricula->condicion = $condicion->id;
        }

        // Actualizar el estado de la matrícula a 'inactivo'
        $matricula->estado = 'inactivo';

        // Guardar la matrícula con los cambios
        $matricula->save();

        // Retornar una respuesta exitosa
        return response()->json([
            'data' => $matricula,
            'message' => 'Matrícula cerrada correctamente.'
        ], 200);
    }

}
