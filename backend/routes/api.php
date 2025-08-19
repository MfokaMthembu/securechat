<?php

use App\Http\Controllers\UserController;
use App\Models\UnitGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UnitGroupController;
use App\Http\Controllers\UnitCommanderController;
use App\Http\Controllers\RegularUserController;

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
        Route::post('/search-users', [UserController::class, 'searchUsers']);
        Route::post('/bulk-action', [UserController::class, 'bulkAction']);
        Route::get('/user-stats', [UserController::class, 'getUserStats']);
        // Group management routes
        Route::get('/groups', [UnitGroupController::class, 'index']);
        Route::post('/create-group', [UnitGroupController::class, 'createGroup']);
        Route::put('/update-group/{id}', [UnitGroupController::class, 'updateGroup']);
        Route::delete('/delete-group/{id}', [UnitGroupController::class, 'deleteGroup']);
        Route::post('/search-group', [UnitGroupController::class, 'searchGroup']);
        // Assign Unit Commanders to groups
        Route::post('/assign-commander/{unitGroup}', [UnitGroupController::class, 'addCommander']);
        Route::post('/assign-member/{unitGroup}', [UnitGroupController::class, 'addMember']);
        Route::delete('/remove-member/{unitGroup}/{userId}', [UnitGroupController::class, 'removeMember']);
        Route::get('/group-members/{unitGroup}', [UnitGroupController::class, 'listMembers']);

    });
    
    // Sub-admin routes
    Route::prefix('subadmin')->group(function () {
        Route::get('/dashboard', [UnitCommanderController::class, 'index']);
        Route::post('/assign-personnel', [UnitCommanderController::class, 'assignPersonnel']);
    });
    
    // Regular User routes
    Route::prefix('personnel')->group(function () {
        Route::get('/dashboard', [RegularUserController::class, 'index']);
        Route::post('/send-message', [RegularUserController::class, 'sendMessage']);
    });
});