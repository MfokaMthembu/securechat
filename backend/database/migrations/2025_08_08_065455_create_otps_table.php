<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
                $table->id()->autoIncrement()->unique();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                // OTP code is a 6-digit numeric number
                $table->string('otp_code', 6); 
                // The timestamp when the OTP expires (5-10 minutes)
                $table->timestamp('expires_at'); 
                // shows if the OTP has been used or not thus helps prevent reuse
                $table->boolean('is_used')->default(false); 
                $table->timestamps();
                // for quick lookups, we can index user_id and otp_code together faster    
                $table->index(['user_id', 'otp_code']); 
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
