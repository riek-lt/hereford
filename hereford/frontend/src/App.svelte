<script>
  import { apiHandler } from './modules/apiHelpers';
  import { currentDeck } from './store';

  // import HelloWorld from './components/HelloWorld.svelte';
  import logo from './logo.png';
  import { onMount } from 'svelte';
  import SettingsMenu from './components/SettingsMenu.svelte';

  let marathonData = {};

  let marathonUrl = '';

  let deckIndex = 0;

  let jumpIndex = 0;

  // write current run to files
  async function writeFiles() {
    await window.backend.writeFile(
      'herefordFiles/runner1.txt',
      $currentDeck[deckIndex].runner
    );
    await window.backend.writeFile(
      'herefordFiles/game.txt',
      $currentDeck[deckIndex].game
    );
    await window.backend.writeFile(
      'herefordFiles/category.txt',
      $currentDeck[deckIndex].category
    );
  }

  function clamp(min, max, value) {
    return Math.min(Math.max(value, min), max);
  }

  onMount(async () => {
    await window.backend.fileSetup();
    const fileName = 'herefordFiles/settings.json';
    await window.backend.createFile(fileName);
  });
</script>

<header>
  <h1>hereford</h1>
</header>

<main>
  <p>marathon url</p>
  <input type="text" bind:value={marathonUrl} />
  <button
    on:click={async () => {
      marathonData = await apiHandler(marathonUrl);
    }}>Fetch url</button
  >

  <!-- <img src={logo} class="App-logo" alt="logo" /> -->

  <h2>current run:</h2>
  <pre>
		{ JSON.stringify($currentDeck[deckIndex], undefined, 2) }
	</pre>

  <!-- <h2>deck</h2>
  <pre>
		{ JSON.stringify($currentDeck, undefined, 2) }
	</pre> -->

  <!-- move some of these to advanced dropdown? -->
  <div>
    <button
      on:click={() => {
        deckIndex = deckIndex > 1 ? deckIndex-- : 0;
        writeFiles();
      }}>Previous run</button
    >
    <button
      on:click={() => {
        deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
        writeFiles();
      }}>Next run</button
    >

    <button
      on:click={() => {
        deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
      }}>Silent next run</button
    >
  </div>

  <div>
    <label for="jumpIndex">Jump to index</label><br />
    <input id="jumpIndex" type="number" bind:value={jumpIndex} />
    <button
      on:click={() => {
        deckIndex = clamp(0, $currentDeck.length - 1, jumpIndex);
        writeFiles();
      }}>Jump to run</button
    >

    <button
      on:click={() => {
        deckIndex = clamp(0, $currentDeck.length - 1, jumpIndex);
      }}>Silent jump to run</button
    >
  </div>

  <div>
    <button
      on:click={() => {
        deckIndex = 0;
      }}>Back to start</button
    >
    <button
      on:click={async () => {
        marathonData = await apiHandler(marathonUrl);
      }}>reload runs</button
    >
  </div>
  <!-- <button on:click={() => {}}>Load next deck</button> -->

  <!-- | n | Continues to the **next** run | -->
  <!-- | p | Goes back to the **previous** run | -->
  <!-- | j | makes you **jump** and write to a certain run (more info below) | -->
  <!-- | sj | **Silent jump**, jumps to a certain run, but doesn't write to files (more info below) | -->
  <!-- | sn | **Silent next**, does a "next" to the next run, without writing to files | -->
  <!-- | s | Go back to the **start** of the marathon | -->
  <!-- | u | Makes you **reload**. Handy for when new runs got added. | -->
  <!-- | nd | Loads in the **next deck**. | -->

  <SettingsMenu />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-reduced-motion: no-preference) {
  }
</style>
