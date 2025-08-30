<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitGroup extends Model
{
    protected $fillable = ['grp_name', 'grp_description', 'status'];

    public function members()
    {
        return $this->belongsToMany(User::class, 
                'group_users', 
                'group_id', 
                'user_id')
                ->withPivot('joined_at')
                ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(GroupMessage::class);
    }

    public function isOpen()
    {
        return $this->status === 'open';
    }
}
