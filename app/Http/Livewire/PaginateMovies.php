<?php

namespace App\Http\Livewire;

use App\Models\Movie;
use Illuminate\Pagination\LengthAwarePaginator;
use Livewire\Attributes\Computed;
use Livewire\Component;

class PaginateMovies extends Component
{
    #[Computed]
    public function movies(): LengthAwarePaginator
    {
        return Movie::paginate(10);
    }
}
