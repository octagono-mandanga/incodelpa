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

            // Obtiene todos los archivos de backup en el directorio
            $files = Storage::disk('local')->files($backupDirectory);

            // Transforma la lista de archivos para devolver más detalles
            $backups = collect($files)->map(function ($file) {
                return [
                    'name' => basename($file),
                    'url' => route('backup.download', ['file' => basename($file)]),
                    'size' => round(Storage::disk('local')->size($file)/1024), // Asegúrate de pasar la ruta correcta
                    'last_modified' => Storage::disk('local')->lastModified($file) // Usa $file directamente
                ];
            });

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

        $fileContents = Storage::disk('local')->get($filePath);
        $mimeType = Storage::disk('local')->mimeType($filePath);

        return response($fileContents, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $file . '"',
        ]);
    }

}
