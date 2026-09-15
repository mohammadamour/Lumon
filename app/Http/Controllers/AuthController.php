<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ── Login ──

    public function showLogin()
    {
        return inertia('Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    // ── Register ──

    public function showRegister()
    {
        return inertia('Register');
    }

    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:buyer,seller',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => $fields['role'],
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }

    // ── Logout ──

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    // ── One-Click Demo Access ──

    public function demoLogin(Request $request)
    {
        $request->validate([
            'role' => 'required|in:buyer,seller',
        ]);

        $email = $request->role === 'seller'
            ? 'seller@lumon.demo'
            : 'buyer@lumon.demo';

        $user = User::where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Demo account not found. Please run: php artisan migrate:fresh --seed'],
            ]);
        }

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }
}
