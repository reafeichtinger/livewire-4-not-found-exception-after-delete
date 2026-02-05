<div class="relative flex flex-col items-center w-full h-full text-gray-700 bg-white shadow-md rounded-lg overflow-clip">
    <table class="w-full text-left table-auto text-slate-800 ">
        <thead>
            <tr class="text-slate-500 border-b border-slate-300 bg-slate-50 rounded-lg">
                <th class="p-4">
                    <p class="text-sm leading-none font-normal">
                        Name
                    </p>
                </th>
                <th class="p-4">
                    <p class="text-sm leading-none font-normal">
                        Created at
                    </p>
                </th>
                <th class="p-4">
                    <p class="text-sm leading-none font-normal">
                        Updated at
                    </p>
                </th>
                <th class="p-4">
                    <p></p>
                </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($this->movies as $movie)
                <tr class="hover:bg-slate-50">
                    <td class="p-4">
                        <p class="text-sm font-bold">
                            {{ $movie->name }}
                        </p>
                    </td>
                    <td class="p-4">
                        <p class="text-sm">
                            {{ $movie->created_at }}
                        </p>
                    </td>
                    <td class="p-4">
                        <p class="text-sm">
                            {{ $movie->updated_at }}
                        </p>
                    </td>
                    <td class="p-4">
                        <a href="{{ route('update-movie', ['movie' => $movie->id]) }}"
                            class="text-sm font-semibold text-indigo-600 hover:underline">
                            Edit
                        </a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if ($this->movies->hasPages())
        <div class="w-full px-4 border-t border-gray-300 py-2">
            {{ $this->movies->links() }}
        </div>
    @endif
</div>
