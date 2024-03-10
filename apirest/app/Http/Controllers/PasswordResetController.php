<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Institucion;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Illuminate\Support\Facades\Mail;
use App\Mail\RecoverEmail;

class PasswordResetController extends Controller
{
    public function create(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $numero = rand(10000000, 99999999);
        $email = $request->email;


        $user = User::where('email', $email)->first();
        if ($user) {
            $institucion = Institucion::first();
            DB::table('password_reset_tokens')->where('email', '=', $email)->delete();

            DB::table('password_reset_tokens')->insert([
                'email' => $email,
                'token' => $numero,
                'created_at' => Carbon::now()
            ]);
            Mail::to($user->email)->send(new RecoverEmail($user, $numero, $institucion));
            return response()->json(['message' => 'Hemos enviado por correo electrónico el enlace de restablecimiento de contraseña!'], 200);
        } else {
            // Considera manejar el caso de que el usuario no se encuentre, aunque la validación debería prevenir esto
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'password' => 'required|min:8',
        ]);

        $reset = DB::table('password_reset_tokens')->where([
            'token' => $request->code,
            'email' => $request->email
        ])->first();

        if (!$reset) {
            return response()->json(['message' => 'Este token de restablecimiento de contraseña no es válido.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Actualiza el estado del usuario aquí si es necesario
        $user->estado = 'activo'; // Cambia esto según tu lógica de negocio
        $user->save();

        // Eliminar el token de restablecimiento de contraseña
        DB::table('password_reset_tokens')->where(['email' => $request->email])->delete();

        return response()->json(['message' => 'Tu contraseña ha sido cambiada!'], 200);
    }
}
