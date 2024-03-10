<?php

namespace App\Http\Controllers\Root;

namespace App\Http\Controllers\Root;
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

        return response()->json($materias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'ih' => 'required|integer',
            'estado' => 'required|string',
            'grado' => 'required|exists:grados,id', // Asegúrate de que las validaciones correspondan a tus relaciones
            'area' => 'required|exists:areas,id',
            'porcentaje' => 'required|integer',
        ]);

        $materia = Materia::create([
            'nombre' => $request->nombre,
            'ih' => $request->ih,
            'estado' => $request->estado,
            'grado' => $request->grado, // Usa 'grado_id' y 'area_id' como en tu modelo
            'area' => $request->area,
            'porcentaje' => $request->porcentaje,
        ]);

        return response()->json(['message' => 'Materia creada con éxito', 'data' => $materia], 201);
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

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'ih' => 'required|integer',
            'estado' => 'required|string',
            'grado' => 'required|exists:grados,id',
            'area' => 'required|exists:areas,id',
            'porcentaje' => 'required|integer',
        ]);

        $materia = Materia::find($id);

        if ($materia) {
            $materia->update($request->all());
            return response()->json(['message' => 'Materia actualizada con éxito', 'data' => $materia], 200);
        } else {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        $materia = Materia::find($id);
        if ($materia) {
            $materia->delete();
            return response()->json(['message' => 'Materia eliminada con éxito'], 200);
        } else {
            return response()->json(['message' => 'Materia no encontrada'], 404);
        }
    }
}
