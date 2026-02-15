<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('mandanga')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 200);

    }

    public function logout(Request $request)
    {
        //Auth::logout();

        $request->user()->tokens()->delete();
        // Crear una respuesta
        $response = response()->json(['message' => 'Logged out successfully'], 200);

        return $response;
    }
    public function auth()
    {
        $user = Auth::user();
        // Cargar la relación de roles.
        $user->load('roles');
        return response()->json(['data' => $user], 200);
    }
    public function update(Request $request)
    {
        $user = Auth::user();
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

        return response()->json(['message' => 'Usuario actualizado exitosamente.', 'data' => $user], 201);



    }
}
