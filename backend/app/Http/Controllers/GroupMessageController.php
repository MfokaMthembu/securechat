<?php

namespace App\Http\Controllers;

use App\Models\UnitGroup;
use App\Models\GroupMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class GroupMessageController extends Controller
{
    /**
    * Method to Send a message to a group.
    */
   public function sendMessage(Request $request, UnitGroup $unitGroup)
    {
        $request->validate([
            'grp_message' => 'required_without:attachments|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf,docx|max:5120',
        ]);

        $auth = Auth::user();

        // Only members can send messages
        if (!$unitGroup->members()->where('user_id', $auth->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Handle file uploads
        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachmentPaths[] = $file->store('group_attachments', 'public');
            }
        }

        // Create message
        $message = new GroupMessage();
        $message->grp_message = $request->grp_message;
        $message->attachments = $attachmentPaths ? json_encode($attachmentPaths) : null;
        $message->group_id = $unitGroup->id;
        $message->user_id = $auth->id;
        $message->save();

        // Load user relationship to send to frontend
        $message->load('user');

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
    * Method to get all messages in a group.
    */
    public function getMessages(UnitGroup $unitGroup)
    {
        $auth = Auth::user();

        // Only members can fetch messages
        if (!$unitGroup->members->contains($auth->id)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = GroupMessage::where('group_id', $unitGroup->id)
            ->with('user:id,username')  
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'user' => $msg->user,
                    'grp_message' => $msg->grp_message,
                    'attachments' => $msg->attachments ? json_decode($msg->attachments, true) : [],
                    'created_at' => $msg->created_at->toDateTimeString(),
                ];
            });

        return response()->json($messages);
    }

/**
 * Method to get group assigned to the user.
 */
public function getUserGroups(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated',
            'groups' => []
        ], 401);
    }

    // Get the user's assigned groups through the group_users pivot table
    // This joins: users -> group_users (pivot) -> unit_groups (actual group data)
     $userGroups = $user->groups()->with(['members.userDetail'])->get();

    if ($userGroups->isEmpty()) {
        return response()->json([
            'success' => true,
            'message' => 'No groups assigned',
            'groups' => []
        ]);
    }

    return response()->json([
        'success' => true,
        'groups' => $userGroups,
        'message' => 'Groups retrieved successfully'
    ]);
}

}
