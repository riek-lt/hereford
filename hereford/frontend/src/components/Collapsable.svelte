<script>
  export let label = '';
  export let open = false;
</script>

<div class="collapsible">
  <div class="collapsible__header">
    <label for="col-check">
      <span>{label}</span>

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
        class="feather feather-chevron-down"
        ><polyline points="6 9 12 15 18 9" /></svg
      ></label
    >

    <input id="col-check" type="checkbox" bind:checked={open} />
  </div>

  {#if open}
    <div class="collapsible__content">
      <slot />
    </div>
  {/if}
</div>

<style>
  label {
    display: flex;
    align-items: center;
  }

  label span {
    margin-right: 1rem;
  }

  input[type='checkbox'] {
    display: none;
  }
</style>
