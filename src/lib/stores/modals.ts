import { writable } from 'svelte/store';

export const showAddBoardModal = writable(false);
export const showAddTaskModal = writable(false);
export const showAddTaskColumnId = writable<string | undefined>();
