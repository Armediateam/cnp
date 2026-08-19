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
        Schema::create('rab_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('village_name');
            $table->decimal('length', 10, 2)->default(0);
            $table->decimal('width', 10, 2)->default(0);
            $table->decimal('building_area', 10, 2)->default(0);
            $table->unsignedBigInteger('price_per_meter')->default(0);
            $table->unsignedBigInteger('building_cost')->default(0);
            $table->string('specification')->nullable();
            $table->unsignedBigInteger('request_items_total')->default(0);
            $table->unsignedBigInteger('request_shipping_cost')->default(0);
            $table->unsignedBigInteger('request_other_cost')->default(0);
            $table->decimal('request_dp_percent', 5, 2)->default(0);
            $table->decimal('request_start_percent', 5, 2)->default(0);
            $table->unsignedInteger('request_installments')->default(0);
            $table->unsignedBigInteger('finishing_items_total')->default(0);
            $table->unsignedBigInteger('finishing_shipping_cost')->default(0);
            $table->unsignedBigInteger('finishing_other_cost')->default(0);
            $table->decimal('finishing_dp_percent', 5, 2)->default(0);
            $table->unsignedInteger('finishing_installments')->default(0);
            $table->unsignedBigInteger('grand_total')->default(0);
            $table->string('status')->default('Draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rab_projects');
    }
};
