<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Materia;
use App\Models\Competencia;
class MateriaController extends Controller
{
    //
    public function index()
    {
        // Buscar todas las escalas asociadas a un nivel específico y con estado activo

        $uid = Auth::id();

        $data = Materia::with(['grado', 'area', 'competencias.tipo'])
                ->where('estado', 'activo')
                ->whereHas('asignaciones', function ($query) use ($uid) {
                   $query->where('docente', $uid);
               })
               ->orderBy('nombre')
               ->get();

        // Si se encuentran escalas, retorna los datos
        return response()->json(['data'=>$data], 200);
    }


    public function show($id)
    {
        // Buscar todas las escalas asociadas a un nivel específico y con estado activo


        $data = Materia::with(['grado', 'area', 'competencias.tipo'])
               ->where('id', $id)
               ->orderBy('nombre')
               ->first();

        // Si se encuentran escalas, retorna los datos
        return response()->json(['data'=>$data], 200);
    }


    public function update(Request $request, $id)
    {
        $competencias = $request->input('competencias'); // Acceder a las competencias de la petición.

        foreach($competencias as $competencia) {
            $comp = Competencia::find($competencia['id']);
            if ($comp) {
                $comp->orden = $competencia['nuevoOrden'];
                $comp->save(); // Corrección: usar save() para persistir los cambios.
            }
        }

        $data = Materia::with(['grado', 'area', 'competencias.tipo'])
                        ->where('id', $id)
                        ->orderBy('nombre')
                        ->first();

        // Retorna los datos actualizados.
        return response()->json(['data' => $data], 200);
    }
}

