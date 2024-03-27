<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escala extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'uuid';

    protected $fillable = [
        'nombre', 'minimo', 'maximo', 'concepto', 'color', 'estado', 'criterio_promocion'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function criterioPromocion()
    {
        return $this->belongsTo(CriterioPromocion::class, 'criterio_promocion');
    }
}
