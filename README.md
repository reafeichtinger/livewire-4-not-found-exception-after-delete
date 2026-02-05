# Repository to reproduce 404 error when deleting a model from livewire.

This repository reproduces [this issue](https://github.com/livewire/livewire/discussions/9804#discussioncomment-15682052).

## Setup

Set this up like any other laravel project.

1. Clone the repository `git clone git@github.com:reafeichtinger/livewire-4-not-found-exception-after-delete.git`.
2. Move into the project folder `cd livewire-4-not-found-exception-after-delete`.
3. Install dependencies `composer install && npm i`.
4. Create .env file `cp .env.example .env`.
5. Generate app key `php artisan key:generate`.
6. Setup your database connection in the .env file.
7. Run the migration `php artisan migrate`.
8. Seed the database `php artisan db:seed`.
9. Run the project `composer dev`.

## Reproducing the issue

Open the project, you should see a table with entries. Click the "Edit" button on any of them to get to the details page. On the details page click the "Delete" button. You should see a 404 error popup.

## When this happens

This seems to happen when Laravel route model binding is used in combination with having at least one `#[Modelable]` child component in livewire.

```php
// app/Http/Controllers/MovieController.php

/* NOTE: We are using model binding here. */
public function update(Movie $movie): mixed
{
    return view('update-movie-view', ['movieId' => $movie->id]);
}
```
```php
// app/Http/Livewire/UpdateMovie.php

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
```
```blade
{{-- resources/views/livewire/update-movie.blade.php --}}

<div class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg px-4 py-3">
   ...

    {{-- NOTE: Any child component that is modeled to via #[Modelable] --}}
    <livewire:child wire:model="name" />

    {{-- Actions --}}
    <div class="mt-6 pt-3 border-t border-gray-300 w-full flex flex-row items-center justify-end">
        <button wire:click="deleteMovie"
            class="cursor-pointer rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white font-medium transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button">
            Delete
        </button>
        ...
    </div>
</div>
```

```php
// resources/views/components/⚡child.blade.php

new class extends Component {
    #[Modelable]
    public mixed $value = null;
};
?>

<div>
    {{-- When there is no desire, all things are at peace. - Laozi --}}
</div>

```

## A workaround

In order to prevent this bug from happening the route binding needs to be removed. Just making this change leads to the delete redirecting as expected without 404.

```php
// app/Http/Controllers/MovieController.php

/* NOTE: Don't use the model class here, instead only use int|string */
public function update(int|string $movie): mixed
{
    return view('update-movie-view', ['movieId' => $movie]);
}
```

## Takeaways

This might not be strictly related to Livewire 4. I am currently experiencing this in a quite big (~350 routes) project and it would be a pain to change the route bining for every page, especially since I rely on the models for permission checks and I need the models data outside of the livewire component as well. If there is something on the livewire side that can prevent this from happening this would be the ideal solution.
