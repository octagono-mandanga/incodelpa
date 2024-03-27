<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habilitacion extends Model
{
    use HasFactory;
    protected $table = 'habilitacion';

    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'uuid';

    protected $fillable = [
        'registra', 'asignacion', 'matricula', 'nota', 'observacion', 'promover'
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

    // Métodos para definir las relaciones, si son necesarias
    public function usuario()
    {
        return $this->belongsTo(User::class, 'registra');
    }

    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class, 'asignacion');
    }

    public function matricula()
    {
        return $this->belongsTo(Matricula::class, 'matricula');
    }
}
