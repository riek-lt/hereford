<script>
  import { settings } from '../store';

  export let open;

  // get these values from settings file if there is one
  let time = 'h:mm:ss';
</script>

{#if open}
  <div class="settings">
    <!-- add close button -->
    <h3>settings</h3>

    <label for="time">Time format</label>
    <input id="time" type="text" bind:value={time} />

    <p>translations</p>

    <div>
      <label for="game">Game</label>
      <input id="game" type="text" bind:value={$settings.game} />
    </div>

    <div>
      <label for="category">Category</label>
      <input id="category" type="text" bind:value={$settings.category} />
    </div>

    <div>
      <label for="console">Console</label>
      <input id="console" type="text" bind:value={$settings.console} />
    </div>

    <div>
      <label for="runners">Runners</label>
      <input id="runners" type="text" bind:value={$settings.runners} />
    </div>

    <button
      on:click={() => {
        const fileName = 'herefordFiles/settings.json';
        window.backend.writeFile(fileName, JSON.stringify($settings));
      }}>Save settings</button
    >
  </div>

  <!-- option to disable upcomming updates -->
{/if}

<style>
  .settings {
    box-sizing: border-box;

    position: absolute;
    width: 80%;
    height: 80%;

    top: 10%;
    left: 10%;

    background-color: #fff;

    padding: 1.5rem;

    border-radius: 0.25rem;
    border: 2px solid #000;
  }

  .settings p {
    margin-bottom: 8px;
  }

  .settings > div {
    margin-bottom: 12px;
  }
</style>
