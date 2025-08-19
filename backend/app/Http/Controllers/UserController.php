<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Create a new user with generated credentials and user details.
     */
    public function createUser(Request $request)
    {
        // Validates the request to insert a new user
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:user_details,email',
            'dob' => 'nullable|date|before:today',
            'unit' => 'nullable|string|max:100',
            'rank' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'role' => 'required|string|in:super-admin,sub-admin,regular-user'
        ]);

        try {
            $result = DB::transaction(function () use ($validated) {
                // Generate username (NB: can be the same as others but the id remains unique)
                $username = strtolower($validated['first_name'] . '.' . $validated['last_name']);

                // Creates user with generated credentials
                $user = User::create([
                    'username' => $username,
                    'password' => Hash::make($validated['first_name'] . '@123'),
                    'status' => 'active'
                ]);

            // Assigns role
            $user->assignRole($validated['role']);

            // Create details
            UserDetail::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'] ?? null,
                'dob' => $validated['dob'] ?? null,
                'unit' => $validated['unit'] ?? null,
                'rank' => $validated['rank'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            // Load details and roles
            $user->load(['userDetail', 'roles']);

            return [
                'user' => $user,
                'credentials' => [
                    'username' => $username,
                    'password' => $validated['first_name'] . '@123'
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'User successfully created',
            'data' => $result
        ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user. Please check the input data & try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Get a all users from the DB.
     */
    public function getUsers()
    {
        try {
            $users = User::leftJoin('user_details', 'users.id', '=', 'user_details.user_id')
                ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
                ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->select(
                    'users.id',
                    'users.username',
                    'user_details.first_name',
                    'user_details.last_name',
                    'user_details.email',
                    'user_details.unit',
                    'user_details.rank',
                    'users.status',
                    'roles.name as role_name',
                    'users.created_at'
                )
                ->orderBy('users.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Update user details & generated credentials.
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::with('userDetail')->findOrFail($id);

            // Validate the incoming request
            $validated = $request->validate([
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => [
                    'nullable',
                    'email',
                    Rule::unique('user_details', 'email')->ignore($user->userDetail->id ?? null)
                ],
                'dob' => 'nullable|date|before:today',
                'unit' => 'nullable|string|max:100',
                'rank' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:500',
                'status' => 'sometimes|required|in:active,inactive,suspended',
                'role' => 'sometimes|required|string|in:super-admin,sub-admin,regular-user',
                'regenerate_password' => 'sometimes|boolean'
            ]);

            $result = DB::transaction(function () use ($user, $validated, $request) {
                $updateData = [];
                $userDetailData = [];
                $newCredentials = null;

                // Update user status if provided
                if (isset($validated['status'])) {
                    $updateData['status'] = $validated['status'];
                }

                // If first_name or last_name changes, regenerate username and password
                if (isset($validated['first_name']) || isset($validated['last_name'])) {
                    $firstName = $validated['first_name'] ?? $user->userDetail->first_name;
                    $lastName = $validated['last_name'] ?? $user->userDetail->last_name;

                    // No uniqueness check — usernames can be repeated
                    $username = strtolower($firstName . '.' . $lastName);

                    $updateData['username'] = $username;
                    $newPassword = $firstName . '@123';
                    $updateData['password'] = Hash::make($newPassword);

                    $newCredentials = [
                        'username' => $username,
                        'password' => $newPassword
                    ];
                }

                // Accommodates changes to password without name change
                if ($request->has('regenerate_password') && $validated['regenerate_password']) {
                    $firstName = $validated['first_name'] ?? $user->userDetail->first_name;
                    $newPassword = $firstName . '@123';
                    $updateData['password'] = Hash::make($newPassword);

                    $newCredentials = [
                        'username' => $user->username,
                        'password' => $newPassword
                    ];
                }

                // Update user table
                if (!empty($updateData)) {
                    $user->update($updateData);
                }

                // Update user details
                $userDetailFields = ['first_name', 'last_name', 'email', 'dob', 'rank', 'address'];
                foreach ($userDetailFields as $field) {
                    if (isset($validated[$field])) {
                        $userDetailData[$field] = $validated[$field];
                    }
                }

                if (!empty($userDetailData)) {
                    if ($user->userDetail) {
                        $user->userDetail->update($userDetailData);
                    } else {
                        UserDetail::create(array_merge($userDetailData, ['user_id' => $user->id]));
                    }
                }

                // Update role if specified
                if (isset($validated['role'])) {
                    $user->syncRoles([$validated['role']]);
                }

                // Reload the user with newly updated data
                $user->load(['userDetail', 'roles']);

                return [
                    'user' => $user,
                    'new_credentials' => $newCredentials
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Delete user and their details. (Both user and user details will be deleted)
     */
    public function deleteUser($id)
    {
        try {
            $user = User::with('userDetail')->findOrFail($id);

            DB::transaction(function () use ($user) {
                // Delete user details first (if exists)
                if ($user->userDetail) {
                    $user->userDetail->delete();
                }

                // Remove all roles
                $user->syncRoles([]);

                // Delete the user
                $user->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'User and associated details deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search users by name, surname, unit, rank, email, or by id.
     */
    public function searchUsers(Request $request)
    {
        $validated = $request->validate([
            'search' => 'required|string|min:2',
            'search_type' => 'sometimes|string|in:all,name,email,unit,rank,id',
        ]);

        try {
            $searchTerm = $validated['search'];
            $searchType = $validated['search_type'] ?? 'all';
            $perPage = $validated['per_page'] ?? 15;

            $query = User::with(['userDetail', 'roles']);

            switch ($searchType) {
                case 'id':
                    if (is_numeric($searchTerm)) {
                        $query->where('id', $searchTerm);
                    } else {
                        // Return empty result for non-numeric ID search
                        return response()->json([
                            'success' => true,
                            'data' => [],
                            'message' => 'No users found'
                        ], 200);
                    }
                    break;

                case 'name':
                    $query->whereHas('userDetail', function ($q) use ($searchTerm) {
                        $q->where('first_name', 'LIKE', "%{$searchTerm}%")
                          ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
                    });
                    break;

                case 'email':
                    $query->whereHas('userDetail', function ($q) use ($searchTerm) {
                        $q->where('email', 'LIKE', "%{$searchTerm}%");
                    });
                    break;

                case 'rank':
                    $query->whereHas('userDetail', function ($q) use ($searchTerm) {
                        $q->where('rank', 'LIKE', "%{$searchTerm}%");
                    });
                    break;
                case 'unit':
                    $query->whereHas('userDetail', function ($q) use ($searchTerm) {
                        $q->where('unit', 'LIKE', "%{$searchTerm}%");
                    });
                    break;

                default: // 'all'
                    $query->where(function ($q) use ($searchTerm) {
                        // Search in user table
                        $q->where('username', 'LIKE', "%{$searchTerm}%")
                          ->orWhere('id', is_numeric($searchTerm) ? $searchTerm : 0)
                          // Search in user details via name, surname, email, rank, and unit
                          ->orWhereHas('userDetail', function ($subQ) use ($searchTerm) {
                              $subQ->where('first_name', 'LIKE', "%{$searchTerm}%")
                                   ->orWhere('last_name', 'LIKE', "%{$searchTerm}%")
                                   ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                                   ->orWhere('rank', 'LIKE', "%{$searchTerm}%")
                                   ->orWhere('unit', 'LIKE', "%{$searchTerm}%");
                          });
                    });
                    break;
            }

            $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => $results->count() > 0 ? 'Users found successfully' : 'No users found',
                'search_term' => $searchTerm,
                'search_type' => $searchType
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk operations for users
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:activate,deactivate,delete',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'required|integer|exists:users,id'
        ]);

        try {
            $userIds = $validated['user_ids'];
            $action = $validated['action'];
            $results = [];

            DB::transaction(function () use ($userIds, $action, &$results) {
                foreach ($userIds as $userId) {
                    try {
                        $user = User::findOrFail($userId);
                        
                        switch ($action) {
                            case 'activate':
                                $user->update(['status' => 'active']);
                                $results[] = ['id' => $userId, 'status' => 'activated'];
                                break;
                                
                            case 'deactivate':
                                $user->update(['status' => 'inactive']);
                                $results[] = ['id' => $userId, 'status' => 'deactivated'];
                                break;
                                
                            case 'delete':
                                if ($user->userDetail) {
                                    $user->userDetail->delete();
                                }
                                $user->syncRoles([]);
                                $user->delete();
                                $results[] = ['id' => $userId, 'status' => 'deleted'];
                                break;
                        }
                    } catch (\Exception $e) {
                        $results[] = ['id' => $userId, 'status' => 'failed', 'error' => $e->getMessage()];
                    }
                }
            });

            return response()->json([
                'success' => true,
                'message' => "Bulk {$action} operation completed",
                'results' => $results
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bulk operation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function getUserStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'inactive_users' => User::where('status', 'inactive')->count(),
                'suspended_users' => User::where('status', 'suspended')->count(),
                'users_by_role' => User::join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
                                      ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                                      ->groupBy('roles.name')
                                      ->selectRaw('roles.name as role, count(*) as count')
                                      ->pluck('count', 'role')
                                      ->toArray(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistics retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}