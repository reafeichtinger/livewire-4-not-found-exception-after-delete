<?php

use App\Http\Controllers\MovieController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MovieController::class, 'paginate'])->name('paginate-movies');
Route::get('/{movie}', [MovieController::class, 'update'])->name('update-movie');
