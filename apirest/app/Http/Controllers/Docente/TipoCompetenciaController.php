<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TipoCompetencia;

class TipoCompetenciaController extends Controller
{
    //
    public function index()
    {

        $data = TipoCompetencia::where('estado', 'activo')
            ->get();

        return response()->json($data, 200);
    }
}
