<?php

namespace App\Http\Controllers;

use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * method to handle user login, get role and access dashboard based on user role (uses Laravel spatie for roles & permissions)
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create Sanctum token
        $token = $user->createToken('api-token')->plainTextToken;

        // Get the highest priority role for logic
        $roles = $user->getRoleNames();

        // Default dashboard route or access info
        $dashboard = '/dashboard';

        if ($roles->contains('super-admin')) {
            $dashboard = '/superadmin/dashboard';
        } elseif ($roles->contains('sub-admin')) {
            $dashboard = '/subadmin/dashboard';
        } elseif ($roles->contains('regular-user')) {
            $dashboard = '/personnel/dashboard';
        }

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'role' => $roles,
            'dashboard' => $dashboard,
            'user' => $user,
        ]);
    }

    /**
     * logout
     */
    public function logout(Request $request)
    {
        // Revoke current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Request password reset: generate and send OTP to user's email.
     */
    public function requestPasswordReset(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $userDetail = UserDetail::where('email', $request->email)->first();

        if (!$userDetail || !$userDetail->user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user = $userDetail->user;

        // Generates 6-digit OTP
        $otpCode = rand(100000, 999999);

        // Create OTP with expiration time of 15 mins
        Otp::updateOrCreate(
            ['user_id' => $user->id], 
            [
                'otp_code' => $otpCode,
                'expires_at' => Carbon::now()->addMinutes(15)
            ]
        );

        // Send OTP via email
        Mail::raw("Dear Moqoqo user, Your password reset OTP code is: $otpCode.", function ($message) use ($userDetail) {
            $message->to($userDetail->email)->subject('Password Reset OTP');
        });

        return response()->json(['message' => 'OTP sent to registered email']);
    }

    /**
    * Reset password using OTP: validate OTP and update user's password.
    */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|max:6',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',     
                'regex:/[A-Z]/',      
                'regex:/[0-9]/',      
                'regex:/[@$!%*#?&]/', 
            ],
            'confirm_password' => 'required|string|same:new_password',
        ], [
            'new_password.regex' => 'Password must contain uppercase, lowercase, number, and special character.',
            'confirm_password.same' => 'Confirm password must match the new password.'
        ]);

        // Verify OTP
        $otp = Otp::where('otp_code', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        // locate the user tied to OTP
        $user = User::find($otp->user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Delete OTP after success
        $otp->delete();

        return response()->json(['message' => 'Password reset successful']);
    }


}

