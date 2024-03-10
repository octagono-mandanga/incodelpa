<?php

namespace App\Http\Controllers\Coordinacion;

use App\Http\Controllers\Controller;
use App\Models\Materia; // Asegúrate de usar el modelo Materia
use Illuminate\Http\Request;


class MateriaController extends Controller
{
    public function index()
    {
        // Incluye las relaciones 'grado' y 'area' al recuperar las materias

        $materias = Materia::select('materias.*')
            ->join('grados', 'grados.id', '=', 'materias.grado')
            ->join('areas', 'areas.id', '=', 'materias.area')
            ->orderBy('grados.orden', 'asc')
            ->orderBy('areas.nombre', 'asc')
            ->orderBy('materias.nombre', 'asc')
            ->with(['grado', 'area'])
            ->get();

        return response()->json(['data'=> $materias], 200);
    }

    public function show($id)
    {
        // Incluye las relaciones 'grado' y 'area' al mostrar una materia específica
        $materia = Materia::with(['grado', 'area'])->find($id);
        if ($materia) {
            return response()->json(['data' => $materia], 200);
        } else {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }
    }



}
