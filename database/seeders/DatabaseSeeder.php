<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed default user
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@hub.com',
            'password' => bcrypt('password'),
        ]);

        // 2. Seed default products
        $p1 = \App\Models\Product::create([
            'name' => 'CyberKeyboard X9',
            'description' => 'A premium hot-swappable mechanical keyboard featuring customized linear switches, stunning custom keycaps, and deep organic sound profile. Housed in a solid wooden body for ultimate aesthetics.',
            'price' => 189.99,
        ]);
        $p1->images()->create(['image_path' => '/storage/products/keyboard.png']);

        $p2 = \App\Models\Product::create([
            'name' => 'AeroSound Pro',
            'description' => 'Professional-grade hybrid active noise cancelling wireless headphones. Equipped with custom-tuned 40mm drivers, ultra-soft memory foam earcups, and an incredible 45-hour battery life.',
            'price' => 299.99,
        ]);
        $p2->images()->create(['image_path' => '/storage/products/headphones.png']);

        $p3 = \App\Models\Product::create([
            'name' => 'GridMat XL',
            'description' => 'Aesthetic topographic oversized desk mat made of heavy-duty acoustic felt. Protects your desk surface while providing a dampening effect that enriches your typing acoustics.',
            'price' => 45.00,
        ]);
        $p3->images()->create(['image_path' => '/storage/products/deskmat.png']);
    }
}
