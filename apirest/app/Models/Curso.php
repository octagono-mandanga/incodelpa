<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Curso extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['nombre', 'estado', 'orden', 'grado', 'sede', 'lectivo', 'coordinador', 'director'];


    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado');
    }

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'sede');
    }

    public function lectivo()
    {
        return $this->belongsTo(Lectivo::class, 'lectivo');
    }

    public function director()
    {
        return $this->belongsTo(User::class, 'director');
    }

    public function coordinador()
    {
        return $this->belongsTo(User::class, 'coordinador');
    }

    // Método para definir la relación con Matricula
    public function matriculas()
    {
        return $this->hasMany(Matricula::class, 'curso');
    }
    // Método para definir la relación con Matricula
    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'curso');
    }
}
