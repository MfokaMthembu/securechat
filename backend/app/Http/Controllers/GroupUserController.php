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
    public function addCommander(Request $request, UnitGroup $unitGroup)
    {

        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $unitGroup->members()->syncWithoutDetaching([
            $data['user_id'] => ['role' => 'commander', 'joined_at' => now()]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commander assigned successfully'
        ]);
    }

    /*
    * Method to add Unit Personnel to unit groups
    */
    public function addMember(Request $request, UnitGroup $unitGroup)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();

        // Only Unit commanders of this group or admins can add members
        if (!($user->hasRole('sub-admin') || $unitGroup->members()
                ->wherePivot('role', 'commander')
                ->where('user_id', $user->id)
                ->exists())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $unitGroup->members()->syncWithoutDetaching([
            $data['user_id'] => ['role' => 'member', 'joined_at' => now()]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Member added successfully'
        ]);
    }

    /*
    * Method to remove Unit Personnel from unit groups
    */
    public function removeMember(UnitGroup $unitGroup, User $user)
    {
        $auth = Auth::user();

        if (!($auth->hasRole('admin') || $unitGroup->members()
                ->wherePivot('role', 'commander')
                ->where('user_id', $auth->id)
                ->exists())) {
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
        return response()->json($unitGroup->members);
    }

    /**
     * Method to close group, prevents members from sending messages
     */
    public function closeGroup(UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        // Only admin or commander of this group can close
        if (!($auth->hasRole('sub-admin') || $unitGroup->members()
                ->wherePivot('role', 'commander')
                ->where('user_id', $auth->id)
                ->exists())) {
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

        // Only admin or commander of this group can open
        if (!($auth->hasRole('sub-admin') || $unitGroup->members()
                ->wherePivot('role', 'commander')
                ->where('user_id', $auth->id)
                ->exists())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $unitGroup->update(['status' => 'open']);

        return response()->json([
            'success' => true,
            'message' => 'Group has been opened. Members can send messages again.'
        ]);
    }

}
