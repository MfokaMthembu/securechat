<?php

use App\Http\Controllers\UserController;
use App\Models\UnitGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
 use App\Http\Controllers\AlertController;
use App\Http\Controllers\UnitGroupController;
use App\Http\Controllers\GroupMessageController;
use App\Http\Controllers\UnitCommanderController;
use App\Http\Controllers\RegularUserController;
use App\Http\Controllers\GroupUserController;

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'requestPasswordReset']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


// Protected routes (require Sanctum token)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route to get groups for the authenticated user
    Route::get('/user-groups', [GroupMessageController::class, 'getUserGroups']);
    
    // Route to send message to a group
    Route::post('/groups/{unitGroup}/send-message', [GroupMessageController::class, 'sendMessage']);
    // Route to get messages from a group
    Route::get('/groups/{unitGroup}/get-messages', [GroupMessageController::class, 'getMessages']);

    // Routes for system wide alerts
    Route::post('/send-alerts', [AlertController::class, 'createAlert']);
    Route::get('/get-alerts', [AlertController::class, 'getAlerts']);
    Route::patch('/alerts/{id}/read', [AlertController::class, 'markAsRead']);
   

    
    // Super-Admin routes
    Route::prefix('superadmin')->group(function () {
        // Dashboard overview waiting on engineer for frontend implementation
        Route::get('/dashboard', [UserController::class, 'index']); 
        Route::post('/assign-role', [UserController::class, 'assignRole']);
        // User management routes
        Route::get('/users', [UserController::class, 'getUsers']);
        Route::post('/create-user', [UserController::class, 'createUser']);
        Route::put('/update-user/{id}', [UserController::class, 'updateUser']);
        Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);
        Route::get('/search-users', [UserController::class, 'searchUsers']);
        Route::post('/bulk-action', [UserController::class, 'bulkAction']);
        Route::get('/user-stats', [UserController::class, 'getUserStats']);

        // Group management routes
        Route::get('/get-groups', [UnitGroupController::class, 'getGroups']);
        Route::post('/create-group', [UnitGroupController::class, 'createGroup']);
        Route::put('/update-group/{id}', [UnitGroupController::class, 'updateGroup']);
        Route::delete('/delete-group/{id}', [UnitGroupController::class, 'deleteGroup']);
        Route::get('/search-group', [UnitGroupController::class, 'searchGroup']);
        
        // Assign Unit Commanders to groups
        Route::post('/groups/{unitGroup}/assign-commander', [GroupUserController::class, 'assignCommander']);

    });
    
    // Sub-admin routes
    Route::prefix('subadmin')->group(function () {
        //Route::get('/dashboard', [UnitCommanderController::class, 'index']);
        // Assign Unit Personnel to groups
         Route::post('/groups/{unitGroup}/assign-member', [GroupUserController::class, 'addMember']);
        // Remove a member from a group
        Route::delete('/groups/{unitGroup}/members/{user}', [GroupUserController::class, 'removeMember']);
        // List all members of a group
        Route::get('/groups/{unitGroup}/members', [GroupUserController::class, 'listMembers']);
        // Close the group
        Route::post('/groups/{unitGroup}/close', [GroupUserController::class, 'closeGroup']);
        // open the group
        Route::post('/groups/{unitGroup}/open', [GroupUserController::class, 'openGroup']);
        // view all personnel except logged in user and sysadmin
        Route::get('/get-users', [UserController::class, 'getPersonnel']);
    });
    
    // Regular User routes
    Route::prefix('personnel')->group(function () {
        Route::get('/dashboard', [RegularUserController::class, 'index']);
        Route::post('/send-message', [RegularUserController::class, 'sendMessage']);
    });
});