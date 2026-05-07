<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'pseudo'   => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('pseudo', $request->pseudo)
                    ->where('actif', true)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'pseudo' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => [
                'id'         => $user->id,
                'nom_complet'=> $user->nom_complet,
                'pseudo'     => $user->pseudo,
                'role'       => $user->role,
            ],
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => [
                'id'          => $request->user()->id,
                'nom_complet' => $request->user()->nom_complet,
                'pseudo'      => $request->user()->pseudo,
                'role'        => $request->user()->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }
}