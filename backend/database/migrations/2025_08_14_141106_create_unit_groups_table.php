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
        Schema::create('unit_groups', function (Blueprint $table) {
            $table->id()->unique()->autoIncrement();
            $table->string('grp_name')->unique();
            $table->string('grp_description');
            $table->enum('status', ['Open','Closed'])->default('Open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_groups');
    }
};
