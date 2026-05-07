<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\VersementController;
use Illuminate\Support\Facades\Route;

// Auth — sans middleware
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Auth — avec middleware
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Ressources protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('commandes', CommandeController::class);
    Route::patch('commandes/{commande}/statut', [CommandeController::class, 'changerStatut']);

    // Versements (nested sous commande)
    Route::get('commandes/{commande}/versements', [VersementController::class, 'index']);
    Route::post('commandes/{commande}/versements', [VersementController::class, 'store']);
    Route::delete('commandes/{commande}/versements/{versement}', [VersementController::class, 'destroy']);
});