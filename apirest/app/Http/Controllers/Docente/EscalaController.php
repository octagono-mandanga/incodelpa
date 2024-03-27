<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Escala;

class EscalaController extends Controller
{
    /**
     * Display a listing of the resource by nivel.
     *
     * @param  string  $nivelId
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscar todas las escalas asociadas a un nivel específico y con estado activo
        $data = Escala::where('nivel', $id)
                         ->where('estado', 'activo')
                         ->get();

        // Si no se encuentran escalas, retorna un error 404
        if ($data->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron escalas para el nivel especificado con estado activo.'
            ], 404);
        }

        // Si se encuentran escalas, retorna los datos
        return response()->json(['data'=>$data], 200);
    }


}

