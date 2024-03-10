<?php

namespace App\Http\Controllers\Root;

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

class UserController extends Controller
{
    //
    public function index()
    {
        $users = User::with('roles')->get(); // Carga los usuarios y sus roles
        return response()->json($users);
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
            'rol' => 'required|exists:roles,id', // Asegúrate de validar el ID del rol
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
            'estado' => 'registrado',
        ]);

        $rolId = $request->rol; // Asume que 'rol' es el ID del rol en el request
        $role = Role::findById($rolId); // Usa findById cuando buscas por ID
        $user->assignRole($role);
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

    public function update(Request $request, User $user)
    {
        $request->validate([
            'apellidos' => 'sometimes|string',
            'nombres' => 'sometimes|string',
            'numero_documento' => 'sometimes|string|unique:users,numero_documento,' . $user->id,
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            // No actualizamos el password aquí
        ]);

        $user->update($request->only(['apellidos', 'nombres', 'numero_documento', 'email']));

        return response()->json(['message' => 'Usuario actualizado exitosamente.', 'user' => $user]);
    }

    public function addRole(User $user, $roleName)
    {
        $role = Role::findByName($roleName);
        $user->assignRole($role);

        return response()->json(['message' => 'Rol asignado exitosamente.']);
    }

    public function removeRole(User $user, $roleName)
    {
        $user->removeRole($roleName);

        return response()->json(['message' => 'Rol removido exitosamente.']);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado exitosamente.']);
    }
}
