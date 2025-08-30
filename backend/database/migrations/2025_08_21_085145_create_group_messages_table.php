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
        Schema::create('group_messages', function (Blueprint $table) {
            $table->id();
            
            // foreign key to unit_groups table
            $table->unsignedBigInteger('group_id');
            $table->foreign('group_id')
                  ->references('id')
                  ->on('unit_groups')
                  ->onDelete('cascade');

            // foreign key to users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->text('grp_message')->nullable(); // message text
            $table->json('attachments')->nullable(); // docs/images attachments
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_messages');
    }
};
