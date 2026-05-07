<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // GET /api/clients?search=...
    public function index(Request $request)
    {
        $query = Client::withCount('commandes');

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('nom_complet', 'like', "%$q%")
                   ->orWhere('telephone', 'like', "%$q%")
                   ->orWhere('email', 'like', "%$q%");
            });
        }

        return response()->json(
            $query->orderBy('nom_complet')->paginate(20)
        );
    }

    // GET /api/clients/{id}
    public function show(Client $client)
    {
        $client->load(['commandes' => function ($q) {
            $q->orderBy('created_at', 'desc')->limit(10);
        }]);

        return response()->json($client);
    }

    // POST /api/clients
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_complet' => 'required|string|max:150',
            'telephone'   => 'nullable|string|max:30',
            'email'       => 'nullable|email|max:150',
            'adresse'     => 'nullable|string',
        ]);

        $client = Client::create($data);

        return response()->json($client, 201);
    }

    // PUT /api/clients/{id}
    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'nom_complet' => 'sometimes|required|string|max:150',
            'telephone'   => 'nullable|string|max:30',
            'email'       => 'nullable|email|max:150',
            'adresse'     => 'nullable|string',
        ]);

        $client->update($data);

        return response()->json($client);
    }

    // DELETE /api/clients/{id}
    public function destroy(Client $client)
    {
        if ($client->commandes()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un client ayant des commandes.',
            ], 422);
        }

        $client->delete();

        return response()->json(null, 204);
    }
}