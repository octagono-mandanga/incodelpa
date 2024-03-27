<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class DocenteRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || !$request->user()->hasRole('docente')) {
            // Retorna una respuesta o redirige según sea necesario
            return response()->json(['message' => 'No autorizado. Acceso restringido al rol docente.'], 403);
        }

        return $next($request);
    }
}
