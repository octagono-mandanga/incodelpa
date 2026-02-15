<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NotaCompetencia;
use App\Models\Asignacion;
use App\Models\Matricula;
use App\Models\Periodo;
use App\Models\Curso;
use App\Models\Lectivo;
use App\Models\Escala;
use App\Models\Competencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class NotaCompetenciaController extends Controller
{
    //
    public function index()
    {
        $notasCompetencia = NotaCompetencia::all();
        return response()->json($notasCompetencia);
    }

    public function fullstore(Request $request){
        $validatedData = $request->validate([
            'alumno' => 'required|uuid|exists:users,id',
            'matricula' => 'required|uuid|exists:matriculas,id',
            'asignacion' => 'required|uuid|exists:asignaciones,id',
            'periodo' => 'required|uuid|exists:periodos,id',
            'competencias' => 'required|array',
            'competencias.*' => 'uuid|exists:competencias,id',
            'nota' => 'sometimes'
        ]);

        foreach($validatedData['competencias'] as $competencia) {
            $data = NotaCompetencia::where('matricula', $validatedData['matricula'])
                ->where('periodo', $validatedData['periodo'])
                ->where('competencia', $competencia)->first();

            if($data){
                $data->nota = $validatedData['nota'] ?? $data->nota; // Si 'nota' no está definido, mantiene el valor actual
                $data->save();
            } else {
                NotaCompetencia::create([
                    'matricula' => $validatedData['matricula'],
                    'asignacion' => $validatedData['asignacion'],
                    'periodo' => $validatedData['periodo'],
                    'competencia' => $competencia,
                    'nota' => $validatedData['nota'] ?? null, // Asume un valor predeterminado si 'nota' no está presente
                ]);
            }
        }

        return response()->json(['message' => 'Operación exitosa'], 201);
    }


    public function store(Request $request){

        $validatedData = $request->validate([
            'alumno' => 'required|uuid|exists:users,id',
            'matricula' => 'required|uuid|exists:matriculas,id',
            'asignacion' => 'required|uuid|exists:asignaciones,id',
            'periodo' => 'required|uuid|exists:periodos,id',
            'competencia' => 'required|uuid|exists:competencias,id',
            'nota' => 'sometimes'
        ]);

        $data = NotaCompetencia::where('matricula', $validatedData['matricula'])
            ->where('matricula', $validatedData['matricula'])
            ->where('periodo', $validatedData['periodo'])
            ->where('competencia', $validatedData['competencia'])->first();
        if($data){
            $data->nota = $validatedData['nota'];
            $data->update();
        } else {
            $data = new NotaCompetencia();
            $data->matricula = $validatedData['matricula'];
            $data->asignacion = $validatedData['asignacion'];
            $data->periodo = $validatedData['periodo'];
            $data->competencia = $validatedData['competencia'];
            $data->nota = $validatedData['nota'];
            $data->save();
        }
        return response()->json(['data' => $data], 201);
    }

    public function asignacion($id)
    {

        $data = NotaCompetencia::where('asignacion', $id)
                    ->orderBy('periodo')
                    ->get();

        // Ahora, agrupa los resultados por periodo usando colecciones

        return response()->json(['data'=>$data], 200);
    }
    public function competencias($id)
    {
        $data = Competencia::join('nota_competencia', 'nota_competencia.competencia', '=', 'competencias.id')
            ->join('periodos', 'nota_competencia.periodo', '=', 'periodos.id')
            ->where('nota_competencia.asignacion', $id)
            ->groupBy('competencias.id', 'periodos.id')
            ->orderBy('periodos.orden')
            ->select('competencias.id as cid', 'periodos.id as pid')
            //->selectRaw('SUM(nota_competencia.nota) as suma_notas')
            ->get(); // Asume que


        return response()->json(['data' => $data], 200);
    }
    public function notasAsignacion($id)
    {
        $asignacion = Asignacion::find($id);
        $matriculas = Matricula::select('matriculas.*')
            ->join('users', 'users.id', '=', 'matriculas.alumno')
            ->where('matriculas.curso', $asignacion->curso)
            ->orderBy('users.primer_apellido')
            ->orderBy('users.segundo_apellido')
            ->orderBy('users.primer_nombre')
            ->orderBy('users.segundo_nombre')
            ->with(['alumno.alumno'])
            ->get();
        $curso = Curso::find($asignacion->curso);
        $periodos = Periodo::where('lectivo', $curso->lectivo)->orderBy('orden')->get();
        $lectivo = Lectivo::find($curso->lectivo);
        $escalas = Escala::where('nivel', $lectivo->nivel)->get();
        $data = NotaCompetencia::where('asignacion', $id)
            ->with('matricula.alumno')
            ->with('periodo')
            ->orderBy('periodo')
            ->get();

        // Ahora, agrupa los resultados por periodo usando colecciones

        return response()->json([
            'data'=>$data,
            'matriculas'=>$matriculas,
            'periodos'=>$periodos,
            'escalas'=>$escalas
        ], 200);
    }

    public function notasAsignacion2($id)
    {
        $asignacion = Asignacion::find($id);
        $curso = Curso::find($asignacion->curso);
        $periodos = Periodo::where('lectivo', $curso->lectivo)->orderBy('orden')->get();
        $lectivo = Lectivo::find($curso->lectivo);
        $escalas = Escala::where('nivel', $lectivo->nivel)->get();
        $data = Matricula::join('cursos', 'cursos.id', '=', 'matriculas.curso')
            ->join('users', 'matriculas.alumno', '=', 'users.id')
            ->join('asignaciones', 'asignaciones.curso', '=', 'cursos.id')
            ->join('periodos', 'periodos.lectivo', '=', 'cursos.lectivo')
            ->leftjoin('nota_competencia', function($join) {
                $join
                    ->on('nota_competencia.asignacion', '=', 'asignaciones.id')
                    ->on('nota_competencia.matricula', '=', 'matriculas.id')
                    ->on('nota_competencia.periodo', '=', 'periodos.id');
                }
            )
            ->where('asignaciones.id', $id)
            ->where('matriculas.estado', 'activo')
            ->groupBy('users.id', 'periodos.id')
            ->orderBy('users.primer_apellido')
            ->orderBy('users.segundo_apellido')
            ->orderBy('users.primer_nombre')
            ->orderBy('users.segundo_nombre')
            ->orderBy('periodos.orden')
            ->select('users.*', 'periodos.nombre','periodos.id as pid', 'periodos.porcentaje as porcentaje', DB::raw('ROUND(AVG(nota_competencia.nota), 1) as lanota'))
            ->get();
        $data->each(function ($item) {
            $avatarPath = "avatars/{$item->id}.png"; // La misma lógica que en tu accesorio.

            if (Storage::disk('public')->exists($avatarPath)) {
                $item->avatar_url = Storage::disk('public')->url($avatarPath);
            } else {
                $item->avatar_url = asset('storage/avatars/avatar.png');
            }
        });
        return response()->json(['data'=>$data, 'escalas' => $escalas, 'periodos'=>$periodos], 200);
    }

}
