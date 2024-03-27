<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\RoleAssignmentController;
use App\Http\Controllers\Root\UserController;
//use App\Http\Controllers\Root\BackupController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
*/
Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working!'], 200);
});
Route::get('/test/new', function () {
    return response()->json(['message' => 'Test2 route is working!'], 200);
});
//Rutas protegidas
    Route::post('/assign-role', [RoleAssignmentController::class, 'assignRole']);

    // Remover rol de usuario
    Route::post('/remove-role', [RoleAssignmentController::class, 'removeRole']);

    // Obtener roles de un usuario
    Route::get('/user/{userId}/roles', [RoleAssignmentController::class, 'getUserRoles']);

    // Listar usuarios por rol
    Route::get('/role/{roleName}/users', [RoleAssignmentController::class, 'getUsersByRole']);


/**
 * Rutas para autenticación y usuarios no validados
 * */
//

Route::post('/login', [AuthController::class, 'login']);
Route::post('/code',  [App\Http\Controllers\PasswordResetController::class, 'reset']); //Generar una nueva clave
Route::post('/recover',  [App\Http\Controllers\PasswordResetController::class, 'create']); //Generar una nueva clave

//Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->get('/user/roles', [RoleAssignmentController::class, 'getAuthenticatedUserRoles']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::get('/root/backup/download/{file}', [App\Http\Controllers\Root\BackupController::class, 'download'])->name('backup.download');
// Agrupar todas las rutas que estarán bajo el prefijo 'root'
Route::prefix('secretaria')->name('secretaria.')->middleware(['auth:sanctum', 'secretaria'])->group(function () {
    Route::get('/tipo_documentos', [App\Http\Controllers\Secretaria\TipoDocumentoController::class, 'index']);
    Route::apiResource('cursos', App\Http\Controllers\Secretaria\CursoController::class)
        ->names([
            'index' => 'secretaria.cursos.index',
            'show' => 'secretaria.cursos.show',
            // Agrega los demás métodos si es necesario
        ]);
    Route::get('cursos/pa-matricular/{id}', [App\Http\Controllers\Secretaria\CursoController::class, 'paMatricular']);
    Route::post('alumnos/add', [App\Http\Controllers\Secretaria\AlumnoController::class, 'add']);
    Route::get('alumnos/nuevos', [App\Http\Controllers\Secretaria\AlumnoController::class, 'nuevos']);
    Route::apiResource('alumnos', App\Http\Controllers\Secretaria\AlumnoController::class);
    Route::get('/asignaciones/curso/{id}', [App\Http\Controllers\Secretaria\AsignacionController::class, 'asignaciones']);

    Route::get('/alumnos/search/{term}', [App\Http\Controllers\Secretaria\AlumnoController::class, 'search']);

    Route::apiResource('docentes', App\Http\Controllers\Secretaria\DocenteController::class);

    Route::apiResource('matricula', App\Http\Controllers\Secretaria\MatriculaController::class);
    Route::get('/matriculas/curso/{id}', [App\Http\Controllers\Secretaria\MatriculaController::class, 'curso']);

    Route::get('/auth', [App\Http\Controllers\AuthController::class, 'auth']);
    Route::put('/auth/update', [App\Http\Controllers\AuthController::class, 'update']);
});
Route::prefix('coordinacion')->name('coordinacion.')->middleware(['auth:sanctum', 'coordinacion'])->group(function () {
    Route::apiResource('lectivos', App\Http\Controllers\Coordinacion\LectivoController::class);
    Route::apiResource('sedes', App\Http\Controllers\Coordinacion\SedeController::class);
    Route::apiResource('grados', App\Http\Controllers\Coordinacion\GradoController::class);
    Route::get('/matriculas/curso/{id}', [App\Http\Controllers\Coordinacion\MatriculaController::class, 'curso']);
    Route::apiResource('cursos', App\Http\Controllers\Coordinacion\CursoController::class);
    Route::apiResource('alumnos', App\Http\Controllers\Coordinacion\AlumnoController::class);
    Route::post('alumnos/avatar/{id}', [App\Http\Controllers\Coordinacion\AlumnoController::class, 'setAvatar']);
    Route::apiResource('docentes', App\Http\Controllers\Coordinacion\DocenteController::class);
    Route::get('/grados/nivel/{id}', [App\Http\Controllers\Coordinacion\GradoController::class, 'nivel']);
    Route::get('/tipo_documentos', [App\Http\Controllers\Coordinacion\TipoDocumentoController::class, 'index']);
    Route::apiResource('materias', App\Http\Controllers\Coordinacion\MateriaController::class);
    Route::apiResource('asignaciones', App\Http\Controllers\Coordinacion\AsignacionController::class);
    Route::get('/asignaciones/curso/{id}', [App\Http\Controllers\Coordinacion\AsignacionController::class, 'asignaciones']);
    Route::get('/asignaciones/libres/{id}', [App\Http\Controllers\Coordinacion\AsignacionController::class, 'libres']);

    Route::get('/auth', [App\Http\Controllers\AuthController::class, 'auth']);
    Route::put('/auth/update', [App\Http\Controllers\AuthController::class, 'update']);
});
Route::prefix('docente')->name('docente.')->middleware(['auth:sanctum', 'docente'])->group(function () {
    Route::get('/auth', [App\Http\Controllers\AuthController::class, 'auth']);
    Route::put('/auth/update', [App\Http\Controllers\AuthController::class, 'update']);
    Route::apiResource('asignaciones', App\Http\Controllers\Docente\AsignacionController::class);
    Route::get('/asignaciones/periodoactivo/{id}', [App\Http\Controllers\Docente\AsignacionController::class, 'periodoActivo']);
    Route::get('/asignaciones/competencias/{id}', [App\Http\Controllers\Docente\AsignacionController::class, 'competencias']);
    Route::apiResource('periodos', App\Http\Controllers\Docente\PeriodoController::class);
    Route::apiResource('matriculas', App\Http\Controllers\Docente\MatriculaController::class);

    Route::get('/escalas/{id}', [App\Http\Controllers\Docente\EscalaController::class, 'show']);
    Route::get('/notas/competencias/{id}', [App\Http\Controllers\Docente\NotaCompetenciaController::class, 'competencias']);
    Route::get('/notas/asignacion/{id}', [App\Http\Controllers\Docente\NotaCompetenciaController::class, 'asignacion']);
    Route::get('/notas/notas-asignacion/{id}', [App\Http\Controllers\Docente\NotaCompetenciaController::class, 'notasAsignacion']);
    Route::get('/notas/notas-asignacion2/{id}', [App\Http\Controllers\Docente\NotaCompetenciaController::class, 'notasAsignacion2']);
    Route::apiResource('notas', App\Http\Controllers\Docente\NotaCompetenciaController::class);
    Route::post('notas/full', [App\Http\Controllers\Docente\NotaCompetenciaController::class, 'fullstore']);
    //Route::get('/expedientes/asignacion/{id}', [App\Http\Controllers\Docente\ExpedienteController::class, 'asignacion']);
    Route::apiResource('materias', App\Http\Controllers\Docente\MateriaController::class);
    Route::get('/tipocompetencias', [App\Http\Controllers\Docente\TipoCompetenciaController::class, 'index']);
    Route::apiResource('competencias', App\Http\Controllers\Docente\CompetenciaController::class);
    Route::get('/tipo_documentos', [App\Http\Controllers\Docente\TipoDocumentoController::class, 'index']);
    //Route::get('/expedientes/notas/{idasignacion}/{idperiodo}', [App\Http\Controllers\Docente\ExpedienteController::class, 'notas']);
});
Route::prefix('root')->name('root.')->middleware(['auth:sanctum', 'root'])->group(function () {
    // Ruta ejemplo para la gestión de usuarios dentro del directorio 'Root'
    Route::get('/backup', [App\Http\Controllers\Root\BackupController::class, 'index']);

    Route::get('/backup/listar', [App\Http\Controllers\Root\BackupController::class, 'listar']);

    Route::apiResource('institucion', App\Http\Controllers\Root\InstitucionController::class);
    Route::apiResource('sedes', App\Http\Controllers\Root\SedeController::class);

    // Verificar el rol
    Route::get('/checking-role/{id}', [RoleAssignmentController::class, 'checkUserRole']);

    //Usuario y rol
    Route::apiResource('/usuarios', App\Http\Controllers\Root\UserController::class);
    Route::post('/usuarios/{user}/add-role/{role}', [UserController::class, 'addRole']);
    Route::delete('/usuarios/{user}/remove-role/{role}', [UserController::class, 'removeRole']);



    Route::apiResource('tipo_documentos', App\Http\Controllers\Root\TipoDocumentoController::class);






    Route::apiResource('roles', App\Http\Controllers\Root\RoleController::class);
    Route::apiResource('niveles', App\Http\Controllers\Root\NivelController::class);
    Route::apiResource('grados', App\Http\Controllers\Root\GradoController::class);
    Route::apiResource('areas', App\Http\Controllers\Root\AreaController::class);
    Route::apiResource('materias', App\Http\Controllers\Root\MateriaController::class);
    Route::apiResource('lectivos', App\Http\Controllers\Root\LectivoController::class);
    Route::apiResource('periodos', App\Http\Controllers\Root\PeriodoController::class);

    // Puedes agregar más rutas necesarias para el rol 'root' aquí
});
