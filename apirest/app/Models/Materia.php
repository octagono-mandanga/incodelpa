<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Materia extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['nombre', 'ih', 'estado', 'grado', 'area', 'porcentaje'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }


    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area');
    }

    /**
     * Obtén las asignaciones asociadas a la materia.
     */
    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'materia');
    }
}
