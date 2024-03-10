<?php

namespace App\Http\Controllers\Coordinacion;
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

    public function nivel($id)
    {
        $grados = Grado::with('nivel')->where('nivel', $id )->orderBy('nivel')->orderBy('created_at')->get();
        return response()->json($grados);
    }

    public function show($id)
    {
        $grado = Grado::find($id);
        return response()->json(['data' => $grado], 200);
    }

}
