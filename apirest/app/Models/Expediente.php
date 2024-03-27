<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expediente extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tipoexpediente',
        'alumno',
        'matricula',
        'cabecera',
        'detalle'
    ];

    protected $casts = [
        'cabecera' => 'array',
        'detalle' => 'array'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'alumno', 'id');
    }

    public function matriculaRelacionada()
    {
        return $this->belongsTo(Matricula::class, 'matricula', 'id');
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($expediente) {
            $expediente->{$expediente->getKeyName()} = (string) \Str::uuid();
        });
    }
}
