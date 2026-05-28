<script lang="ts">
  import { fly } from 'svelte/transition';

  let {
    message,
    visible
  }: {
    message: string;
    visible: boolean;
  } = $props();
</script>

{#if visible}
  <div id="toast" class="toast" aria-live="polite" transition:fly={{ y: 120, duration: 250 }}>
    {message}
  </div>
{/if}
