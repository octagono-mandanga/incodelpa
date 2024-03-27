<?php

namespace App\Http\Controllers\Docente;
use App\Http\Controllers\Controller;
use App\Models\Competencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompetenciaController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'materia' => 'required|string',
            'detalle' => 'required|string',
            'tipo' => 'required|exists:tipo_competencias,id',
            'estado' => 'required|string',
        ]);

        // Obtén el número de orden correcto
        $orden = Competencia::where('materia', $request->materia)->count();
        $orden++;

        // Asegúrate de definir $estado antes de usarlo
        $estado = $request->estado;

        $data = Competencia::create([
            'materia' => $request->materia,
            'detalle' => $request->detalle,
            'tipo' => $request->tipo,
            'orden' => $orden,
            'estado' => $estado
        ]);

        return response()->json(['message' => 'Competencia creada con éxito', 'data' => $data], 201);
    }

    public function show($id)
    {
        // Buscar todas las escalas asociadas a un nivel específico y con estado activo
        $data = Competencia::with('materia.grado')->find($id);


        return response()->json(['data'=>$data], 200);
    }

    public function update(Request $request, $id)
    {
        // Validar la solicitud
        $request->validate([
            'materia' => 'required|string',
            'detalle' => 'required|string',
            'tipo' => 'required|exists:tipo_competencias,id',
            'estado' => 'required|string',
        ]);

        // Buscar la competencia específica por ID
        $competencia = Competencia::find($id);

        if (!$competencia) {
            // Si no se encuentra la competencia, devuelve un error
            return response()->json(['message' => 'Competencia no encontrada'], 404);
        }

        // Actualizar la competencia con los datos de la solicitud
        $competencia->update([
            'materia' => $request->materia,
            'detalle' => $request->detalle,
            'tipo' => $request->tipo,
            'estado' => $request->estado, // Puedes usar directamente $request->estado aquí
        ]);

        // Devolver una respuesta exitosa
        return response()->json(['message' => 'Competencia actualizada con éxito', 'data' => $competencia], 200);
    }


}
