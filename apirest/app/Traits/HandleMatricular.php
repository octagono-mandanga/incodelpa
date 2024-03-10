<?php
namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait HandleMatricular
{
    public function traitMatricular($alumno, $curso)
    {
        // Supongamos que esto es una simplificación de lo que realmente harías:
        $matricula = new \App\Models\Matricula([
            'alumno' => $alumno->id,
            'curso' => $curso->id,
            'matriculador' => Auth::id(), // Usuario autenticado como matriculador
            'estado' => 'activo'
        ]);
        $matricula->save();

        // Más lógica si es necesario
        return $matricula; // O lo que sea relevante retornar
    }
}
