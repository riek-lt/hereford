<script>
  // get these values from settings file if there is one
  let time = 'h:mm:ss',
    game = 'Game',
    category = 'Category',
    console = 'Console',
    runners = 'Runners';
</script>

<div>
  <label for="time">Time format</label>
  <input id="time" type="text" bind:value={time} />

  <p>translations</p>

  <label for="game">Game</label>
  <input id="game" type="text" bind:value={game} />

  <label for="category">Category</label>
  <input id="category" type="text" bind:value={category} />

  <label for="console">Console</label>
  <input id="console" type="text" bind:value={console} />

  <label for="runners">Runners</label>
  <input id="runners" type="text" bind:value={runners} />

  <button
    on:click={() => {
      const settings = {
        time,
        game,
        category,
        console,
        runners,
      };

      const fileName = 'herefordFiles/settings.json';
      window.backend.writeFile(fileName, JSON.stringify(settings));
    }}>Save settings</button
  >
</div>

<style></style>
