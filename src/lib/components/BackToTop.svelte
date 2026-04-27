<script lang="ts">
  import { onMount } from 'svelte';

  let visible = $state(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    const handleScroll = () => {
      visible = window.scrollY > window.innerHeight;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<button
  id="back-to-top"
  class:visible
  class="back-to-top"
  aria-label="Back to top"
  onclick={scrollToTop}
>
  ^
</button>
