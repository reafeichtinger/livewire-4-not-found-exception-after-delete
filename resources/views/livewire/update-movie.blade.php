<div class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg px-4 py-3">
    <h1
        class="flex items-center gap-3 font-bold leading-snug tracking-normal text-slate-800 mx-auto my-6 w-full text-2xl lg:max-w-3xl lg:text-4xl">
        Update {{ $this->movie->name }}
    </h1>

    {{-- Actions --}}
    <div class="mt-6 pt-3 border-t border-gray-300 w-full flex flex-row items-center justify-end">
        <button wire:click="deleteMovie"
            class="cursor-pointer rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white font-medium transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button">
            Delete
        </button>
        <button disabled
            class="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white font-medium transition-all shadow-md hover:shadow-lg focus:bg-indigo-700 focus:shadow-none active:bg-indigo-700 hover:bg-indigo-700 active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed ml-2"
            type="button">
            Update
        </button>
    </div>
</div>
