import { writable } from 'svelte/store';

export const showEditTaskSheet = writable<{
	isOpen: boolean;
	taskId?: string;
}>({
	isOpen: false,
});
