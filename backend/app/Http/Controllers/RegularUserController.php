<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegularUserController extends Controller
{
    public function index() {
        return response()->json(['message' => 'Regular User Dashboard']);
    }

    public function sendMessage(Request $request) {
        return response()->json(['message' => 'Message sent (stub)']);
    }
}

