<script lang="ts">
  import { reveal, trackSection } from '$lib/actions/intersection';
  import { typingPhrases } from '$lib/data/content';
  import type { SectionChangeHandler } from '$lib/types';
  import TypingText from '$lib/components/TypingText.svelte';

  let { onSectionChange }: { onSectionChange: SectionChangeHandler } = $props();
</script>

<section
  id="home"
  class="hero"
  use:trackSection={{ id: 'home', onChange: onSectionChange }}
>
  <div class="hero-bg" aria-hidden="true">
    <div class="shape"></div>
    <div class="shape"></div>
    <div class="shape"></div>
  </div>

  <div class="container hero-content reveal" use:reveal>
    <p class="hero-greeting"> H e l l o , I ' m</p>
    <h1>Philip Ndei Muriuki</h1>
    <p class="hero-tagline"><TypingText phrases={typingPhrases} /></p>
    <p class="hero-description">
      ICT Management professional with hands-on experience in technical support, systems
      administration, and IT service delivery. I combine technical logic with user-centred
      support to deliver reliable IT solutions.
    </p>
    <div class="hero-buttons">
      <a href="#projects" class="btn btn-primary">View Projects</a>
      <a href="#contact" class="btn btn-secondary">Contact Me</a>
    </div>
  </div>
</section>
