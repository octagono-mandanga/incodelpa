<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['id', 'codigo', 'data', 'estado'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public static function generarCodigo(): string
    {
        $year = now()->year; // Año actual
        $prefix = $year; // Los primeros cuatro dígitos del código serán el año actual
        $ultimoAlumno = self::where('codigo', 'like', "{$year}%")
                            ->orderBy('codigo', 'desc')
                            ->first();

        if ($ultimoAlumno) {
            // Si encuentra un registro, extrae los últimos 4 dígitos, los convierte a número y les suma 1
            $ultimoCodigo = intval(substr($ultimoAlumno->codigo, -4)) + 1;
            // Formatea el nuevo código manteniendo los ceros a la izquierda
            $nuevoCodigo = $prefix . str_pad($ultimoCodigo, 4, '0', STR_PAD_LEFT);
        } else {
            // Si no encuentra registros para el año actual, comienza con '0001'
            $nuevoCodigo = $prefix . '0001';
        }

        return $nuevoCodigo;
    }

}
