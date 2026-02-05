<?php

namespace App\Http\Livewire;

use App\Models\Movie;
use Illuminate\Support\Collection;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Locked;
use Livewire\Attributes\Renderless;
use Livewire\Component;
use ReflectionClass;

class UpdateMovie extends Component
{
    #[Locked]
    public ?int $movieId = null;

    public ?int $parentId = null;

    public function mount(?int $movieId = null): void
    {
        $this->movieId = $movieId;
    }

    #[Computed]
    public function movie(): ?Movie
    {
        return Movie::find($this->movieId);
    }

    #[Computed]
    public function movies(): Collection
    {
        return Movie::get()->map(fn ($m) => ['value' => $m->id, 'label' => $m->name])->values();
    }

    /**
     * Check if a computed property with the given name exists on this component.
     */
    public function hasComputed(string $property): bool
    {
        $reflection = new ReflectionClass($this);
        foreach ($reflection->getMethods() as $method) {
            if ($method->getName() === $property &&
                count($method->getAttributes(Computed::class)) > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get a computed property if it exists. Useful for JS access.
     */
    #[Renderless]
    public function getComputed(string $property): mixed
    {
        return $this->hasComputed($property) ? ($this->{$property} ?? null) : null;
    }

    public function deleteMovie(): mixed
    {
        $this->movie->delete();
        flashSuccess('The movie was deleted successfully.');

        return redirect()->route('paginate-movies');
    }
}
