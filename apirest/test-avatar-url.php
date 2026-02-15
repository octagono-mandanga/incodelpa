#!/usr/bin/env php
<?php

use Illuminate\Support\Facades\Storage;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Probando URLs de Storage:\n";
echo "=========================\n\n";

// Probar URL del disco public
$url = Storage::disk('public')->url('avatars/avatar.png');
echo "URL generada por Storage::disk('public')->url('avatars/avatar.png'):\n";
echo $url . "\n\n";

// Verificar si el archivo existe
$exists = Storage::disk('public')->exists('avatars/avatar.png');
echo "¿Existe 'avatars/avatar.png' en storage/app/public/? " . ($exists ? 'SÍ' : 'NO') . "\n\n";

// Verificar APP_URL
echo "APP_URL configurado: " . env('APP_URL') . "\n\n";

// Ruta física del archivo
$path = Storage::disk('public')->path('avatars/avatar.png');
echo "Ruta física del archivo:\n";
echo $path . "\n\n";

// Verificar si el archivo existe físicamente
echo "¿Existe físicamente? " . (file_exists($path) ? 'SÍ' : 'NO') . "\n";
