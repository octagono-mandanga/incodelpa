<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;

class RoleAssignmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function assignRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'role_name' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findByName($request->role_name);

        $user->assignRole($role);

        return response()->json(['message' => 'Role assigned successfully!'], 200);
    }

    public function removeRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'role_name' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->removeRole($request->role_name);

        return response()->json(['message' => 'Role removed successfully!'], 200);
    }

    public function getUserRoles($userId)
    {
        $user = User::findOrFail($userId);
        $roles = $user->getRoleNames(); // Returns a collection

        return response()->json(['roles' => $roles], 200);
    }

    public function getUsersByRole($roleName)
    {
        $role = Role::findByName($roleName);
        $users = $role->users;

        return response()->json(['users' => $users], 200);
    }

    public function getAuthenticatedUserRoles(Request $request)
    {
        // No necesitas el $userId, Sanctum proporciona el usuario autenticado a través de $request->user()
        $user = $request->user(); // Obtén el usuario autenticado
        $roles = $user->getRoleNames(); // Obtiene los nombres de los roles asignados al usuario autenticado

        return response()->json(['roles' => $roles], 200);
    }

    /**
     * Verifica si el usuario autenticado tiene un rol específico.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkUserRole($id)
    {

        // Obtiene el usuario autenticado
        $user = Auth::user();

        // Verifica si el usuario tiene el rol especificado
        $hasRole = $user->hasRole($id);

        // Retorna la respuesta
        return response()->json(['hasRole' => $hasRole], 200);
    }
}
