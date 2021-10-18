import { writable } from 'svelte/store';

export const deckIndex = writable(0);
export const currentDeck = writable([]);
export const settings = writable({
  time: 'h:mm:ss',
  game: 'Game',
  category: 'Category',
  console: 'Console',
  runners: 'Runners',
});
