<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/agents
    public function index()
    {
        $agents = User::withCount('commandes')
            ->orderBy('nom_complet')
            ->get();

        return response()->json($agents);
    }

    // POST /api/agents
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_complet' => 'required|string|max:150',
            'pseudo'      => 'required|string|max:50|unique:users,pseudo',
            'password'    => 'required|string|min:6',
            'role'        => 'required|in:AGENT,ADMIN',
        ]);

        $agent = User::create($data);

        return response()->json($agent, 201);
    }

    // PUT /api/agents/{id}
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nom_complet' => 'sometimes|required|string|max:150',
            'pseudo'      => "sometimes|required|string|max:50|unique:users,pseudo,{$user->id}",
            'password'    => 'nullable|string|min:6',
            'role'        => 'sometimes|in:AGENT,ADMIN',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user);
    }

    // PATCH /api/agents/{id}/toggle
    public function toggle(User $user)
    {
        $user->update(['actif' => !$user->actif]);
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'nom_complet'      => 'sometimes|required|string|max:150',
            'pseudo'           => "sometimes|required|string|max:50|unique:users,pseudo,{$user->id}",
            'password'         => 'nullable|string|min:6|confirmed',
            'current_password' => 'required_with:password|string',
        ]);

        if (!empty($data['password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect.',
                    'errors'  => ['current_password' => ['Mot de passe actuel incorrect.']],
                ], 422);
            }
        }

        $user->update([
            'nom_complet' => $data['nom_complet'] ?? $user->nom_complet,
            'pseudo'      => $data['pseudo']      ?? $user->pseudo,
            'password'    => $data['password']    ?? $user->password,
        ]);

        return response()->json($user->fresh());
    }
}