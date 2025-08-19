<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'otp_code',
        'expires_at',
        'is_used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    // relationship, OTP belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // checks if OTP is expired
    public function isExpired()
    {
        return now()->greaterThan($this->expires_at);
    }

    // highlight the OTP as used
    public function markAsUsed()
    {
        $this->update(['is_used' => true]);
    }
}

