<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            TipoDocumentoSeeder::class,
            RoleSeeder::class,
            NivelesTableSeeder::class,
            InstitucionesTableSeeder::class,
            GradoSeeder::class,
            AreasTableSeeder::class,
            MateriasSeeder::class,
            TipoCompetenciaSeeder::class,
            CompetenciaSeeder::class,
            UserSeeder::class,
            CriterioPromocionSeeder::class,
            EscalaSeeder::class,
            CondicionesSeeder::class,
            ParentescoSeeder::class,
        ]);
    }
}
