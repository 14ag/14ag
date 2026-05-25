<script lang="ts">
  import { onMount } from 'svelte';

  let { phrases }: { phrases: string[] } = $props();

  let text = $state('');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function schedule(delay: number) {
    timer = setTimeout(tick, delay);
  }

  function tick() {
    const current = phrases[phraseIndex] || '';

    if (!current) {
      return;
    }

    if (!deleting) {
      text = current.substring(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === current.length) {
        deleting = true;
        schedule(1800);
        return;
      }

      schedule(70);
      return;
    }

    text = current.substring(0, Math.max(charIndex - 1, 0));
    charIndex -= 1;

    if (charIndex <= 0) {
      deleting = false;
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    schedule(40);
  }

  onMount(() => {
    tick();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  });
</script>

<span id="typing-text">{text}</span><span class="cursor" aria-hidden="true"></span>
