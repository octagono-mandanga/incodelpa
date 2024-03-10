<?php

namespace App\Http\Controllers\Root;
use App\Http\Controllers\Controller;
use App\Models\Area; // Asegúrate de usar el modelo correcto
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AreaController extends Controller
{
    public function index()
    {
        // Cambiaremos 'nivel' por 'nivel' para coincidir con la estructura de tu tabla y modelo

        $areas = Area::select('areas.*') // Selecciona solo las columnas de la tabla 'areas'
        ->join('niveles', 'niveles.id', '=', 'areas.nivel') // Asegúrate de que 'nivel_id' es tu FK en 'areas'
        ->orderBy('niveles.orden', 'asc') // Ordena por la columna 'orden' en la tabla 'niveles'
        ->orderBy('areas.nombre', 'asc') // Luego ordena por la columna 'nombre' en la tabla 'areas'
        ->with('nivel') // Carga la relación 'nivel' para cada 'area'
        ->get();

        return response()->json($areas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            'obligatoriedad' => 'required|string',
            'nivel' => 'required|exists:niveles,id', // Asegúrate de que el campo se llame nivel
        ]);

        $area = Area::create([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'obligatoriedad' => $request->obligatoriedad,
            'nivel' => $request->nivel, // Asegúrate de que el campo se llame nivel en tu modelo
        ]);

        return response()->json(['message' => 'Área creada con éxito', 'data' => $area], 201);
    }

    public function show($id)
    {
        $area = Area::find($id); // Incluye la relación para mostrarla en la respuesta
        if ($area) {
            return response()->json(['data' => $area], 200);
        } else {
            return response()->json(['message' => 'Área no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            'obligatoriedad' => 'required|string',
            'nivel' => 'required|exists:niveles,id',
        ]);

        $area = Area::find($id);

        if ($area) {
            $area->update($request->all());
            return response()->json(['message' => 'Área actualizada con éxito', 'data' => $area], 200);
        } else {
            return response()->json(['message' => 'Área no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        $area = Area::find($id);
        if ($area) {
            $area->delete();
            return response()->json(['message' => 'Área eliminada con éxito'], 200);
        } else {
            return response()->json(['message' => 'Área no encontrada'], 404);
        }
    }
}
