<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [
        'title',
        'message',
        'attachments',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    // Relationship: an alert is sent to many users
    public function users()
    {
        return $this->belongsToMany(User::class, 'alert_user')
                    ->withTimestamps();
    }
}
