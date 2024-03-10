<?php

namespace App\Http\Controllers\Secretaria;

use App\Http\Controllers\Controller;
use App\Models\Matricula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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


    // Implementa los métodos show, update y destroy según tus necesidades.
}
