<?php

namespace App\Http\Controllers\Coordinacion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Matricula;
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

    public function matriculasAlumno($id)
    {
        $data = $this->matriculaRepo->obtenerNotasAlumno($id);
        return response()->json(['data' => $data], 200);
    }

    public function matriculasCurso($id)
    {
        $data = $this->matriculaRepo->obtenerNotasCurso($id);
        return response()->json(['data' => $data], 200);
    }

}
