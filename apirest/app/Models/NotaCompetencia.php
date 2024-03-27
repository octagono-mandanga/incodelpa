<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotaCompetencia extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'nota_competencia';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'asignacion', 'matricula', 'competencia', 'periodo', 'nota'
    ];


    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->{$model->getKeyName()} = (string) \Str::uuid();
        });
    }

    public function matricula_r()
    {
        return $this->belongsTo(Matricula::class, 'matricula');
    }

    public function matricula()
    {
        return $this->belongsTo(Matricula::class, 'matricula');
    }
    public function periodo()
    {
        return $this->belongsTo(Periodo::class, 'periodo');
    }
}
