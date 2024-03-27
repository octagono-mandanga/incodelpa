<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Competencia extends Model
{
    use HasFactory;
    //use HasFactory, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['materia', 'tipo', 'detalle', 'orden', 'estado'];

    // Si estás usando Laravel 7 o superior, asegúrate de que el UUID se genere automáticamente:
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) \Str::uuid();
            }
        });
    }

    /**
     * Define la relación donde una competencia pertenece a una materia.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia');
    }

    public function tipo()
    {
        return $this->belongsTo(TipoCompetencia::class, 'tipo');
    }
}
