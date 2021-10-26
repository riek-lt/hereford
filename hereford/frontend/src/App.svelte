<script>
  import { apiHandler } from './modules/apiHelpers';
  import { clamp } from './modules/utils';
  import { currentDeck, settings } from './store';

  import logo from './logo.png';
  import { onMount } from 'svelte';
  import SettingsMenu from './components/SettingsMenu.svelte';
  import Collapsable from './components/Collapsable.svelte';

  let marathonUrl = '';
  let deckIndex = 0;
  let jumpIndex = 0;
  let settingsOpen = false;

  let marathonData;

  // TODO rename to update files?
  // TODO make some of these awaits promise all?
  // write current run to files
  async function writeFiles() {
    // current run
    for (let i = 0; i < 4; i++) {
      if ($currentDeck[deckIndex].runners[i]) {
        await window.backend.writeFile(
          `herefordFiles/runner${i}.txt`,
          $currentDeck[deckIndex].runners[i]
        );
      } else {
        // clear file if no runner
        await window.backend.writeFile(`herefordFiles/runner${i}.txt`, '');
      }
    }

    await window.backend.writeFile(
      'herefordFiles/game.txt',
      $currentDeck[deckIndex].game
    );
    await window.backend.writeFile(
      'herefordFiles/category.txt',
      $currentDeck[deckIndex].category
    );

    // TODO convert estimate to real time while fetching api/before write
    if ($currentDeck[deckIndex].estimate) {
      await window.backend.writeFile(
        'herefordFiles/estimate.txt',
        $currentDeck[deckIndex].estimate
      );
    }

    // upcomming runs
    // loop from 1 to 4
    for (let i = 1; i <= 4; i++) {
      if ($currentDeck[deckIndex + i]) {
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}category.txt`,
          $currentDeck[deckIndex + i]?.category
        );
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}game.txt`,
          $currentDeck[deckIndex + i].game
        );
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}runners.txt`,
          $currentDeck[deckIndex + i].runners.join(', ')
        );
      } else {
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}category.txt`,
          ''
        );
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}game.txt`,
          ''
        );
        await window.backend.writeFile(
          `herefordFiles/upcomming/${i}runners.txt`,
          ''
        );
      }
    }
  }

  let settingJson = {};

  onMount(async () => {
    // on app start
    await window.backend.fileSetup();

    settingJson = JSON.parse(
      await window.backend.readFile('herefordFiles/settings.json')
    );

    if (
      settingJson &&
      Object.keys(settingJson).length !== 0 &&
      Object.getPrototypeOf(settingJson) === Object.prototype
    ) {
      settings.set(settingJson);
    }
  });
</script>

<header>
  <img src={logo} alt="logo" />
  <h1>hereford</h1>
</header>

<main>
  <div
    class="settingButton"
    on:click={() => {
      settingsOpen = !settingsOpen;
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><circle cx="12" cy="12" r="3" /><path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      /></svg
    >
  </div>

  <div>
    <label for="marathonUrl">Marathon url / slug</label>
    <div class="marathonUrl">
      <input id="marathonUrl" type="text" bind:value={marathonUrl} />
      <button
        on:click={async () => {
          marathonData = await apiHandler(marathonUrl);
        }}>Fetch url</button
      >
    </div>
  </div>

  <h2>current run:</h2>
  {#if $currentDeck[deckIndex] && !$currentDeck[deckIndex].category}
    <p>This is probably a setup block</p>
    <p><span>Game </span>{$currentDeck[deckIndex].game}</p>
  {:else if $currentDeck.length > 0}
    <p><span>Game </span>{$currentDeck[deckIndex].game}</p>
    <p><span>Category </span>{$currentDeck[deckIndex].category}</p>
    <p><span>Runner(s) </span>{$currentDeck[deckIndex].runners.join(', ')}</p>

    <!-- <pre>
      { JSON.stringify($currentDeck[deckIndex], undefined, 2) }
	  </pre> -->
  {:else}
    <p>No deck detected</p>
  {/if}

  <div>
    <button
      on:click={() => {
        if ($currentDeck.length > 0) {
          deckIndex > 0 ? deckIndex-- : 0;
          writeFiles();
        }
      }}>Previous run</button
    >
    <button
      on:click={() => {
        if ($currentDeck.length > 0) {
          deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
          writeFiles();
        }
      }}>Next run</button
    >

    <button
      on:click={() => {
        deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
      }}>Silent next run</button
    >
  </div>

  <div>
    <label for="jumpIndex">Jump to index</label>
    <div>
      <input id="jumpIndex" type="number" bind:value={jumpIndex} />
      <button
        on:click={() => {
          deckIndex = clamp(0, $currentDeck.length - 1, jumpIndex);
          writeFiles();
        }}>Jump to run</button
      >
    </div>
  </div>

  <Collapsable label="advanced">
    <div class="options--advanced">
      <button
        on:click={() => {
          deckIndex = clamp(0, $currentDeck.length - 1, jumpIndex);
        }}>Silent jump to run</button
      >

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
  </Collapsable>

  <!-- | n | Continues to the **next** run | -->
  <!-- | p | Goes back to the **previous** run | -->
  <!-- | j | makes you **jump** and write to a certain run (more info below) | -->
  <!-- | sj | **Silent jump**, jumps to a certain run, but doesn't write to files (more info below) | -->
  <!-- | sn | **Silent next**, does a "next" to the next run, without writing to files | -->
  <!-- | s | Go back to the **start** of the marathon | -->
  <!-- | u | Makes you **reload**. Handy for when new runs got added. | -->
  <!-- | nd | Loads in the **next deck**. | -->

  <SettingsMenu
    open={settingsOpen}
    on:close={() => {
      settingsOpen = false;
    }}
  />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 24px;

    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    line-height: 1.5;
    font-size: 18px;
  }

  :global(input) {
    background: none;

    padding: 5px 11px;
    border: 1px solid #000;
    border-radius: 4px;
  }

  :global(button) {
    padding: 6px 12px;
    background-color: #11fda9;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  :global(button:hover) {
    background-color: #01e393;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin-top: 0;
  }

  header {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-bottom: 1.25rem;
  }

  header img {
    height: 3rem;
    width: auto;

    margin-right: 16px;
  }

  .marathonUrl {
    max-width: 786px;
  }

  .marathonUrl input {
    width: 80%;
    margin-right: 12px;
  }

  .settingButton {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
  }

  @media (prefers-reduced-motion: no-preference) {
  }
</style>
