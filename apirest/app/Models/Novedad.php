<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Novedad extends Model
{
    use HasFactory;

    protected $table = 'novedades';

    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'uuid';

    protected $fillable = [
        'nota', 'notaold', 'estado', 'observacion'
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
}
