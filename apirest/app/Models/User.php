<?php

/**
 * Clase que representa a un usuario del sistema.
 * @author Ing. Gonzalo Lucio 
 */
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    use SoftDeletes;
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'primer_apellido',
        'segundo_apellido',
        'primer_nombre',
        'segundo_nombre',
        'nid',
        'celular',
        'tipo_documento',
        'email',
        'password',
        'estado',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Accesor para "avatar_url".
     */
    protected $appends = ['avatar_url'];
    public function getAvatarUrlAttribute()
    {
        $avatarPath = "avatars/{$this->id}.png";

        if (Storage::disk('public')->exists($avatarPath)) {
            return Storage::disk('public')->url($avatarPath);
        }

        return asset('storage/avatars/avatar.png');
    }

    public function matriculas()
    {
        return $this->hasMany(Matricula::class, 'alumno')->orderBy('created_at', 'desc');
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'docente')->orderBy('created_at', 'desc');
    }
    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'id');
    }
}
