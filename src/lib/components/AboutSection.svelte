<script lang="ts">
  import { reveal, trackSection } from '$lib/actions/intersection';
  import { aboutParagraphs, aboutStats } from '$lib/data/content';
  import type { SectionChangeHandler } from '$lib/types';
  import Icon from '$lib/components/Icon.svelte';

  let { onSectionChange }: { onSectionChange: SectionChangeHandler } = $props();
</script>

<section
  id="about"
  class="about"
  use:trackSection={{ id: 'about', onChange: onSectionChange }}
>
  <div class="container">
    <div class="section-header reveal" use:reveal>
      <h2>About Me</h2>
      <p>A bit about who I am and what drives me.</p>
    </div>

    <div class="about-content reveal" use:reveal>
      <div class="about-image-wrapper">
        <div class="about-image">
          <img src="/profile.jpg" alt="Philip Muriuki" loading="lazy" />
        </div>
      </div>

      <div class="about-text">
        <h3>Philip Ndei Muriuki</h3>

        {#each aboutParagraphs as paragraph}
          <p>{paragraph}</p>
        {/each}

        <div class="about-stats">
          {#each aboutStats as stat}
            <div class="stat-item">
              <div class="stat-number">{stat.value}</div>
              <div class="stat-label">{stat.label}</div>
            </div>
          {/each}
        </div>

        <a href="/CV.pdf" class="btn btn-primary" download>
          <Icon name="file" size={18} />
          Download CV
        </a>
      </div>
    </div>
  </div>
</section>
