<script>
  import { settings } from '../store';
</script>

<div class="settings">
  <h3>settings</h3>

  <label for="time">Time format</label>
  <input id="time" type="text" bind:value={$settings.time} />

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
<style>
  .settings p {
    margin-bottom: 8px;
  }

  .settings > div {
    margin-bottom: 12px;
  }
</style>
