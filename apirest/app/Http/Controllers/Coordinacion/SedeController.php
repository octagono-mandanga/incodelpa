<?php

namespace App\Http\Controllers\Coordinacion;

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
        $sedes = Sede::orderBy('nombre')->get();
        return response()->json($sedes);
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


}
