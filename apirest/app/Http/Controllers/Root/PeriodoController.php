<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use App\Models\Periodo;
use Illuminate\Http\Request;

class PeriodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $periodos = Periodo::with('lectivo.nivel')->

                        orderBy('created_at')->get();
        return response()->json($periodos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lectivo' => 'required|exists:lectivos,id',
            'inicio' => 'required|date',
            'fin' => 'required|date',
            'porcentaje' => 'required|numeric',
            'nombre' => 'required|string',
            'estado' => 'required|string',
        ]);
        $orden = Periodo::count();
        $orden++;
        $periodo = Periodo::create([
            'lectivo' => $request->lectivo,
            'inicio' => $request->inicio,
            'fin' => $request->fin,
            'porcentaje' => $request->porcentaje,
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'orden' => $orden
            ]
        );

        return response()->json(['message' => 'Periodo creado con éxito', 'data' => $periodo], 201);
    }

    public function show($id)
    {
        $periodo = Periodo::with('lectivo')->find($id);
        if (!$periodo) {
            return response()->json(['message' => 'Periodo no encontrado'], 404);
        }
        return response()->json(['data' => $periodo], 200);
    }

    public function update(Request $request, Periodo $periodo)
    {
        $validated = $request->validate([
            'lectivo' => 'required|exists:lectivos,id',
            'inicio' => 'required|date',
            'fin' => 'required|date',
            'porcentaje' => 'required|numeric',
            'estado' => 'required|string',
            'nombre' => 'required|string',
        ]);

        $periodo->update($validated);

        return response()->json(['message' => 'Periodo actualizado con éxito', 'data' => $periodo]);
    }

    public function destroy(Periodo $periodo)
    {
        $periodo->delete();

        return response()->json(['message' => 'Periodo eliminado con éxito']);
    }
}
