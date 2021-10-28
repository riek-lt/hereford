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
  let silentJumpIndex = 0;
  let settingsOpen = false;

  let previousMarathon = false;

  import { readable } from 'svelte/store';
  import Modal from './components/Modal.svelte';
  // export const network = readable({
  //   fetchApi: window.backend.fetchApi,
  // });

  export const fileSystem = readable({
    createFile: window.backend.createFile,
    deleteFile: '',
    writeFile: window.backend.writeFile,
    readFile: window.backend.readFile,
  });

  // TODO write marathon data to local file?

  // TODO make some of these awaits promise all
  // write current run to files
  async function updateFiles() {
    // current run
    for (let i = 0; i < 4; i++) {
      if ($currentDeck[deckIndex].runners[i]) {
        await $fileSystem.writeFile(
          `herefordFiles/runner${i}.txt`,
          $currentDeck[deckIndex].runners[i]
        );
      } else {
        // clear file if no runner
        await $fileSystem.writeFile(`herefordFiles/runner${i}.txt`, '');
      }
    }

    await $fileSystem.writeFile(
      'herefordFiles/game.txt',
      $currentDeck[deckIndex].game
    );
    await $fileSystem.writeFile(
      'herefordFiles/category.txt',
      $currentDeck[deckIndex].category
    );

    // TODO convert estimate to real time while fetching api/before write
    if ($currentDeck[deckIndex].estimate) {
      await $fileSystem.writeFile(
        'herefordFiles/estimate.txt',
        $currentDeck[deckIndex].estimate
      );
    }

    // upcomming runs
    // loop from 1 to 4
    for (let i = 1; i <= 4; i++) {
      if ($currentDeck[deckIndex + i]) {
        await $fileSystem.writeFile(
          `herefordFiles/upcomming/${i}category.txt`,
          $currentDeck[deckIndex + i]?.category
        );
        await $fileSystem.writeFile(
          `herefordFiles/upcomming/${i}game.txt`,
          $currentDeck[deckIndex + i].game
        );
        await $fileSystem.writeFile(
          `herefordFiles/upcomming/${i}runners.txt`,
          $currentDeck[deckIndex + i].runners.join(', ')
        );
      } else {
        await $fileSystem.writeFile(
          `herefordFiles/upcomming/${i}category.txt`,
          ''
        );
        await $fileSystem.writeFile(`herefordFiles/upcomming/${i}game.txt`, '');
        await $fileSystem.writeFile(
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

    let fileSettings = await $fileSystem.readFile(
      'herefordFiles/settings.json'
    );

    if (fileSettings) {
      settingJson = JSON.parse(fileSettings);

      if (Object.keys(settingJson).length !== 0) {
        settings.set(settingJson);
      }
    }

    if ($settings.marathonUrl) {
      // prompt user
      previousMarathon = true;
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
          await apiHandler(marathonUrl);
          $settings.marathonUrl = marathonUrl;

          $fileSystem.writeFile(
            'herefordFiles/settings.json',
            JSON.stringify($settings)
          );
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
    <p>No marathon detected</p>
  {/if}

  <Modal open={previousMarathon}>
    <div class="previousMarathon">
      <p>Found a previous marathon, want to load it?</p>

      <button
        on:click={async () => {
          // load marathon
          await apiHandler($settings.marathonUrl);

          previousMarathon = false;
        }}>load previous marathon</button
      >
      <button
        on:click={() => {
          previousMarathon = false;
        }}>new marathon</button
      >
    </div>
  </Modal>

  <div class="optionButtons">
    <div>
      <button
        on:click={() => {
          if ($currentDeck.length > 0) {
            deckIndex > 0 ? deckIndex-- : 0;
            updateFiles();
          }
        }}>Previous run</button
      >
      <button
        on:click={() => {
          if ($currentDeck.length > 0) {
            deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
            updateFiles();
          }
        }}>Next run</button
      >

      <button
        on:click={() => {
          deckIndex < $currentDeck.length ? deckIndex++ : $currentDeck.length;
        }}>Silent next run</button
      >
    </div>
  </div>

  <div class="jumpIndex">
    <div>
      <input id="jumpIndex" type="number" bind:value={jumpIndex} />
      <button
        on:click={() => {
          deckIndex = clamp(0, $currentDeck.length - 1, jumpIndex);
          updateFiles();
        }}>Jump to run</button
      >
    </div>
  </div>

  <Collapsable label="advanced">
    <div class="optionButtons options--advanced">
      <div class="jumpIndex">
        <div class="buttonSection">
          <button
            on:click={() => {
              deckIndex = 0;
            }}>Back to start</button
          >
          <button
            on:click={async () => {
              await apiHandler(marathonUrl);
            }}>reload runs</button
          >
        </div>

        <div>
          <input id="jumpIndex" type="number" bind:value={silentJumpIndex} />
          <button
            on:click={() => {
              deckIndex = clamp(0, $currentDeck.length - 1, silentJumpIndex);
            }}>Silent jump to run</button
          >
        </div>
      </div>
    </div>
  </Collapsable>

  <Modal
    open={settingsOpen}
    on:close={() => {
      settingsOpen = false;
    }}
  >
    <SettingsMenu />
  </Modal>
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

    margin-right: 12px;
  }

  :global(button:hover) {
    background-color: #01e393;
  }

  .optionButtons {
    display: flex;
    flex-direction: column;

    margin-bottom: 12px;
  }

  .buttonSection {
    margin-bottom: 12px;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin-top: 0;
  }

  p,
  label {
    margin-bottom: 8px;
  }

  .jumpIndex {
    margin-bottom: 8px;
  }

  .jumpIndex input {
    width: 32px;
    margin-right: 8px;
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

    cursor: pointer;
  }

  @media (prefers-reduced-motion: no-preference) {
  }
</style>
