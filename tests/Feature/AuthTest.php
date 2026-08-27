<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        // Registration should create an account and return a bearer token.
        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'User registered successfully')
            ->assertJsonPath('user.email', 'jane@example.com')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonStructure(['access_token']);

        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
        ]);
    }

    public function test_registration_validates_duplicate_email_and_password_confirmation(): void
    {
        // Existing email addresses and mismatched passwords must be rejected.
        User::factory()->create(['email' => 'jane@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        // A valid email and password should produce an API token.
        User::factory()->create([
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Logged in successfully')
            ->assertJsonPath('user.email', 'jane@example.com')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonStructure(['access_token']);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        // Incorrect credentials must not authenticate the user.
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_view_their_profile(): void
    {
        $user = User::factory()->create();

        // The protected profile endpoint should return the authenticated account.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/user');

        $response->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email);
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = User::factory()->create();
        $newToken = $user->createToken('test-token');
        $token = $newToken->plainTextToken;

        // Logging out should revoke the token that was used for the request.
        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJsonPath('message', 'Logged out successfully');

        // The logout endpoint should remove the token used by the request.
        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $newToken->accessToken->id,
        ]);
    }
}
