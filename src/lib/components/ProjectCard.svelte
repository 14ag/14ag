<script lang="ts">
  import { reveal } from '$lib/actions/intersection';
  import Icon from '$lib/components/Icon.svelte';
  import type { Project } from '$lib/types';

  let { project }: { project: Project } = $props();
</script>

<article class="project-card reveal" data-category={project.category} use:reveal>
  <div class="card-icon">
    <Icon name={project.icon} size={32} strokeWidth={1.5} />
  </div>

  <h3>{project.title}</h3>
  <p>{project.description}</p>

  <div class="project-tags">
    {#each project.techs as tech}
      <span>{tech}</span>
    {/each}
  </div>

  <div class="project-links">
    <a href={project._url} target="_blank" rel="noopener noreferrer" aria-label="GitHub repo">
      {'</> Code'}
    </a>

    {#if project.live_url}
      <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
        Live Demo
      </a>
    {/if}
  </div>
</article>
