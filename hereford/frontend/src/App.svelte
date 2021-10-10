<script>
  import { apiHandler } from './modules/apiHelpers';

  // import HelloWorld from './components/HelloWorld.svelte';
  import logo from './logo.png';
  import { onMount } from 'svelte';

  let marathonData = {};

  let marathonUrl = '';

  onMount(async () => {
    await window.backend.fileSetup();
    const fileName = 'herefordFiles/test.txt';
    await window.backend.createFile(fileName);

    await window.backend.writeFile(fileName, 'aaa aaa \n');
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
  <p>sample text</p>

  <pre>
		{ JSON.stringify(marathonData, undefined, 2) }
	</pre>
  <!-- </Modal> -->

  <button>Next run</button>
  <button>Previous run</button>
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
