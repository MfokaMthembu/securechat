<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Resets any existing cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permission categories for better organization
        $permissionGroups = [
            'users' => ['create', 'read', 'update', 'delete'],
            'unit_groups' => ['create', 'read', 'update', 'delete', 'assign_personnel', 'chat'],
            'messages' => ['send', 'read'],
            'alerts' => ['send', 'read'],
            'personnel' => ['view', 'assign'],
            'roles' => ['assign', 'revoke'],
        ];

        // Create permissions using dot notation
        foreach ($permissionGroups as $group => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$group}.{$action}",
                    'guard_name' => 'web'
                ]);
            }
        }

        /** Creating user roles & assigning relevant permissions */

        // Super Admin - System Administrator
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);

        // Super Admin manages the system but CANNOT view unit_groups.chat and messages to maintain unit privacy
        $superAdmin->givePermissionTo([
            'users.create',
            'users.read', 
            'users.update',
            'users.delete',
            'unit_groups.create',
            'unit_groups.read',
            'unit_groups.update', 
            'unit_groups.delete',
            'roles.assign',
            'roles.revoke',
            'personnel.view',
            'alerts.send',
            'alerts.read',
        ]);

        // Sub Admin - Unit Commander
        $subAdmin = Role::firstOrCreate(['name' => 'sub-admin']);
        $subAdmin->givePermissionTo([
            // Can view users in their unit group
            'users.read',   
            // Can view unit group information           
            'unit_groups.read',   
            // Can update their unit group details     
            'unit_groups.update',     
            // Can participate in unit group chat 
            'unit_groups.chat', 
            // Can assign personnel to unit group       
            'unit_groups.assign_personnel', 
            'personnel.view',
            'personnel.assign',
            'messages.send',
            'messages.read',
            'alerts.send',
            'alerts.read',
        ]);

        // Regular User - Unit Personnel  
        $regularUser = Role::firstOrCreate(['name' => 'regular-user']);
        $regularUser->givePermissionTo([
            // Can view their unit group info
            'unit_groups.read', 
            // Can participate in unit group chat       
            'unit_groups.chat', 
            // Can view unit personnel       
            'personnel.view', 
            // Can send messages within unit group         
            'messages.send',  
            // Can read unit messages         
            'messages.read', 
            // Can send alerts (emergency situations)          
            'alerts.send', 
            // Can read alerts (emergency notifications)            
            'alerts.read',            
        ]);
    }
}