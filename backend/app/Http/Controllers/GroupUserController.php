<?php

namespace App\Http\Controllers;

use App\Models\UnitGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupUserController extends Controller
{
    /*
    * Method to assign Unit Commanders to unit groups
    */
    public function assignCommander(Request $request, UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        if (!$auth->hasRole('super-admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::findOrFail($request->user_id);

        if (!$user->hasRole('sub-admin')) {
            return response()->json(['error' => 'Selected user is not a sub-admin'], 422);
        }

        $unitGroup->members()->syncWithoutDetaching([
            $user->id => ['joined_at' => now()]
        ]);

        // Assign the user as a commander
        $groupWithMembers = UnitGroup::with('members')->find($unitGroup->id);

        return response()->json([
            'message' => 'Unit Commander assigned successfully',
            'group' => $groupWithMembers
        ]);
    }

    /*
    * Method to add Unit Members to unit groups
    */
    public function addMember(Request $request, UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        if (!$auth->hasRole('sub-admin') && !$auth->hasRole('super-admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate array of users or single user
        $request->validate([
            'user_id'   => 'required_without:user_ids|exists:users,id',
            'user_ids'  => 'array',
            'user_ids.*'=> 'exists:users,id',
        ]);

        $userIds = [];

        if ($request->filled('user_id')) {
            $userIds[] = $request->user_id;
        }

        if ($request->filled('user_ids')) {
            $userIds = array_merge($userIds, $request->user_ids);
        }

        if (empty($userIds)) {
            return response()->json(['error' => 'No users provided'], 422);
        }

        // Build attach data
        $attachData = [];
        foreach ($userIds as $id) {
            $attachData[$id] = ['joined_at' => now()];
        }

        // Insert into pivot
        $unitGroup->members()->syncWithoutDetaching($attachData);

        $groupWithMembers = UnitGroup::with('members')->find($unitGroup->id);

        return response()->json([
            'message' => 'Member(s) added successfully',
            'group'   => $groupWithMembers
        ]);
    }


    /*
    * Method to remove Unit Personnel from unit groups
    */
    public function removeMember(UnitGroup $unitGroup, User $user)
    {
        $auth = Auth::user();

        // Only superadmin or the group commander can remove members
        if (!($auth->hasRole('superadmin') || $auth->isCommanderOf($unitGroup))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $unitGroup->members()->detach($user->id);

        return response()->json([
            'success' => true,
            'message' => 'Member removed successfully'
        ]);
    }

    /*
    * Method to display members of the unit groups
    */
    public function listMembers(UnitGroup $unitGroup)
    {
        return response()->json($unitGroup->members()->with('userDetail')->get());
    }


    /**
     * Method to close group, prevents members from sending messages
     */
    public function closeGroup(UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        // Only superadmin or commander of this group can close
        if (!($auth->hasRole('superadmin') || $auth->isCommanderOf($unitGroup))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $unitGroup->update(['status' => 'closed']);

        return response()->json([
            'success' => true,
            'message' => 'Group has been closed. Members can no longer send messages.'
        ]);
    }

    /**
     * Method to Open group, allows members to send messages
     */
    public function openGroup(UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        // Only superadmin (unit commander) of this group can open
        if (!($auth->hasRole('superadmin') || $auth->isCommanderOf($unitGroup))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $unitGroup->update(['status' => 'open']);

        return response()->json([
            'success' => true,
            'message' => 'Group has been opened. Members can send messages again.'
        ]);
    }

    
    /**
     * Get all users from the DB except sysadmin and logged in user.
     */
    public function getPersonnel()
    {
        try {
            // Get the logged-in user's ID
            $currentUserId = auth()->id();
            
            $users = User::with(['userDetail', 'roles'])
                // Exclude both sysadmin and logged-in user
                ->where('username', '!=', 'sysadmin') 
                ->where('id', '!=', $currentUserId)   
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'status' => $user->status,
                        'created_at' => $user->created_at,
                        'userDetail' => $user->userDetail ? [
                            'first_name' => $user->userDetail->first_name,
                            'last_name' => $user->userDetail->last_name,
                            'email' => $user->userDetail->email,
                            'unit' => $user->userDetail->unit,
                            'rank' => $user->userDetail->rank,
                        ] : null,
                        'roles' => $user->roles->map(function ($role) {
                            return ['name' => $role->name];
                        })->toArray()
                    ];
                });

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

}
