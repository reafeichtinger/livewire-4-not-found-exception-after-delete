document.addEventListener('alpine:init', () => {
    // Select component
    Alpine.data('select', (id, value, getItems, perPage, searchable, nullable, eager, initialValues) => ({
        // Config
        id: id,
        getItems: getItems,
        perPage: perPage,
        searchable: searchable,
        eager: eager,
        nullable: nullable,
        // State
        items: null,
        loaded: false,
        expanded: false,
        selectedItem: null,
        value: value, // Entangled to livewire
        search: '',
        currentPage: 1,
        focusedIndex: null,
        // Helpers
        popper: null,
        closeLock: null,
        async init() {
            //  Initialize popper for dynamic positioning 
            this.popper = Popper.createPopper(this.$el, document.querySelector(`#${this.id}_popup`), {
                placement: 'bottom',
                strategy: 'absolute',
                modifiers: [{ name: 'flip' }]
            });
            //  Force update needed for proper placement 
            this.$nextTick(() => setTimeout(() => this.popper.forceUpdate(), 0));
            //  Update the selectedItem when the value change
            this.$watch('value', (newValue, oldValue) => {
                this.selectedItem = this.items?.find(i => i.value == this.value) ?? null;
            });
            // Make sure focus stays inside the paginated items
            this.$watch('paginateItems', () => {
                this.currentPage = this.currentPage > this.totalPages ? this.totalPages : this.currentPage;
                this.focusedIndex = this.focusedIndex != null ?
                    (this.focusedIndex >= this.paginateItems.length ? this.paginateItems.length - 1 : this.focusedIndex) :
                    null;
            });
            //  Listen for events that manually set the data 
            window.addEventListener(`update_${this.id}`, function (event) {
                const ctx = Alpine.$data(document.getElementById(event.type.replace('update_', '')));
                // Abort if alpine component couldn't be found or no data provided
                if (!ctx || (!event.detail.options && !event.detail.value)) { return; }
                // Set options if provided 
                if (event.detail.options) {
                    ctx.items = event.detail.options;
                    ctx.selectedItem = ctx.items?.find(i => i.value == ctx.value) ?? null;
                    ctx.loaded = true;
                }
            });
            if (!this.eager) {
                //  Set the initially selected items
                this.items = initialValues ?? [];
                this.selectedItem = this.items?.length ? this.items[0] : null;
            } else if (this.getItems) {
                // Callback to resolve items, either returns an array of items or dispatches the update_ event
                this.items = await Promise.resolve(this.getItems()) ?? this.items;
                // Make sure selectedItem is set
                this.selectedItem = this.items?.find(i => i.value == this.value) ?? null;
                // Set loaded state
                this.loaded = true;
            }
        },
        //  Actions 
        async open() {
            this.expanded = true;
            setTimeout(async () => {
                // Prevent reopening directly after closing
                if (!this.closeLock) { document.querySelector(this.searchable ? `#${this.id}_search` : `#${this.id}_popup>div`).focus(); }
                // Make sure popper is positioned correctly
                this.popper.forceUpdate();
                // Fetch items if not loaded yet
                if (!this.loaded) {
                    // Callback to resolve items, either returns an array of items or dispatches the update_ event
                    this.items = await Promise.resolve(this.getItems()) ?? this.items;
                    // Set loaded state
                    this.loaded = true;
                    // Make sure popper is positioned correctly
                    this.$nextTick(() => setTimeout(() => this.popper.forceUpdate(), 0));
                }
            }, 0);
        },
        close() {
            this.expanded = false;
            this.focusedIndex = null;
            this.search = null;
            // Set a temporary lock in order to prevent opening immediately after closing
            this.closeLock = setTimeout(() => this.closeLock = null, 50);
        },
        selectItem(item) {
            // Don't allow nullable selection if not expanded
            if (!this.expanded || (!this.nullable && item == null) || (!this.nullable && item == 'focusedIndex' && (this.focusedIndex == -1 || this.focusedIndex == null))) { return; }
            // Focus the select button
            document.querySelector(`#${this.id}`).focus()
            if (item == 'focusedIndex') {
                // If added via focus, set to focused item
                this.value = this.paginateItems[this.focusedIndex]?.value ?? null;
            } else {
                // Otherwise set to the provided item
                this.value = item?.value ?? null;
            }
            // Make sure the selectedItem is set properly, watcher doesn't always fire here
            this.selectedItem = this.items?.find(i => i.value == this.value) ?? null;
            // Announce for screen readers and close
            this.ariaAnnounceSelection();
            this.close();
        },
        firstPage() {
            this.currentPage = 1;
            document.querySelector(this.searchable ? `#${this.id}_search` : `#${this.id}_popup>div`).focus();
        },
        nextPage() {
            this.currentPage = this.clampPage(this.currentPage + 1);
            document.querySelector(this.searchable ? `#${this.id}_search` : `#${this.id}_popup>div`).focus();
        },
        prevPage() {
            this.currentPage = this.clampPage(this.currentPage - 1);
            document.querySelector(this.searchable ? `#${this.id}_search` : `#${this.id}_popup>div`).focus();
        },
        lastPage() {
            this.currentPage = this.totalPages;
            document.querySelector(this.searchable ? `#${this.id}_search` : `#${this.id}_popup>div`).focus();
        },
        //  Accessibility 
        ariaFocusNext() {
            const total = this.paginateItems.length;
            if (!total) return;

            const start = 0;
            this.focusedIndex = (((this.focusedIndex ?? (start - 1)) - start + 1) % total) + start;

            document.querySelector(this.focusedIndex === -1 ? `#${this.id}_item_null` :
                `#${this.id}_item_` + (this.paginateItems[this.focusedIndex]?.value ?? 0)
            )?.scrollIntoView({ block: 'nearest' });
        },
        ariaFocusPrev() {
            const total = this.paginateItems.length;
            if (!total) return;

            const start = 0;
            this.focusedIndex = (((this.focusedIndex ?? start) - start - 1 + total) % total) + start;

            document.querySelector(this.focusedIndex === -1 ? `#${this.id}_item_null` :
                `#${this.id}_item_` + (this.paginateItems[this.focusedIndex]?.value ?? 0)
            )?.scrollIntoView({ block: 'nearest' });
        },
        ariaAnnounceSelection() {
            this.$nextTick(() => {
                document.querySelector(`#${this.id}_selected`)?.setAttribute('aria-live', 'assertive');
                setTimeout(() => document.querySelector(`#${this.id}_selected`)?.setAttribute('aria-live', 'off'), 1000);
            });
        },
        //  Pagination getters 
        get totalPages() {
            const perPage = Math.max(1, Math.floor(this.perPage));
            const totalItems = Math.max(0, this.filteredItems.length);
            return Math.max(1, Math.ceil(totalItems / perPage));
        },
        get filteredItems() {
            if (this.items === null) return [];
            const items = this.items;
            const search = (this.search || '').toLowerCase().trim();
            if (!search) { return items; }

            const result = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const group = item.group;
                const label = item.label;
                const value = item.value;
                const tooltip = item.tooltip;

                if ((group && group.length >= search.length && group.toLowerCase().includes(search)) ||
                    (label && label.length >= search.length && label.toLowerCase().includes(search)) ||
                    (tooltip && tooltip.length >= search.length && tooltip.toLowerCase().includes(search)) ||
                    (value && value.length >= search.length && value.toLowerCase().includes(search))) {
                    result.push(item);
                }
            }
            return result;
        },
        get paginateItems() {
            if (this.items === null) return [];
            const perPage = Math.max(1, Math.floor(this.perPage));
            const currentPage = Math.max(1, Math.floor(this.currentPage));
            const start = (currentPage - 1) * perPage;

            return this.filteredItems.slice(start, start + perPage);
        },
        //  Helpers 
        clampPage(page) { return Math.min(Math.max(1, Math.floor(page)), this.totalPages); },
        formatTooltip(item, withGroup = false) {
            const label = (item.tooltip ?? item.label ?? item.value) || '';
            if (!withGroup) return label;
            const group = item.group ? `╰┈➤ ( ${item.group} )` : '';
            return `${label}\n${group}`.trim();
        },
    }));
});