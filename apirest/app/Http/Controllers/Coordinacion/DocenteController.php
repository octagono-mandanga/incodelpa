<?php

namespace App\Http\Controllers\Coordinacion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Institucion;
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
        $users = User::role('docente', 'api')->with('roles')->orderBy('primer_nombre')->orderBy('segundo_nombre')->orderBy('primer_apellido')->get();
        return response()->json($users);
    }


    public function store(Request $request)
    {
        $request->validate([
            'primer_apellido' => 'required|string',
            'segundo_apellido' => 'nullable|string',
            'primer_nombre' => 'required|string',
            'segundo_nombre' => 'nullable|string',
            'nid' => 'required|string',
            'celular' => 'required|string',
            'tipo_documento' => 'required|exists:tipo_documentos,id',
            'email' => 'required|string|email',
            // Removemos 'rol' del validador ya que no será necesario
        ]);
        $numero = rand(10000000, 99999999);
        $numero2 = rand(10000000, 99999999);
        $user = User::where('nid', $request->nid)->first();

        if (!$user) {
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
                'password' => bcrypt($request->nid),
                'estado' => 'activo',
            ]);
            DB::table('password_reset_tokens')->insert([
                'email' => $request->email,
                'token' => $numero,
                'created_at' => Carbon::now()
            ]);
        }


        if (!$user->hasRole('docente')) {
            $role = Role::findByName('docente', 'api');
            $user->assignRole($role);
            //Mail
            $institucion = Institucion::first();

            Mail::to($user->email)->send(new WelcomeEmail($user, $request->nid, $institucion, $role));
        }
        return response()->json(['message' => 'Usuario creado exitosamente.', 'user' => $user]);
    }

    public function show($id)
    {
        // Incluimos las relaciones al buscar el curso específico
        $user = User::find($id);
        if ($user) {
            return response()->json(['data' => $user], 200);
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
