<?php

namespace App\Http\Controllers\Secretaria;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Institucion;
use App\Models\Asignacion;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
//Email
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;
use Carbon\Carbon;

class DocenteController extends Controller
{
    //
    public function index()
    {
        // Carga solo los usuarios con el rol 'alumno'
        $seisMesesAtras = now()->subMonths(6);
        $users = User::role('docente', 'api')
        ->orderBy('primer_nombre')
        ->orderBy('segundo_nombre')
        ->orderBy('primer_apellido')
        ->orderBy('segundo_apellido')
        ->limit(10)
        ->get();

        return response()->json(['data' => $users],  200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'primer_apellido' => 'required|string',
            'segundo_apellido' => 'nullable|string',
            'primer_nombre' => 'required|string',
            'segundo_nombre' => 'nullable|string',
            'nid' => 'required|string|unique:users',
            'celular' => 'required|string',
            'tipo_documento' => 'required|exists:tipo_documentos,id',
            'email' => 'required|string|email|unique:users',
            // Removemos 'rol' del validador ya que no será necesario
        ]);
        $numero = rand(10000000, 99999999);
        $numero2 = rand(10000000, 99999999);

        $user = User::create([
            'id' => Str::uuid(),
            'primer_apellido' => $request->primer_apellido,
            'segundo_apellido' => $request->segundo_apellido,
            'primer_nombre' => $request->primer_nombre,
            'segundo_nombre' => $request->segundo_nombre,
            'celular' => $request->celular,
            'nid' => $request->nid,
            'tipo_documento' => $request->tipo_documento,
            'email' => $request->email,
            'password' => bcrypt($numero2),
            'estado' => 'activo',
        ]);

        // Asignamos directamente el rol 'alumno'
         // Asume que 'rol' es el ID del rol en el request
        $role = Role::findByName('docente', 'api');
        $user->assignRole('docente');
        //Mail
        $institucion = Institucion::first();
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $numero,
            'created_at' => Carbon::now()
        ]);
        Mail::to($user->email)->send(new WelcomeEmail($user, $numero, $institucion, $role));
        return response()->json(['message' => 'Usuario creado exitosamente.', 'user' => $user]);
    }

    public function show($id)
    {
        // Incluimos las relaciones al buscar el curso específico
        /*
        $user = User::with(['asignaciones', 'asignaciones.materia', 'asignaciones.curso.grado', 'asignaciones.curso.lectivo.nivel'])
        ->whereHas('asignaciones.curso.lectivo', function ($query) {
            $query->where('estado', 'activo');
        })
        ->where('users.id', $id)
        ->first();
        */
        $user = User::find($id);
        /*
        $data = User::select('users.*')
            ->join('asignaciones', 'asignaciones.docente', '=', 'users.id')
            ->join('cursos', 'asignaciones.curso', '=', 'cursos.id')
            ->join('materias', 'asignaciones.materia', '=', 'materias.id')
            ->join('lectivos', 'cursos.lectivo', '=', 'lectivos.id')
            ->join('niveles', 'lectivos.nivel', '=', 'niveles.id')
            ->where('lectivos.estado', 'activo')
            ->where('users.id', $id)
            ->with(['asignaciones' => function ($query) {
                $query->with(['curso' => function ($query) {
                    $query->orderBy('nombre');
                    $query->with(['lectivo' => function ($query) {
                        $query->with(['nivel' => function ($query) {
                            $query->orderBy('orden');
                        }]);
                    }, 'grado']);
                }, 'materia']);
            }])
            ->first();
        */
        $data = Asignacion::select('asignaciones.*')
        ->join('cursos', 'asignaciones.curso', '=', 'cursos.id')
        ->join('grados', 'cursos.grado', '=', 'grados.id')
        ->join('lectivos', 'cursos.lectivo', '=', 'lectivos.id')
        ->join('niveles', 'lectivos.nivel', '=', 'niveles.id')
        ->join('materias', 'asignaciones.materia', '=', 'materias.id')
        ->where('asignaciones.docente', $id)
        ->where('lectivos.estado', 'activo')
        ->orderBy('niveles.orden')
        ->orderBy('grados.orden')
        ->orderBy('cursos.nombre')
        ->orderBy('materias.nombre')
        ->with(['curso.lectivo.nivel', 'curso.grado', 'materia'])
        ->get();



        if ($user) {
            return response()->json(['user' => $user, 'data' => $data], 200);
        } else {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
    }
    public function update(Request $request, $id)
    {
        // Corregir la validación
        $user = User::find($id);
        $request->validate([
            'primer_apellido' => 'sometimes|string',
            'segundo_apellido' => 'nullable|string',
            'primer_nombre' => 'sometimes|string',
            'segundo_nombre' => 'nullable|string',
            'nid' => 'sometimes|string|unique:users,nid,'. $user->id,
            'tipo_documento' => 'sometimes|exists:tipo_documentos,id', // Cambiado a 'sometimes' para permitir actualizaciones parciales
            'celular' => 'sometimes|string', // Cambiado a 'sometimes' para permitir actualizaciones parciales
            'email' => 'sometimes|string|email|unique:users,email,'. $user->id,
        ]);

        // Actualizar el usuario con los campos validados

        $user->update([
            'primer_apellido' => $request->primer_apellido,
            'segundo_apellido' => $request->segundo_apellido,
            'primer_nombre' => $request->primer_nombre,
            'segundo_nombre' => $request->segundo_nombre,
            'nid' => $request->nid,
            'tipo_documento' => $request->tipo_documento,
            'celular' => $request->celular,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Usuario actualizado exitosamente.', 'user' => $user]);
    }


    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado exitosamente.']);
    }
}
