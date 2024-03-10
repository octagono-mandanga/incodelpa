<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Asignacion extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['curso', 'materia', 'docente', 'estado'];
    protected $table = 'asignaciones';
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso');
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia');
    }

    public function docente()
    {
        return $this->belongsTo(User::class, 'docente');
    }
}
