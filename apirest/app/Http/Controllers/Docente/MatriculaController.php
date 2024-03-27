<?php

namespace App\Http\Controllers\Docente;
use App\Http\Controllers\Controller;
use App\Models\Curso; // Usamos el modelo Curso
use App\Models\Matricula; // Usamos el modelo Curso
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MatriculaController extends Controller
{
    public function index()
    {
        //return response()->json($cursos);
    }

    public function show($id)
    {
        // Incluimos las relaciones al buscar el curso específico
        $data = Matricula::select('matriculas.*')
            ->join('users', 'users.id', '=', 'matriculas.alumno')
            ->where('matriculas.curso', $id)
            ->orderBy('users.primer_apellido')
            ->orderBy('users.segundo_apellido')
            ->orderBy('users.primer_nombre')
            ->orderBy('users.segundo_nombre')
            ->with(['alumno.alumno'])
            ->get();
        return response()->json(['data' => $data], 200);
    }


}
