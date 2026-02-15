<?php

namespace App\Repositories;

use App\Models\Matricula;
use App\Models\Periodo;
use App\Models\Lectivo;
use App\Models\Escala;
use App\Models\NotaCompetencia;
use App\Models\Competencia;
use Illuminate\Support\Facades\DB;

class MatriculaRepository {
    public function obtenerNotasAlumno($id) {
        // Aquí es donde realizarás la consulta como mostré en el ejemplo anterior
        $matriculas = Matricula::select('matriculas.*')
        ->where('matriculas.alumno', $id)
        ->orderBy('matriculas.created_at', 'desc')
        ->with('curso.director')
        ->with('curso.sede')
        ->with('curso.lectivo.nivel')
        ->with('curso.grado')
        ->with(['curso_r.asignaciones' => function ($query) {
            $query->with('docente');
            $query->with('materia');
        }])
        ->get();
        foreach($matriculas as $index => $matricula){

            $periodos = Periodo::where('lectivo', $matricula->curso_r->lectivo)->orderBy('orden')->get();
            $lectivo = Lectivo::find($matricula->curso_r->lectivo);
            $escalas = Escala::where('nivel', $lectivo->nivel)->get();
            $matricula->periodos = $periodos;
            $matricula->escalas = $escalas;
            if($matricula->curso_r->asignaciones->count() > 0){
                $matricula->curso_r->asignaciones->each(function($asignacion) use ($matricula){
                    $data = NotaCompetencia::
                        select(
                            'periodos.id as periodo_id',
                            'periodos.nombre',
                            'periodos.porcentaje as porcentaje',
                            DB::raw('ROUND(AVG(nota_competencia.nota), 1) as lanota')
                        )
                        ->where('asignacion', $asignacion->id)
                        ->where('matricula', $matricula->id)
                        ->join('periodos', 'periodos.id', '=', 'nota_competencia.periodo')
                        ->groupBy('periodos.id')
                        ->orderBy('periodos.orden')
                        ->get();
                    $asignacion->notas = $data;
                    $asignacion->periodos = $matricula->periodos;
                    $asignacion->escalas = $matricula->escalas;
                });
            }
        }

        return $matriculas;
    }

    public function obtenerNotasCurso($id) {
        $data = [];
        $matriculas = Matricula::select('matriculas.*')
            ->where('matriculas.curso', $id)
            ->get();
        foreach($matriculas as $index => $matricula){
            $datam = Matricula::select('matriculas.*')
                ->where('matriculas.id', $matricula->id)
                ->orderBy('matriculas.created_at', 'desc')
                ->with('alumno.alumno')
                ->with('curso.director')
                ->with('curso.sede')
                ->with('curso.lectivo.nivel')
                ->with('curso.grado')
                ->with(['curso_r.asignaciones' => function ($query) {
                    $query->with('docente');
                    $query->with('materia.area');
                }])
                ->first();


            $periodos = Periodo::where('lectivo', $datam->curso_r->lectivo)->orderBy('orden')->get();
            $lectivo = Lectivo::find($datam->curso_r->lectivo);
            $escalas = Escala::where('nivel', $lectivo->nivel)->get();
            $datam->periodos = $periodos;
            $datam->escalas = $escalas;
            if($datam->curso_r->asignaciones->count() > 0){
                $datam->curso_r->asignaciones->each(function($asignacion) use ($datam){
                    $data = NotaCompetencia::
                        select(
                            'periodos.id as periodo_id',
                            'periodos.nombre',
                            'periodos.porcentaje as porcentaje',
                            DB::raw('ROUND(AVG(nota_competencia.nota), 1) as lanota')
                        )
                        ->where('asignacion', $asignacion->id)
                        ->where('matricula', $datam->id)
                        ->join('periodos', 'periodos.id', '=', 'nota_competencia.periodo')
                        ->groupBy('periodos.id')
                        ->orderBy('periodos.orden')
                        ->get();

                    $competencias = NotaCompetencia::
                        select(
                            'periodos.id as periodo_id',
                            'periodos.nombre',
                            'competencias.detalle as competencia'
                        )
                        ->where('asignacion', $asignacion->id)
                        ->where('matricula', $datam->id)
                        ->join('periodos', 'periodos.id', '=', 'nota_competencia.periodo')
                        ->join('competencias', 'competencias.id', '=', 'nota_competencia.competencia')
                        ->orderBy('periodos.orden')
                        ->get();
                    $asignacion->notas = $data;
                    $asignacion->competencias = $competencias;
                    $asignacion->periodos = $datam->periodos;
                    $asignacion->escalas = $datam->escalas;
                });
            }
            $data[] = $datam;
        }
        return $data;
    }

    public function obtenerNotasMatricula($id) {
        // Recupera la matrícula única con sus relaciones
        $matricula = Matricula::select('matriculas.*')
            ->where('matriculas.id', $id)
            ->orderBy('matriculas.created_at', 'desc')
            ->with('curso.director')
            ->with('curso.sede')
            ->with('curso.lectivo.nivel')
            ->with('curso.grado')
            ->with('alumno.alumno')
            ->with(['curso_r.asignaciones' => function ($query) {
                $query->with('docente');
                $query->with('materia.area');
            }])
            ->first();

        // Si se encontró la matrícula, se le añaden los datos adicionales
        if ($matricula) {
            $periodos = Periodo::where('lectivo', $matricula->curso_r->lectivo)
                ->orderBy('orden')
                ->get();
            $lectivo = Lectivo::find($matricula->curso_r->lectivo);
            $escalas = Escala::where('nivel', $lectivo->nivel)
                ->get();

            // Agrega los periodos y escalas a la matrícula
            $matricula->periodos = $periodos;
            $matricula->escalas = $escalas;

            // Recorre cada asignación asociada para obtener sus notas
            if ($matricula->curso_r->asignaciones->count() > 0) {
                $matricula->curso_r->asignaciones->each(function($asignacion) use ($matricula) {
                    $data = NotaCompetencia::select(
                            'periodos.id as periodo_id',
                            'periodos.nombre',
                            'periodos.porcentaje as porcentaje',
                            DB::raw('ROUND(AVG(nota_competencia.nota), 1) as lanota')
                        )
                        ->where('asignacion', $asignacion->id)
                        ->where('matricula', $matricula->id)
                        ->join('periodos', 'periodos.id', '=', 'nota_competencia.periodo')
                        ->groupBy('periodos.id')
                        ->orderBy('periodos.orden')
                        ->get();

                    $competencias = NotaCompetencia::
                        select(
                            'periodos.id as periodo_id',
                            'periodos.nombre',
                            'competencias.detalle as competencia'
                        )
                        ->where('asignacion', $asignacion->id)
                        ->where('matricula', $matricula->id)
                        ->join('periodos', 'periodos.id', '=', 'nota_competencia.periodo')
                        ->join('competencias', 'competencias.id', '=', 'nota_competencia.competencia')
                        ->orderBy('periodos.orden')
                        ->get();

                    $asignacion->notas = $data;
                    $asignacion->competencias = $competencias;
                    $asignacion->periodos = $matricula->periodos;
                    $asignacion->escalas = $matricula->escalas;
                });
            }
        }

        return $matricula;
    }

}
