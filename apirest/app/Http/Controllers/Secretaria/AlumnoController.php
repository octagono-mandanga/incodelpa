<?php

namespace App\Http\Controllers\Secretaria;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Curso;
use App\Models\Institucion;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
//Email
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;
use App\Mail\NotificacionCambiosUsuario;
use Carbon\Carbon;
use App\Traits\HandleMatricular;

class AlumnoController extends Controller
{
    use HandleMatricular;
    //
    public function index()
    {
        // Carga solo los usuarios con el rol 'alumno'
        $users = User::role('alumno')->with('roles')->get();
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
            'curso' => 'required|uuid|exists:cursos,id',

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
            'created_at' => Carbon::now()
        ]);

        $curso = Curso::find($request->curso);

        // Usar el método del trait para matricular al estudiante
        $role = Role::findByName('alumno', 'api');
        // Asignamos directamente el rol 'alumno'
        $user->assignRole($role);
        //Mail
        $institucion = Institucion::first();
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $numero,
            'created_at' => Carbon::now()
        ]);
        $matricula = $this->traitMatricular($user, $curso);

        return response()->json(['message' => 'Usuario creado exitosamente.', 'user' => $user]);
    }

    public function add(Request $request)
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
            'created_at' => Carbon::now()
        ]);


        // Asignamos directamente el rol 'alumno'
        $role = Role::findByName('alumno', 'api');
        $user->assignRole($role);
        //Mail
        $institucion = Institucion::first();
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $numero,
            'created_at' => Carbon::now()
        ]);

        return response()->json(['message' => 'Usuario creado exitosamente.', 'user' => $user]);
    }

    public function show($id)
    {
        // Incluimos las relaciones al buscar el curso específico
        $user = User::with('matriculas.curso.grado')->with('matriculas.curso.director')->with('matriculas.curso.asignaciones.materia')->with('matriculas.curso.asignaciones.docente')->find($id);
        if ($user) {
            return response()->json(['data' => $user], 200);
        } else {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
    }


    public function nuevos(){
        // Carga solo los usuarios con el rol 'alumno'
        $seisMesesAtras = now()->subMonths(6);

        $users = User::role('alumno', 'api') // Usuarios con el rol 'alumno'
            ->whereDoesntHave('matriculas') // Que no tengan matrículas
            ->where('created_at', '>=', $seisMesesAtras) // Creados en los últimos 6 meses
            ->with('roles') // Carga la relación roles
            ->orderBy('primer_apellido')
            ->orderBy('segundo_apellido')
            ->orderBy('primer_nombre')
            ->orderBy('segundo_nombre')
            ->limit(10)
            ->get();

        return response()->json(['data' => $users],  200);
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
        $institucion = Institucion::first();
        Mail::to($user->email)->send(new NotificacionCambiosUsuario($user, $institucion));

        return response()->json(['message' => 'Usuario actualizado exitosamente.', 'user' => $user]);
    }


    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado exitosamente.']);
    }

    public function getAvatar($userId)
    {
        $filename = $userId . '.png'; // Asumiendo que guardas todos los avatares como PNG
        $path = 'avatars/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            return response()->json(['url' => Storage::disk('public')->url($path)]);
        }

        // Devuelve la URL de un avatar genérico si no existe el específico
        return response()->json(['url' => asset('path/to/default/avatar.png')]);
    }

    public function setAvatar(Request $request, $id)
    {
        // Asegúrate de que la petición tiene un archivo
        if ($request->hasFile('image')) {
            $file = $request->file('image');

            // Validar el archivo (opcional, pero recomendado)
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Usar el ID del usuario como el nombre del archivo y obtener la extensión original del archivo
            $fileName = $id . '.' . $file->getClientOriginalExtension();

            // Guardar el archivo en el disco deseado, por ejemplo 'public', dentro de una carpeta 'avatars'
            $filePath = $file->storeAs('avatars', $fileName, 'public');

            // Como no necesitas actualizar la base de datos, simplemente puedes retornar una respuesta exitosa
            return response()->json(['success' => 'Avatar actualizado correctamente.', 'path' => $filePath]);
        } else {
            return response()->json(['error' => 'No se recibió ninguna imagen.'], 400);
        }
    }

    public function search(Request $request)
    {
        $searchTerm = $request->term;

        $users = User::role('alumno', 'api')
                    ->where(function ($query) use ($searchTerm) {
                        $query->where('primer_nombre', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('segundo_nombre', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('primer_apellido', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('segundo_apellido', 'LIKE', "%{$searchTerm}%")
                            ->orWhere(DB::raw("CONCAT(primer_apellido, ' ', segundo_apellido, ' ', primer_nombre, ' ', segundo_nombre)"), 'LIKE', "%{$searchTerm}%")
                            ->orWhere(DB::raw("CONCAT(primer_nombre, ' ', segundo_nombre, ' ', primer_apellido, ' ', segundo_apellido)"), 'LIKE', "%{$searchTerm}%");
                    })
                    //->with('roles') // Opcional: incluye roles en la respuesta si es necesario
                    ->get();

        return response()->json(['data' => $users], 200);
    }

}
