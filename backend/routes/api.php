<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\VersementController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\StatistiquesController;
use Illuminate\Support\Facades\Route;

// Auth — sans middleware
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Auth — avec middleware
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::put('me', [UserController::class, 'updateProfile']);
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
    Route::put('/commandes/{commande}/versements/{versement}', [VersementController::class, 'update']);

    // Agents (uniquement pour ADMIN)
    Route::get('agents', [UserController::class, 'index']);
    Route::post('agents', [UserController::class, 'store']);
    Route::put('agents/{user}', [UserController::class, 'update']);
    Route::patch('agents/{user}/toggle', [UserController::class, 'toggle']);

    // Transactions
    Route::get('transactions/stats',       [TransactionController::class, 'stats']);
    Route::get('transactions',             [TransactionController::class, 'index']);
    Route::post('transactions',            [TransactionController::class, 'store']);
    Route::patch('transactions/{transaction}/valider', [TransactionController::class, 'valider']);
    Route::delete('transactions/{transaction}',        [TransactionController::class, 'destroy']);

    // Statistiques
    Route::get('/statistiques/annuelles', [StatistiquesController::class, 'annuelles']);

    // Documents liés à une commande
    Route::prefix('commandes/{commande}')->group(function () {
    Route::get('documents',                      [DocumentController::class, 'index']);
    Route::post('documents/proforma',            [DocumentController::class, 'proforma']);
    Route::post('documents/facture',             [DocumentController::class, 'facture']);
    Route::post('documents/bon-livraison',            [DocumentController::class, 'bonLivraison']);
    Route::get('documents/{document}/telecharger',[DocumentController::class, 'telecharger']);
    });

});