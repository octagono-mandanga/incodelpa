<?php

namespace App\Http\Controllers\Root;
use App\Http\Controllers\Controller;
use App\Models\Lectivo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LectivoController extends Controller
{
    public function index()
    {
        // Ajusta esta línea si la relación se llama de manera diferente

        $lectivos = Lectivo::select('lectivos.*') // Selecciona solo las columnas de la tabla 'areas'
        ->join('niveles', 'niveles.id', '=', 'lectivos.nivel') // Asegúrate de que 'nivel_id' es tu FK en 'areas'
        ->orderBy('lectivos.estado', 'asc') // Luego ordena por la columna 'nombre' en la tabla 'areas'
        ->orderBy('niveles.orden', 'asc') // Ordena por la columna 'orden' en la tabla 'niveles'
        ->with('nivel') // Carga la relación 'nivel' para cada 'area'
        ->get();
        return response()->json($lectivos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nivel' => 'required|exists:niveles,id',
            'inicio' => 'required|date',
            'fin' => 'required|date',
            'estado' => 'required|string',
        ]);
        $orden = Lectivo::count();
        $orden++;
        $lectivo = Lectivo::create([
            'id' => Str::uuid(),
            'nivel' => $request->nivel,
            'inicio' => $request->inicio,
            'fin' => $request->fin,
            'estado' => $request->estado,
            'orden' => $orden
        ]);

        return response()->json(['message' => 'Lectivo creado con éxito', 'data' => $lectivo], 201);
    }

    public function show($id)
    {
        $lectivo = Lectivo::with('nivel')->find($id);
        if (!$lectivo) {
            return response()->json(['message' => 'Lectivo no encontrado'], 404);
        }
        return response()->json(['data' => $lectivo], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nivel' => 'required|exists:niveles,id',
            'inicio' => 'required|date',
            'fin' => 'required|date',
            'estado' => 'required|string',
        ]);

        $lectivo = Lectivo::find($id);
        if (!$lectivo) {
            return response()->json(['message' => 'Lectivo no encontrado'], 404);
        }

        $lectivo->update($request->all());
        return response()->json(['message' => 'Lectivo actualizado con éxito', 'data' => $lectivo], 200);
    }

    public function destroy($id)
    {
        $lectivo = Lectivo::find($id);
        if (!$lectivo) {
            return response()->json(['message' => 'Lectivo no encontrado'], 404);
        }

        $lectivo->delete();
        return response()->json(['message' => 'Lectivo eliminado con éxito'], 200);
    }

    public function inactivar($id)
    {
        $lectivo = Lectivo::find($id);
        $anterior = Lectivo::where('nivel', '=', $lectivo->nivel)
                    ->where('estado', '=', 'anterior')
                    ->first();
        if($anterior) {
            $anterior->estado = 'inactivo';
            $anterior->save();
        }
        if ($lectivo) {
            $lectivo->estado = 'anterior';
            $lectivo->save();
            return response()->json(['data' => $lectivo], 200);
        } else {
            return response()->json(['message' => 'Lectivo no encontrado'], 404);
        }
    }
}
