<script lang="ts">
  import { reveal, trackSection } from '$lib/actions/intersection';
  import { skillCategories } from '$lib/data/content';
  import type { SectionChangeHandler } from '$lib/types';
  import Icon from '$lib/components/Icon.svelte';

  let { onSectionChange }: { onSectionChange: SectionChangeHandler } = $props();
</script>

<section
  id="skills"
  class="skills"
  use:trackSection={{ id: 'skills', onChange: onSectionChange }}
>
  <div class="container">
    <div class="section-header reveal" use:reveal>
      <h2>Skills</h2>
      <p>Technologies and tools I work with.</p>
    </div>

    <div class="skills-grid">
      {#each skillCategories as category}
        <div class="skill-category reveal" use:reveal>
          <h3>
            <span class="cat-icon">
              <Icon name={category.icon} size={22} />
            </span>
            {category.title}
          </h3>

          <div class="skill-list">
            {#each category.items as item}
              <span class="skill-badge">{item}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
