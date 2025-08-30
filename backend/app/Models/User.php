<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'username',
        'password',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // specify the guard name for Spatie roles and permissions
    protected $guard_name = 'web';


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // relationship: a user can have many OTPs
    public function otps()
    {    
        return $this->hasMany(Otp::class);
    }

    // relationship: a user has one user detail
    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }

    // relationship: a user can belong to many groups
    public function groups()
    {
        return $this->belongsToMany(UnitGroup::class, 'group_users', 'user_id', 'group_id')
                    ->withPivot('joined_at') 
                    ->withTimestamps();
    }

    // relationship: a user can send many group messages 
    public function groupMessages()
    {
        return $this->hasMany(GroupMessage::class);
    }

    // Check if the user is a commander of a specific group,
    // if the user has the 'sub-admin' role and is a member
    // of the specified group.
    public function isCommanderOf(UnitGroup $group): bool
    {
        return $this->hasRole('sub-admin') && $group->members->contains($this->id);
    }

    // relationship: a alert is sent to all users in the system (belongs to many)
    public function alerts()
    {
        return $this->belongsToMany(Alert::class, 'alert_user')
                    ->withTimestamps();
    }

}
