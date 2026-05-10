<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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
}