<?php

namespace App\Http\Livewire;

use App\Models\Movie;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Locked;
use Livewire\Component;

class UpdateMovie extends Component
{
    #[Locked]
    public ?int $movieId = null;

    public function mount(?int $movieId = null): void
    {
        $this->movieId = $movieId;
    }

    #[Computed]
    public function movie(): ?Movie
    {
        return Movie::find($this->movieId);
    }

    public function deleteMovie(): mixed
    {
        $this->movie->delete();
        flashSuccess('The movie was deleted successfully.');

        return redirect()->route('paginate-movies');
    }
}
