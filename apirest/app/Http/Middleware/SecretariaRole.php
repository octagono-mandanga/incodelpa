<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class SecretariaRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || !$request->user()->hasRole('secretaria')) {
            // Retorna una respuesta o redirige según sea necesario
            return response()->json(['message' => 'No autorizado. Acceso restringido al rol secretaria.'], 403);
        }

        return $next($request);
    }
}
