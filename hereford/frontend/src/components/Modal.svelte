<script>
  import { createEventDispatcher } from 'svelte';
  export let open;

  function handleKeydown(event) {
    let key = event.key;

    if (key == 'Escape') {
      closeModal();
    }
  }

  function closeModal() {
    open = false;
    dispatch('close', {});
  }

  const dispatch = createEventDispatcher();
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="bg" on:click={closeModal}>
    <div class="modal" on:click|stopPropagation>
      <svg
        on:click={closeModal}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="close"
        ><line x1="18" y1="6" x2="6" y2="18" /><line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        /></svg
      >

      <slot />
    </div>
  </div>
{/if}

<style>
  .bg {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal {
    position: relative;
    width: 640px;
    max-width: 100%;
    max-height: 100%;

    margin: 32px auto;
    padding: 16px;

    color: black;
    border-radius: 4px;
    background: white;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;

    cursor: pointer;
  }
</style>
