<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Models\TipoDocumento;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $cedula = TipoDocumento::where('nombre', 'Cédula de Ciudadanía')->first();

        //ROOT
        $user1 = User::create([
            'primer_apellido' => 'Lucio',
            'segundo_apellido' => 'Lopez',
            'primer_nombre' => 'Gonzalo',
            'segundo_nombre' => 'Andres',
            'nid' => '94488853',
            'tipo_documento' => $cedula->id,
            'celular' => '3165337662',
            'email' => 'gonzaloandreslucio@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('clibre94'),
        ]);
        $role = Role::findByName('root', 'api');
        //$role = Role::where('name', 'root')->first();
        $user1->assignRole($role);

        //RECTORIA
        $user2 = User::create([
            'primer_apellido' => 'Buenaventura',
            'primer_nombre' => 'Engelberto',
            'nid' => '16280210',
            'tipo_documento' => $cedula->id,
            'celular' => '3176984078',
            'email' => 'ebuenaventura@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('16280210'),
        ]);
        $role = Role::findByName('rectoria', 'api');
        //$role = Role::where('name', 'rectoria')->first();
        $user2->assignRole($role);

        //COORDINACION

        $user3 = User::create([
            'primer_apellido' => 'Buenaventura',
            'segundo_apellido' => 'Rivas',
            'primer_nombre' => 'Andres',
            'nid' => '16945515',
            'tipo_documento' => $cedula->id,
            'celular' => '3104329156',
            'email' => 'carlosandresbun@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('16945515'),
        ]);
        $role = Role::findByName('coordinacion', 'api');
        //$role = Role::where('name', 'coordinacion')->first();
        $user3->assignRole($role);

        $user4 = User::create([
            'primer_apellido' => 'Sánchez',
            'segundo_apellido' => 'Riascos',
            'primer_nombre' => 'Claudia',
            'segundo_nombre' => 'Patricia',
            'nid' => '66746616',
            'tipo_documento' => $cedula->id,
            'celular' => '3188547426',
            'email' => 'claupas01@msn.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('66746616'),
        ]);
        $role = Role::findByName('secretaria', 'api');
        //$role = Role::where('name', 'secretaria')->first();
        $user4->assignRole($role);


        $docentes = [
            ["email" => "lic.meryrocio@gmail.com", "primer_apellido" => "Anchico", "segundo_apellido" => "Hurtado", "primer_nombre" => "Mery", "segundo_nombre" => "Rocio", "celular" => "1111811056"],
            ["email" => "beatrizlizethmoreno2014@gmail.com", "primer_apellido" => "Moreno", "segundo_apellido" => "Renjifo", "primer_nombre" => "Beatriz", "segundo_nombre" => "Lizeth", "celular" => "1114729347"],
            ["email" => "jhasmarycampaz@gmail.com", "primer_apellido" => "Campaz", "segundo_apellido" => "Viveros", "primer_nombre" => "Jhas", "segundo_nombre" => "Mary", "celular" => "29229811"],
            ["email" => "lizariana150630@gmail.com", "primer_apellido" => "MANYOMA", "segundo_apellido" => "BONILLA", "primer_nombre" => "YINA", "segundo_nombre" => "LICCETT", "celular" => "1111809997"],
            ["email" => "anamilenacaicedoruiz@gmail.com", "primer_apellido" => "CAICEDO", "segundo_apellido" => "RUIZ", "primer_nombre" => "ANa", "segundo_nombre" => "MILENA", "celular" => "1006190125"],
            ["email" => "castrogarces20@gmail.com", "primer_apellido" => "Castro", "segundo_apellido" => "Garcés", "primer_nombre" => "Cindi", "segundo_nombre" => "Yoana", "celular" => "1148951473"],
            ["email" => "smillan1495@gmail.com", "primer_apellido" => "Millan", "segundo_apellido" => "Quiñones", "primer_nombre" => "Stiven", "segundo_nombre" => "", "celular" => "1151196879"],
            ["email" => "gamboalivia5@gmail.com", "primer_apellido" => "Candelo", "segundo_apellido" => "Gamboa", "primer_nombre" => "Livia", "segundo_nombre" => "Livia", "celular" => "1111771506"],
            ["email" => "kikestupy27@gmail.com", "primer_apellido" => "ESTUPIÑAN", "segundo_apellido" => "ESTUPIÑAN", "primer_nombre" => "HÉCTOR", "segundo_nombre" => "ENRIQUE", "celular" => "16492503"],
            ["email" => "yeisdersmurillo@gmail.com", "primer_apellido" => "Murillo", "segundo_apellido" => "Moreno", "primer_nombre" => "Yeisders", "segundo_nombre" => "David", "celular" => "11935143333"],
            ["email" => "marimbombocuno@gmail.com", "primer_apellido" => "Torres", "segundo_apellido" => "Quiñones", "primer_nombre" => "Washington", "segundo_nombre" => "Stiven", "celular" => "14479864"],
            ["email" => "msga0198@gmail.com", "primer_apellido" => "Granja", "segundo_apellido" => "Alomia", "primer_nombre" => "Marlong", "segundo_nombre" => "Steven", "celular" => "1111816172"],
            ["email" => "soryandrea08@gmail.com", "primer_apellido" => "Saavedra", "segundo_apellido" => "Rodríguez", "primer_nombre" => "Sory", "segundo_nombre" => "Andrea", "celular" => "1193575540"],
            ["email" => "yasminbuenaventura251@gmail.com", "primer_apellido" => "Buenaventura", "segundo_apellido" => "Rivas", "primer_nombre" => "Yasmin", "segundo_nombre" => "", "celular" => "66747174"],
            ["email" => "illanglorika@gmail.com", "primer_apellido" => "Rivas", "segundo_apellido" => "Campaz", "primer_nombre" => "Gloria", "segundo_nombre" => "", "celular" => "66749915"],
            ["email" => "deah9516@gmail.com", "primer_apellido" => "Ante", "segundo_apellido" => "Hurtado", "primer_nombre" => "Daniel", "segundo_nombre" => "Enrique", "celular" => "1144084720"],
            ["email" => "harolsalcedo56@gmail.com", "primer_apellido" => "Salcedo", "segundo_apellido" => "Candelo", "primer_nombre" => "Harold", "segundo_nombre" => "Enrique", "celular" => "16495434"],
            ["email" => "einerasprilla23@gmail.com", "primer_apellido" => "Asprilla", "segundo_apellido" => "Cordoba", "primer_nombre" => "Einer", "segundo_nombre" => "Alfredo", "celular" => "1111803037"],
            ["email" => "ingridsantiesteban18@gmail.com", "primer_apellido" => "Santiesteban", "segundo_apellido" => "Caicedo", "primer_nombre" => "Ingrid", "segundo_nombre" => "", "celular" => "1111739335"],
            ["email" => "carolinaibarguen20@gmail.com", "primer_apellido" => "Ibarguen", "segundo_apellido" => "Micolta", "primer_nombre" => "Carolina", "segundo_nombre" => "", "celular" => "1193540209"],
            ["email" => "marcerifran@gmail.com", "primer_apellido" => "Rivera", "segundo_apellido" => "Franco", "primer_nombre" => "Martha", "segundo_nombre" => "Cecilia", "celular" => "31588353"],
            ["email" => "guillermoaviveros5@gmail.com", "primer_apellido" => "Angulo", "segundo_apellido" => "Viveros", "primer_nombre" => "Guillermo", "segundo_nombre" => "", "celular" => "16487770"],
            ["email" => "hyjsara@gmail.com", "primer_apellido" => "Sánchez", "segundo_apellido" => "Ramos", "primer_nombre" => "Heyby", "segundo_nombre" => "Johanna", "celular" => "31588693"],
            ["email" => "jhanarroyo08@gmail.com", "primer_apellido" => "Arroyo", "segundo_apellido" => "Pérez", "primer_nombre" => "Marloby", "segundo_nombre" => "Janeth", "celular" => "1111752148"],
        ];
        $role = Role::findByName('docente', 'api');
        //$role = Role::where('name', 'docente')->first();
        foreach ($docentes as $docente) {
            if($docente['segundo_nombre'])
                $sn = ucfirst(strtolower($docente['segundo_nombre']));
            else
                $sn = NULL;

            $profe = User::create([
                'primer_apellido' => ucfirst(strtolower($docente['primer_apellido'])),
                'segundo_apellido' => ucfirst(strtolower($docente['segundo_apellido'])),
                'primer_nombre' => ucfirst(strtolower($docente['primer_nombre'])),
                'segundo_nombre' => $sn,
                'nid' => $docente['celular'],
                'tipo_documento' => $cedula->id,
                'celular' => $docente['celular'],
                'email' => $docente['email'],
                'estado' => 'activo',
                'email_verified_at' => now(),
                'password' => Hash::make($docente['celular']),
            ]);
            $profe->assignRole($role);
        }

    }
}
