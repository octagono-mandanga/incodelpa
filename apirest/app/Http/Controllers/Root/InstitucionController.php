<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Institucion;

class InstitucionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $institucion = Institucion::first();
        return response()->json(['data' => $institucion], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, string $id)
    {
        // Validar la entrada
        $validated = $request->validate([
            'tipo' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:instituciones,email,' . $id,
            'dane' => 'required|string|max:255|unique:instituciones,dane,' . $id,
            'url' => 'required|url|max:255',
        ]);

        // Buscar la institución por ID
        $institucion = Institucion::findOrFail($id);

        // Actualizar la institución
        $institucion->update($validated);

        // Retornar la respuesta
        return response()->json(['message' => 'Institución actualizada con éxito', 'data' => $institucion], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
