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
     * Get all group info from the db
     */
    public function index()
    {
        return response()->json(UnitGroup::all());
    }

    /**
     * Method to create groups
     */
    public function createGroup(Request $request)
    {
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
    }

    /**
    * Method to show groups
    */ 
    public function getGroups(UnitGroup $unitGroup)
    {
        return response()->json($unitGroup);
    }

    /**
    * Method to update groups
    */ 
    public function updateGroup(Request $request, UnitGroup $unitGroup)
    {
        $data = $request->validate([
            'grp_name' => 'required|string',
            'grp_description' => 'nullable|string',
        ]);

        $unitGroup->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Group updated successfully',
            'data' => $unitGroup
        ]);
    }

    /**
     * Method to delete groups 
     */
    public function deleteGroup(UnitGroup $unitGroup)
    {
        $unitGroup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Group deleted successfully'
        ]);
    }
}
