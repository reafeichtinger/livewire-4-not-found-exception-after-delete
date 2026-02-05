<?php

namespace App\Http\Controllers;

use App\Models\Movie;

class MovieController extends Controller
{
    public function paginate(): mixed
    {
        return view('paginate-movies-view');
    }

    public function update(Movie $movie): mixed
    {
        return view('update-movie-view', ['movieId' => $movie->id]);
    }
}
