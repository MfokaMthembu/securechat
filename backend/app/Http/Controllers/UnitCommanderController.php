<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UnitCommanderController extends Controller
{
    public function index() {
        return response()->json(['message' => 'Sub Admin Dashboard']);
    }

    public function assignPersonnel(Request $request) {
        return response()->json(['message' => 'Personnel assigned (stub)']);
    }
}
