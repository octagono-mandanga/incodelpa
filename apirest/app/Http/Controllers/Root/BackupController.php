<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use App\Jobs\DatabaseBackupJob;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{

    /**
     * RUNNER COPIAS: php artisan queue:work
     */
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        try {

            // Ejecutar el comando de Artisan para hacer el backup
            DatabaseBackupJob::dispatch();

            return response()->json(['message' => 'Backup iniciado con éxito. Se está ejecutando en segundo plano.'], 200);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al realizar el backup: '.$e->getMessage()], 500);
        }
    }

    public function listar()
    {
        try {
            // Define el directorio donde se almacenan los backups
            $backupDirectory = 'backups'; // Ubicación correcta asumiendo la base en storage/app

            // Asegurar que el directorio existe
            if (!Storage::disk('local')->exists($backupDirectory)) {
                Storage::disk('local')->makeDirectory($backupDirectory);
            }

            // Obtiene todos los archivos de backup en el directorio
            $files = Storage::disk('local')->files($backupDirectory);

            // Filtra solo archivos .zip y transforma la lista
            $backups = collect($files)
                ->filter(function ($file) {
                    return pathinfo($file, PATHINFO_EXTENSION) === 'zip';
                })
                ->map(function ($file) {
                    return [
                        'name' => basename($file),
                        'size' => round(Storage::disk('local')->size($file)/1024),
                        'last_modified' => Storage::disk('local')->lastModified($file)
                    ];
                })
                ->sortByDesc('last_modified')
                ->values();

            return response()->json(['backups' => $backups], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los backups: ' . $e->getMessage()], 500);
        }
    }
    //** ESTO PARA MANEEJAR LA DESCARGA DE ARCHIVOS GENERADOS */
    public function download($file)
    {
        $filePath = 'backups/' . $file;

        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'Archivo no encontrado.'], 404);
        }

        $fullPath = Storage::disk('local')->path($filePath);

        return response()->download($fullPath, $file, [
            'Content-Type' => 'application/zip',
        ]);
    }

}
