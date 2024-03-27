<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Matricula extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['curso', 'alumno', 'matriculador', 'estado', 'condicion', 'observaciones'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    // Relaciones
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso');
    }

    public function alumno_r()
    {
        return $this->belongsTo(User::class, 'alumno');
    }
    public function alumno()
    {
        return $this->belongsTo(User::class, 'alumno');
    }

    public function matriculador()
    {
        return $this->belongsTo(User::class, 'matriculador');
    }
}
