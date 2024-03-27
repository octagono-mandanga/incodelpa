<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';

    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'uuid';

    protected $fillable = ['regclases', 'alumno', 'observacion'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function regclase()
    {
        return $this->belongsTo(Regclase::class, 'regclases');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'alumno');
    }
}
