<?php

namespace App\Http\Controllers\Coordinacion;
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
        ->where('lectivos.estado', 'activo') // Filtra por el estado 'activo'
        ->orderBy('lectivos.estado', 'asc') // Luego ordena por la columna 'nombre' en la tabla 'areas'
        ->orderBy('niveles.orden', 'asc') // Ordena por la columna 'orden' en la tabla 'niveles'
        ->with('nivel') // Carga la relación 'nivel' para cada 'area'

        ->get();
        return response()->json($lectivos);
    }


    public function show($id)
    {
        $lectivo = Lectivo::with('nivel')->find($id);
        if (!$lectivo) {
            return response()->json(['message' => 'Lectivo no encontrado'], 404);
        }
        return response()->json(['data' => $lectivo], 200);
    }


}
