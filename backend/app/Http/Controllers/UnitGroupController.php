<?php

namespace App\Http\Controllers;

use App\Models\UnitGroup;
use Illuminate\Http\Request;

class UnitGroupController extends Controller
{
    public function __construct()
    {
        // Only admins can manage groups
       // $this->mi(['role:super-admin']);
    }

    /**
     * Method to create groups
     */
    public function createGroup(Request $request)
    {
        try {
                $data = $request->validate([
                'grp_name' => 'required|string',
                'grp_description' => 'nullable|string',
            ]);

            $group = UnitGroup::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Group created successfully',
                'data' => $group
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create group',
                'error' => $e->getMessage()
            ], 500);
        }
        
    }

    /**
    * Method to get all groups
    */ 
    public function getGroups(UnitGroup $unitGroup)
    {
        try {
            $groups = UnitGroup::query()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($group) => [
                    'id' => $group->id,
                    'grp_name' => $group->grp_name,
                    'grp_description' => $group->grp_description,
                    'status' => $group->status,
                ]);

            return response()->json([
                'success' => true,
                'data' => $groups,
                'message' => 'Groups retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve groups',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
    * Method to update groups
    */ 
    public function updateGroup(Request $request, UnitGroup $group,$id )
    {
        try {

            $group = UnitGroup::findOrFail($id);

            // Validate the incoming request
            $validated = $request->validate([
                'grp_name' => 'required|string',
                'grp_description' => 'nullable|string',
            ]);

            // Update the group
            $group->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Group updated successfully',
                'data' => $group
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update group',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Method to delete groups 
     */
    public function deleteGroup(UnitGroup $unitGroup, $id)
    {
        $unitGroup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Group deleted successfully'
        ]);
    }

     /**
    * Method to search for group name 
    */
    public function searchGroup(Request $request)
    {
        $validated = $request->validate([
            'search' => 'required|string|min:2'
        ]);

        try {
            $searchTerm = $validated['search'];

            $groups = UnitGroup::query()
                ->where('grp_name', 'LIKE', "%{$searchTerm}%")
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($group) => [
                    'id' => $group->id,
                    'grp_name' => $group->grp_name,
                    'grp_description' => $group->grp_description,
                    'status' => $group->status,
                ]);

            return response()->json([
                'success' => true,
                'data' => $groups,
                'message' => 'Groups found successfully',
                'search_term' => $searchTerm,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}