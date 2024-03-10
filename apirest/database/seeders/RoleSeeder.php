<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Role::create(['name' => 'root', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'secretaria', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'coordinacion', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'docente', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'alumno ', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'rectoria', 'guard_name' => 'sanctum']);
    }
}
