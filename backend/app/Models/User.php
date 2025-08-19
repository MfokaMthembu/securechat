<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasApiTokens<\Laravel\Sanctum\HasApiTokens> */
    /** @use HasRoles<\Spatie\Permission\Traits\HasRoles> */

    use HasApiTokens, Notifiable, HasRoles;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // relationship, a user can have many OTPs
    public function otps()
    {    
        return $this->hasMany(Otp::class);
    }

    // relationship, a user has one user detail
    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }

    // relationship, a group has many users
    public function groups()
    {
        return $this->belongsToMany(UnitGroup::class, 'group_users')
                ->withPivot('role', 'joined_at')
                ->withTimestamps();
    }

    // relationship, a user can send many group messages 
    public function groupMessages()
    {
        return $this->hasMany(GroupMessage::class);
    }


}
