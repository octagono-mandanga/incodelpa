<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use App\Models\Sede; // Usar el modelo Sede
use App\Models\Institucion; // Asegúrate de tener acceso al modelo Institucion si es necesario
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SedeController extends Controller
{
    public function index()
    {
        // Obtener todas las sedes incluyendo su institución relacionada
        $sedes = Sede::with('institucion')->orderBy('nombre')->get();
        return response()->json($sedes);
    }

    public function store(Request $request)
    {

        $request->validate([
            'nombre' => 'required|string',
            'direccion' => 'required|string'
        ]);

        $institucion = Institucion::first();
        $sede = Sede::create([
            'nombre' => $request->nombre,
            'direccion' => $request->direccion,
            'estado' => $request->estado,
            'institucion' => $institucion->id,
        ]);

        return response()->json(['message' => 'Sede creada con éxito', 'data' => $sede], 201);
    }

    public function show($id)
    {
        // Incluir la institución relacionada en la respuesta
        $sede = Sede::with('institucion')->find($id);
        if ($sede) {
            return response()->json(['data' => $sede], 200);
        } else {
            return response()->json(['message' => 'Sede no encontrada'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'direccion' => 'required|string',
        ]);

        $sede = Sede::find($id);

        if ($sede) {
            $sede->update([
                'nombre' => $request->nombre,
                'direccion' => $request->direccion,
                'estado' => $request->estado,
            ]);
            return response()->json(['message' => 'Sede actualizada con éxito', 'data' => $sede], 200);
        } else {
            return response()->json(['message' => 'Sede no encontrada'], 404);
        }
    }

    public function destroy($id)
    {
        $sede = Sede::find($id);
        if ($sede) {
            $sede->delete();
            return response()->json(['message' => 'Sede eliminada con éxito'], 200);
        } else {
            return response()->json(['message' => 'Sede no encontrada'], 404);
        }
    }
}
