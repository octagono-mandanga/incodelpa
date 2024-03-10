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

        //
        $cedula = TipoDocumento::where('nombre', 'Cédula de Ciudadanía')->first();
        /*
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
            'password' => Hash::make('123456'),
        ]);
        $role = Role::where('name', 'root')->first();
        $user1->assignRole($role);

        $user2 = User::create([
            'primer_apellido' => 'Buenaventura',
            'primer_nombre' => 'Engelberto',
            'nid' => '16280210',
            'tipo_documento' => $cedula->id,
            'celular' => '16280210',
            'email' => 'ebuenaventura@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
        ]);
        $role = Role::where('name', 'coordinacion')->first();
        $user2->assignRole($role);*/
        //$role = Role::where('name', 'coordinacion')->first();
        //$user2->assignRole($role);

        $role = Role::where('name', 'secretaria')->first();
        $user5 = User::create([
            'primer_apellido' => 'Torres',
            'primer_nombre' => 'Claudia',
            'nid' => '25280055',
            'tipo_documento' => $cedula->id,
            'celular' => '316280210',
            'email' => 'secretaria01@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
        ]);
        $user5->assignRole($role);
        /*
        $role = Role::where('name', 'docente')->first();
        $user3 = User::create([
            'primer_apellido' => 'Aguirre',
            'primer_nombre' => 'Rubén',
            'nid' => '94488855',
            'tipo_documento' => $cedula->id,
            'celular' => '16280210',
            'email' => 'jirafales01@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
        ]);
        $user3->assignRole($role);
        $user4 = User::create([
            'primer_apellido' => 'Jirafales',
            'primer_nombre' => 'Rubén',
            'nid' => '94488856',
            'tipo_documento' => $cedula->id,
            'celular' => '16280210',
            'email' => 'jirafales02@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
        ]);
        $user4->assignRole($role);
        $user5 = User::create([
            'primer_apellido' => 'Miraflores',
            'primer_nombre' => 'Rubén',
            'nid' => '94488857',
            'tipo_documento' => $cedula->id,
            'celular' => '16280210',
            'email' => 'jirafales03@gmail.com',
            'estado' => 'activo',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
        ]);
        $user5->assignRole($role);*/


    }
}
