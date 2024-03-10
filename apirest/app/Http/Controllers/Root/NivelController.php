<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use App\Models\Nivel;
use Illuminate\Http\Request;


class NivelController extends Controller
{
    public function index()
    {
        $niveles = Nivel::orderBy('orden')->orderBy('created_at')->get();
        return response()->json($niveles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
            // No necesitas validar el ID ya que se generará automáticamente
        ]);

        $orden = Nivel::count();
        $orden++;

        $nivel = new Nivel([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
            'orden' => $orden
        ]);
        $nivel->save();

        return response()->json(['message' => 'Nivel creado con éxito', 'data' => $nivel], 201);
    }

    public function show($id)
    {
        $nivel = Nivel::findOrFail($id);
        return response()->json(['data' => $nivel], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'estado' => 'required|string',
        ]);

        $nivel = Nivel::findOrFail($id);
        $nivel->nombre = $request->nombre;
        $nivel->estado = $request->estado;
        $nivel->save();

        return response()->json(['message' => 'Nivel actualizado con éxito', 'data' => $nivel], 200);
    }

    public function destroy($id)
    {
        $nivel = Nivel::findOrFail($id);
        $nivel->delete();
        return response()->json(['message' => 'Nivel eliminado con éxito'], 200);
    }
}
