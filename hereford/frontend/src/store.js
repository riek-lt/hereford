import { writable } from 'svelte/store';

export const deckIndex = writable(0);
export const currentDeck = writable([]);
