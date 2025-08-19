<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create the super admin user (Built-in system administrator)
        $superAdmin = User::firstOrCreate(
            ['username' => 'sysadmin'],
            [
                'password' => Hash::make('moqoqo@EA$$23'),
                'status' => 'active',
            ]
        );

        // Assigns role to the super admin user
        if (!$superAdmin->hasRole('super-admin')) {
            $superAdmin->assignRole('super-admin');
        }
    }
}
