<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promover extends Model
{
    use HasFactory;
    protected $table = 'promover';

    public $incrementing = false;
    protected $keyType = 'uuid';
    protected $fillable = ['id', 'matricula', 'coordinador', 'observacion'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function matricula()
    {
        return $this->belongsTo(Matricula::class, 'matricula');
    }

    public function coordinador()
    {
        return $this->belongsTo(User::class, 'coordinador');
    }


}

