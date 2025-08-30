<?php
namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AlertController extends Controller
{
    /**
     * Create a new alert and send to all users.
     */
    public function createAlert(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'message'     => 'required|string',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:2048', 
        ]);

        // handle file uploads
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('alerts', 'public');
                $attachments[] = $path;
            }
        }

        // create alert
        $alert = Alert::create([
            'title'       => $validated['title'],
            'message'     => $validated['message'],
            'latitude'    => $validated['latitude'] ?? null,
            'longitude'   => $validated['longitude'] ?? null,
            'attachments' => $attachments,
        ]);

        // attach alert to all users
        $alert->users()->attach(User::pluck('id')->toArray());

        return response()->json([
            'status'  => 'success',
            'message' => 'Alert created and sent to all users',
            'alert'   => $alert
        ]);
    }

    /**
     * Get all alerts with user relationship (optional).
     */
    public function getAlerts()
    {
        $alerts = Alert::with('users:id,name,email') // you can trim user fields
                        ->latest()
                        ->get();

        return response()->json([
            'status' => 'success',
            'alerts' => $alerts
        ]);
    }

    /**
     * Mark an alert as read by the authenticated user.
     */
    public function markAsRead($alertId)
    {
        $user = auth()->user();

        $user->alerts()->updateExistingPivot($alertId, [
            'is_read' => true,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Alert marked as read',
            'alert_id' => $alertId
        ]);
    }

}
