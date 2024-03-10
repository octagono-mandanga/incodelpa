<?php

namespace App\Http\Controllers\Root;
use App\Http\Controllers\Controller;
use App\Models\Grado;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GradoController extends Controller
{
    public function index()
    {

        $grados = Grado::select('grados.*')
            ->join('niveles', 'niveles.id', '=', 'grados.nivel') // Asume que 'nivel_id' es la FK en 'grados'
            ->orderBy('niveles.orden', 'asc')
            ->orderBy('grados.orden', 'asc')
            ->orderBy('grados.created_at', 'asc')
            ->with('nivel') // Cargar la relación después de ordenar
            ->get();

        return response()->json($grados);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            'nivel' => 'required|exists:niveles,id',
        ]);
        $orden = Grado::count();
        $orden++;
        $grado = Grado::create([
            'id' => Str::uuid(),
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'nivel' => $request->nivel,
            'orden' => $request->orden
        ]);

        return response()->json(['message' => 'Nivel creado con éxito', 'data' => $grado], 201);
    }

    public function show($id)
    {
        $grado = Grado::find($id);
        return response()->json(['data' => $grado], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            'nivel' => 'required|exists:niveles,id',
        ]);

        $grado = Grado::find($id);

        $grado->update($request->all());
        return response()->json(['message' => 'Grado actualizado con éxito', 'data' => $grado], 200);
    }

    public function destroy($id)
    {
        $grado = Grado::find($id);
        $grado->delete();
        return response()->json(['message' => 'Grado eliminado con éxito'], 200);
    }
}
