<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use App\Models\Expediente;
use App\Models\User;
use App\Models\Matricula;
use App\Models\Curso;
use App\Models\Sede;
use App\Models\Grado;
use App\Models\Lectivo;
use App\Models\Periodo;
use App\Models\Competencia;
use App\Models\Area;
use App\Models\Materia;
use App\Models\Asignacion;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ExpedienteController extends Controller
{
    public function index()
    {
        $expedientes = Expediente::all();
        return response()->json($expedientes);
    }

    function calcularActualizarNotas($detalles, $periodoId, $areaId, $materiaId) {
        foreach ($detalles['periodos'] as &$periodo) {
            if ($periodo['periodoId'] == $periodoId) {
                foreach ($periodo['areas'] as &$area) {
                    if ($area['areaId'] == $areaId) {
                        foreach ($area['asignaturas'] as &$materia) {
                            if ($materia['materiaId'] == $materiaId) {
                                // Calcula el promedio de notas de las competencias para la materia
                                $sumaNotas = array_sum(array_column($materia['competencias'], 'nota'));
                                $numCompetencias = count($materia['competencias']);
                                $materia['nota'] = $numCompetencias > 0 ? $sumaNotas / $numCompetencias : 0;

                                // No break; porque podemos querer calcular las notas para todas las materias
                            }
                        }

                        // Calcula la nota del área basada en el promedio ponderado de las materias
                        $sumaPonderada = 0;
                        $sumaPorcentajes = 0;
                        foreach ($area['asignaturas'] as $materia) {
                            $sumaPonderada += $materia['nota'] * ($materia['porcentaje'] / 100);
                            $sumaPorcentajes += $materia['porcentaje'];
                        }
                        $area['nota'] = $sumaPorcentajes > 0 ? $sumaPonderada : 0;
                    }
                }

                // Calcula el promedio de notas del periodo
                $sumaNotasAreas = array_sum(array_column($periodo['areas'], 'nota'));
                $numAreas = count($periodo['areas']);
                $periodo['promedio'] = $numAreas > 0 ? $sumaNotasAreas / $numAreas : 0;
            }
        }

        return $detalles;
    }

    function expedienteExistente($data, Expediente $expediente)
    {
        $detalles = json_decode($expediente->detalle, true);
        $competencia = Competencia::find($data['competencia']);
        $asignacion = Asignacion::find($data['asignacion']);
        $periodo = Periodo::find($data['periodo']);
        $materia = Materia::find($asignacion->materia);
        $docente = User::find($asignacion->docente);
        $area = Area::find($materia->area);
        $nota = $data['nota'];

        // Busca si el periodo ya existe
        $periodoIndex = array_search($periodo->id, array_column($detalles['periodos'], 'periodoId'));
        if ($periodoIndex === false) {
            $periodoIndex = count($detalles['periodos']);
            $detalles['periodos'][$periodoIndex] = [
                'periodoId' => $periodo->id,
                'periodo' => $periodo->nombre,
                'porcentaje' => $periodo->porcentaje,
                'promedio' => 0,
                'created_at' => now(),
                'updated_at' => now(),
                'areas' => []
            ];
        }
        else
        {
            $detalles['periodos'][$periodoIndex]['updated_at'] = now();
        }

        // Proceso similar para el área
        $areas = &$detalles['periodos'][$periodoIndex]['areas'];
        $areaIndex = array_search($area->id, array_column($areas, 'areaId'));
        if ($areaIndex === false)
        {
            $areaIndex = count($areas);
            $areas[$areaIndex] = [ 'areaId' => $area->id, 'area' => $area->nombre, 'nota' => 0, 'created_at' => now(), 'updated_at' => now(), 'asignaturas' => [] ];
        }
        else
        {
            $areas[$areaIndex]['updated_at'] = now();
        }

        // Proceso similar para la asignatura
        $asignaturas = &$areas[$areaIndex]['asignaturas'];
        $asignaturaIndex = array_search($materia->id, array_column($asignaturas, 'materiaId'));
        if ($asignaturaIndex === false)
        {
            $asignaturaIndex = count($asignaturas);
            $asignaturas[$asignaturaIndex] = [
                'materiaId' => $materia->id,
                'materia' => $materia->nombre,
                'nota' => 0,
                'porcentaje' => $materia->porcentaje,
                'docente' => $docente->primer_nombre . ' ' . $docente->segundo_nombre . ' ' . $docente->primer_apellido,
                'created_at' => now(),
                'updated_at' => now(),
                'competencias' => []
            ];
        }
        else
        {
            $asignaturas[$asignaturaIndex]['updated_at'] = now();
        }

        // Proceso similar para la competencia
        $competencias = &$asignaturas[$asignaturaIndex]['competencias'];
        $competenciaIndex = array_search($competencia->id, array_column($competencias, 'competenciaId'));
        if ($competenciaIndex === false) {
            $competencias[] = [
                'competenciaId' => $competencia->id,
                'competencia' => $competencia->detalle,
                'nota' => $nota,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        } else {
            $competencias[$competenciaIndex]['nota'] = $nota;
            $competencias[$competenciaIndex]['updated_at'] = now();
        }

        $detallesActualizados = $this->calcularActualizarNotas($detalles, $periodo->id, $area->id, $materia->id);

        $expediente->detalle = json_encode($detallesActualizados);
        $expediente->save();
    }





    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'alumno' => 'required|uuid|exists:users,id',
            'matricula' => 'required|uuid|exists:matriculas,id',
            'asignacion' => 'required|uuid|exists:asignaciones,id',
            'periodo' => 'required|uuid|exists:periodos,id',
            'competencia' => 'required|uuid|exists:competencias,id',
            'tipoexpediente' => 'sometimes|string',
            'nota' => 'sometimes'
        ]);

        // Verifica si ya existe un expediente para el alumno y matrícula dados.
        $expedienteExistente = Expediente::where('alumno', $validatedData['alumno'])
                                        ->where('matricula', $validatedData['matricula'])
                                        ->first();

        if ($expedienteExistente) {
            $this->expedienteExistente($validatedData, $expedienteExistente);
            return response()->json([
                'message' => 'El expediente para este alumno y matrícula ya existe.',
                'expediente' => $expedienteExistente
            ], 202);
        }

        $tipoexpediente = $request->input('tipoexpediente', 'notas');
        $alumno = User::findOrFail($validatedData['alumno']);
        $periodo = Periodo::find($validatedData['periodo']);
        $matricula = Matricula::find($validatedData['matricula']);

        $curso = Curso::find($matricula->curso);
        $sede = Sede::find($curso->sede);
        $grado = Grado::find($curso->grado);
        $lectivo = Lectivo::find($curso->lectivo);
        $director = User::find($curso->director);

        $cabecera = [
            'nombres' => $alumno->primer_nombre.' '.$alumno->segundo_nombre,
            'apellidos' => $alumno->primer_apellido.' '.$alumno->segundo_apellido,
            'anio' => $lectivo->inicio,
            'grado' => $grado->nombre,
            'curso' => $curso->nombre,
            'promedioGeneral' => 0,
            'sede' => $sede->nombre,
            'director' => $director->primer_nombre.' '.$director->segundo_nombre.' '.$director->primer_apellido
        ];

        $competencia = Competencia::find($validatedData['competencia']);
        $asignacion = Asignacion::find($validatedData['asignacion']);
        $materia = Materia::find($asignacion->materia);
        $docente = User::find($asignacion->docente);
        $area = Area::find($materia->area);

        $detalle = [
            'periodos' => [
                [
                    'periodoId' => $periodo->id,
                    'periodo' => $periodo->nombre,
                    'porcentaje' => $periodo->porcentaje,
                    'promedio' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'areas' => [
                        [
                            'areaId' => $area->id,
                            'area' => $area->nombre,
                            'nota' => $request->input('nota')*($materia->porcentaje/100),
                            'created_at' => now(),
                            'updated_at' => now(),
                            'asignaturas' => [
                                [
                                    'materiaId' => $materia->id,
                                    'materia' => $materia->nombre,
                                    'nota' => $request->input('nota'),
                                    'porcentaje' => $materia->porcentaje,
                                    'docente' => $docente->primer_nombre.' '.$docente->segundo_nombre.' '.$docente->primer_apellido,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                    'competencias' => [
                                        [
                                            'competenciaId' => $competencia->id,
                                            'competencia' => $competencia->detalle,
                                            'nota' => $request->input('nota'),
                                            'created_at' => now(),
                                            'updated_at' => now(),
                                        ]
                                    ]
                                ]
                            ]

                        ]
                    ]
                ]
            ]
        ];

        // Crea el nuevo expediente

        $expediente = new Expediente();
        $expediente->tipoexpediente = $tipoexpediente;
        $expediente->alumno = $validatedData['alumno'];
        $expediente->matricula = $validatedData['matricula'];
        $expediente->cabecera = json_encode($cabecera);

        $detallesActualizados = $this->calcularActualizarNotas($detalle, $periodo->id, $area->id, $materia->id);
        $expediente->detalle = json_encode($detallesActualizados);

        $expediente->save();

        return response()->json(['msg' => 'Expediente Generado'], 201);
    }


    public function show($id)
    {
        $expediente = Expediente::findOrFail($id);
        return response()->json($expediente);
    }

    public function update(Request $request, $id)
    {
        $expediente = Expediente::findOrFail($id);

        $validatedData = $request->validate([
            'tipoexpediente' => 'string|max:255',
            'cabecera' => 'json',
            'detalle' => 'json',
        ]);

        $expediente->update($validatedData);

        return response()->json($expediente);
    }

    public function destroy($id)
    {
        $expediente = Expediente::findOrFail($id);
        $expediente->delete();

        return response()->json(null, 204);
    }

    /**
     * Buscar las competencias utilizadas y registradas en expedientes para la asignacion actual
     */
    public function asignacion($id) {
        $asignacion = Asignacion::find($id);
        $matriculas = Matricula::where('curso', $asignacion->curso)->get();

        $competenciasPorPeriodo = [];

        foreach ($matriculas as $matricula) {
            $expedientes = Expediente::where('matricula', $matricula->id)->get();

            foreach ($expedientes as $expediente) {
                if ($expediente) {
                    $detalle = json_decode($expediente->detalle, true);

                    foreach ($detalle['periodos'] as $periodo) {
                        $periodoId = $periodo['periodoId'];
                        $periodoNombre = $periodo['periodo'];

                        if (!array_key_exists($periodoId, $competenciasPorPeriodo)) {
                            $competenciasPorPeriodo[$periodoId] = [
                                'periodoId' => $periodoId,
                                'periodo' => $periodoNombre,
                                'competencias' => [],
                            ];
                        }

                        foreach ($periodo['areas'] as $area) {
                            foreach ($area['asignaturas'] as $asignatura) {
                                // Solo considera las asignaturas que coincidan con la materia de la asignación
                                if ($asignatura['materiaId'] == $asignacion->materia) {
                                    foreach ($asignatura['competencias'] as $competencia) {
                                        $competenciaId = $competencia['competenciaId'];

                                        // Evita duplicados de competencia
                                        if (!in_array($competenciaId, $competenciasPorPeriodo[$periodoId]['competencias'])) {
                                            $competenciasPorPeriodo[$periodoId]['competencias'][] = $competenciaId;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Convertir la estructura de competenciasPorPeriodo a la lista deseada
        $resultado = array_values($competenciasPorPeriodo);

        return response()->json(['data' => $resultado], 200);
    }

    public function notas($idasignacion, $idperiodo) {

        foreach ($matriculas as $matricula) {
            $expedientes = Expediente::where('matricula', $matricula->id)->get();

            foreach ($expedientes as $expediente) {
                if ($expediente) {
                    $detalle = json_decode($expediente->detalle, true);

                    foreach ($detalle['periodos'] as $periodo) {
                        $periodoId = $periodo['periodoId'];
                        $periodoNombre = $periodo['periodo'];

                        if (!array_key_exists($periodoId, $competenciasPorPeriodo)) {
                            $competenciasPorPeriodo[$periodoId] = [
                                'periodoId' => $periodoId,
                                'periodo' => $periodoNombre,
                                'competencias' => [],
                            ];
                        }

                        foreach ($periodo['areas'] as $area) {
                            foreach ($area['asignaturas'] as $asignatura) {
                                // Solo considera las asignaturas que coincidan con la materia de la asignación
                                if ($asignatura['materiaId'] == $asignacion->materia) {
                                    foreach ($asignatura['competencias'] as $competencia) {
                                        $competenciaId = $competencia['competenciaId'];

                                        // Evita duplicados de competencia
                                        if (!in_array($competenciaId, $competenciasPorPeriodo[$periodoId]['competencias'])) {
                                            $competenciasPorPeriodo[$periodoId]['competencias'][] = $competenciaId;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Convertir la estructura de competenciasPorPeriodo a la lista deseada
        $resultado = array_values($competenciasPorPeriodo);

        return response()->json(['data' => $resultado], 200);
    }


}
