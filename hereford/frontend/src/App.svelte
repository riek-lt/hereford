<script>
  import { apiHandler } from './modules/apiHelpers';

  // import HelloWorld from './components/HelloWorld.svelte';
  import logo from './logo.png';
  import { onMount } from 'svelte';
  import SettingsMenu from './components/SettingsMenu.svelte';

  import { currentDeck } from './store';

  let marathonData = {};

  let marathonUrl = '';

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

  <h2>current deck:</h2>
  <pre>
		{ JSON.stringify($currentDeck, undefined, 2) }
	</pre>

  <!-- move some of these to advanced dropdown? -->
  <button on:click={() => {}}>Next run</button>
  <button on:click={() => {}}>Previous run</button>
  <button on:click={() => {}}>Jump to run</button>
  <button on:click={() => {}}>Silent jump to run</button>
  <button on:click={() => {}}>Silent next run</button>
  <button on:click={() => {}}>Back to start</button>
  <button on:click={() => {}}>reload runs</button>
  <button on:click={() => {}}>Load next deck</button>

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
