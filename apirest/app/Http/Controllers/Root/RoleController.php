<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'sanctum' ]);

        if ($request->has('permissions')) {
            $role->givePermissionTo($request->permissions);
        }
        return response()->json(['message' => 'Rol creado con éxito', 'data' => $role], 201);
    }

    public function show($id)
    {
        $role = Role::with('permissions')->find($id);
        return response()->json(['data' => $role], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id
        ]);
        $role = Role::findOrFail($id);
        $role->update($validated);

        return response()->json(['message' => 'Rol actualizado con éxito', 'data' => $role], 200);
    }

    public function destroy($id)
    {

        //$role = Role::findOrFail($id);
        //$role->delete();
       // dd($role);
        //Role::destroy($id);
        //return response()->json(['message' => 'Rol Eliminado'], 200);
    }
}
