import { writable } from 'svelte/store';

export const showAddBoardModal = writable(false);
export const showAddTaskModal = writable<{
	isOpen: boolean;
	columnId?: string;
}>({ isOpen: false });
export const showAddColumnModal = writable<{ isOpen: boolean; order?: number }>(
	{
		isOpen: false,
	}
);
