<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Storage;



class DatabaseBackup extends Command
{
    protected $signature = 'db:backup';

    protected $description = 'Backup the database';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $filename = "mandanga-" . date('Y-m-d') . ".sql";

        // Asegurar que el directorio de backups existe
        $backupDir = storage_path('app/backups');
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $command = ""; // El comando para generar el backup
        //ALTER USER 'root'@'localhost' IDENTIFIED BY 'clibre123';
        //FLUSH PRIVILEGES;

        // Definir el comando según el sistema de gestión de base de datos
        $errorFile = tempnam(sys_get_temp_dir(), 'error');
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s %s > %s 2> %s',
            escapeshellarg(env('DB_USERNAME')),
            escapeshellarg(env('DB_PASSWORD')),
            escapeshellarg(env('DB_HOST')),
            escapeshellarg(env('DB_DATABASE')),
            escapeshellarg(storage_path('app/backups/' . $filename)),
            escapeshellarg($errorFile) // Redirige la salida de error a un archivo temporal
        );
        // Aquí puedes añadir más condiciones para otros sistemas de gestión de bases de datos como PostgreSQL, SQLite, etc.

        $process = Process::fromShellCommandline($command);
        $process->run();

        // PRIMERO verificar si el proceso fue exitoso
        if (!$process->isSuccessful()) {
            $errorOutput = file_get_contents($errorFile);
            $this->error('La copia de seguridad de la base de datos falló. Detalles: ' . $errorOutput);
            unlink($errorFile);
            return 1;
        }

        // Limpiar archivo de error temporal
        unlink($errorFile);

        // Verificar que el archivo SQL fue creado
        $sqlFilePath = storage_path('app/backups/' . $filename);
        if (!file_exists($sqlFilePath)) {
            $this->error('El archivo SQL no fue creado.');
            return 1;
        }

        $zip = new \ZipArchive();
        $zipFilename = storage_path('app/backups/' . basename($filename, '.sql') . '.zip');

        // Crea un archivo ZIP
        if ($zip->open($zipFilename, \ZipArchive::CREATE) === TRUE) {
            // Añade el archivo SQL al ZIP
            $zip->addFile($sqlFilePath, basename($filename));
            // Cierra el archivo ZIP
            $zip->close();

            // Verifica si el archivo ZIP se creó exitosamente
            if (file_exists($zipFilename)) {
                // Elimina el archivo SQL original
                unlink($sqlFilePath);
            } else {
                // Maneja el caso en que la creación del archivo ZIP falló
                Log::error("Error al crear el archivo ZIP.");
                return 1;
            }
        } else {
            // Maneja el caso en que no se pudo abrir el archivo ZIP para su creación
            Log::error("No se pudo abrir el archivo ZIP para su creación.");
            return 1;
        }

        $this->info('La copia de seguridad de la base de datos se realizó correctamente.');

        // Opcional: subir el archivo a un disco, como S3
        // Storage::disk('s3')->put("backups/{$filename}", file_get_contents(storage_path('app/' . $filename)));

        return 0;
    }
}
