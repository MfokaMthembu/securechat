<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // user auth table
        Schema::create('users', function (Blueprint $table) {
            $table->id()->unique()->autoIncrement();;
            $table->string('username', 150)->unique();
            $table->string('password');
            $table->rememberToken();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('inactive');
            $table->timestamps();
        });

        // stores tokens for password resets
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('username')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // stores data to track sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Personal details table for user profile (linked to user)
        Schema::create('user_details', function (Blueprint $table) {
            $table->id()->unique()->autoIncrement();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            // for notifications & password resets OTP is sent via email
            $table->string('email')->unique(); 
            $table->date('dob')->nullable();
            $table->string('unit');
            $table->string('rank');
            $table->string('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_details');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
