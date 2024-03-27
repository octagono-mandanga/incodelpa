<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CriterioPromocion extends Model
{
    use HasFactory;

    protected $table = 'criterio_promocion';

    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'uuid';

    protected $fillable = [
        'nombre', 'num_areas', 'num_materias', 'hab_areas', 'hab_materias', 'estado'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = \Str::uuid()->toString();
            }
        });
    }

}

