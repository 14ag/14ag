<script lang="ts">
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { reveal, trackSection } from '$lib/actions/intersection';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import type { Project, SectionChangeHandler } from '$lib/types';

  let {
    projects,
    projectsError,
    onSectionChange
  }: {
    projects: Project[];
    projectsError: string;
    onSectionChange: SectionChangeHandler;
  } = $props();

  let activeFilter = $state('all');

  let categories = $derived(
    Array.from(new Set(projects.map((project) => project.category.toLowerCase())))
  );

  let filteredProjects = $derived(
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category.toLowerCase() === activeFilter)
  );

  function formatPublicProjectCategory(category: string) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
</script>

<section
  id="projects"
  class="projects"
  use:trackSection={{ id: 'projects', onChange: onSectionChange }}
>
  <div class="container">
    <div class="section-header reveal" use:reveal>
      <h2>Projects</h2>
      <p>A selection of things I've built and contributed to.</p>
    </div>

    <div class="filter-bar reveal" use:reveal>
      <button
        class:active={activeFilter === 'all'}
        class="filter-btn"
        type="button"
        onclick={() => (activeFilter = 'all')}
      >
        All
      </button>

      {#each categories as category}
        <button
          class:active={activeFilter === category}
          class="filter-btn"
          type="button"
          onclick={() => (activeFilter = category)}
        >
          {formatPublicProjectCategory(category)}
        </button>
      {/each}
    </div>

    <div class="projects-grid">
      {#if projectsError}
        <p class="project-feedback">{projectsError}</p>
      {:else if projects.length === 0}
        <p class="project-feedback">Projects will appear here soon.</p>
      {:else}
        {#each filteredProjects as project, index (`${project.title}:${project._url}:${project.category}:${index}`)}
          <div animate:flip in:fly={{ y: 20, duration: 250 }} out:fly={{ y: 20, duration: 200 }}>
            <ProjectCard {project} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>
