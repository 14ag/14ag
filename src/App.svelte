<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './lib/Icon.svelte';
  import {
    createAdminProject,
    deleteAdminProjects,
    fetchProjects,
    projectIcons,
    updateAdminProject
  } from './lib/projects';
  import type { FormErrors, ProjectForm, ProjectRecord } from './lib/types';

  const emptyForm = (): ProjectForm => ({
    icon: 'folder',
    title: '',
    description: '',
    techs: [],
    _url: '',
    live_url: '',
    category: ''
  });

  let projects: ProjectRecord[] = [];
  let categories: string[] = [];
  let selectedIds = new Set<number>();
  let activeFilter = 'all';
  let loading = true;
  let saving = false;
  let deleting = false;
  let showForm = false;
  let showConfirm = false;
  let editingProjectId: number | null = null;
  let form = emptyForm();
  let formErrors: FormErrors = {};
  let techDraft = '';
  let categoryMode = 'existing';
  let selectedCategory = '';
  let newCategory = '';
  let notice = '';
  let errorMessage = '';

  $: filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);
  $: selectedCount = selectedIds.size;
  $: selectedProjects = projects.filter((project) => selectedIds.has(project.id));
  $: canDelete = selectedCount > 0 && !deleting;
  $: isEditing = editingProjectId !== null;

  onMount(() => {
    void loadProjects();
  });

  function formatAdminCategory(category: string) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  function normalizeCategory(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }

  async function loadProjects() {
    loading = true;
    errorMessage = '';

    try {
      const response = await fetchProjects();
      projects = response.projects;
      categories = response.categories;
      selectedIds = new Set([...selectedIds].filter((id) => projects.some((project) => project.id === id)));

      if (activeFilter !== 'all' && !categories.includes(activeFilter)) {
        activeFilter = 'all';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Projects could not be loaded.';
    } finally {
      loading = false;
    }
  }

  function openForm() {
    editingProjectId = null;
    form = emptyForm();
    formErrors = {};
    techDraft = '';
    selectedCategory = categories[0] || '';
    newCategory = '';
    categoryMode = categories.length > 0 ? 'existing' : 'new';
    showForm = true;
  }

  function openEditForm(project: ProjectRecord) {
    editingProjectId = project.id;
    form = {
      icon: project.icon,
      title: project.title,
      description: project.description,
      techs: [...project.techs],
      _url: project._url === '#' ? '' : project._url,
      live_url: project.live_url || '',
      category: project.category
    };
    formErrors = {};
    techDraft = '';

    if (categories.includes(project.category)) {
      categoryMode = 'existing';
      selectedCategory = project.category;
      newCategory = '';
    } else {
      categoryMode = 'new';
      selectedCategory = '';
      newCategory = project.category;
    }

    showForm = true;
  }

  function closeForm() {
    if (!saving) {
      showForm = false;
      editingProjectId = null;
    }
  }

  function toggleProject(id: number) {
    const next = new Set(selectedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    selectedIds = next;
  }

  function clearSelection() {
    selectedIds = new Set();
  }

  function addTech(value: string) {
    const tech = value.trim();

    if (!tech || form.techs.some((item) => item.toLowerCase() === tech.toLowerCase())) {
      return;
    }

    form = {
      ...form,
      techs: [...form.techs, tech]
    };
  }

  function removeTech(tech: string) {
    form = {
      ...form,
      techs: form.techs.filter((item) => item !== tech)
    };
  }

  function handleTechInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const value = target.value;

    if (!value.includes(',')) {
      techDraft = value;
      return;
    }

    const parts = value.split(',');
    parts.slice(0, -1).forEach(addTech);
    techDraft = parts.at(-1)?.replace(/^\s+/, '') || '';
  }

  function handleTechKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTech(techDraft);
      techDraft = '';
      return;
    }

    if (event.key === 'Backspace' && !techDraft && form.techs.length > 0) {
      form = {
        ...form,
        techs: form.techs.slice(0, -1)
      };
    }
  }

  function handleTechBlur() {
    addTech(techDraft);
    techDraft = '';
  }

  function isValidUrl(value: string, optional = false) {
    if (!value.trim()) {
      return optional;
    }

    try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function validateForm() {
    const errors: FormErrors = {};
    const category =
      categoryMode === 'new' || selectedCategory === ''
        ? normalizeCategory(newCategory)
        : normalizeCategory(selectedCategory);

    if (!form.title.trim()) {
      errors.title = 'Project name is required.';
    }

    if (!form.description.trim()) {
      errors.description = 'Description is required.';
    }

    if (!category) {
      errors.category = 'Category is required.';
    }

    if (form.techs.length === 0) {
      errors.techs = 'Add at least one tech item.';
    }

    if (!isValidUrl(form._url)) {
      errors._url = 'GitHub URL must start with http:// or https://.';
    }

    if (!isValidUrl(form.live_url || '', true)) {
      errors.live_url = 'Release page must start with http:// or https://.';
    }

    formErrors = errors;
    return {
      valid: Object.keys(errors).length === 0,
      category
    };
  }

  async function submitProject() {
    addTech(techDraft);
    techDraft = '';

    const { valid, category } = validateForm();

    if (!valid) {
      return;
    }

    saving = true;
    notice = '';
    errorMessage = '';

    try {
      const project = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category,
        _url: form._url.trim(),
        ...(form.live_url?.trim() ? { live_url: form.live_url.trim() } : {})
      };

      if (editingProjectId !== null) {
        await updateAdminProject(editingProjectId, project);
        notice = 'Project updated.';
      } else {
        await createAdminProject(project);
        notice = 'Project added.';
      }

      showForm = false;
      editingProjectId = null;
      await loadProjects();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Project could not be added.';
    } finally {
      saving = false;
    }
  }

  async function confirmDelete() {
    if (!canDelete) {
      return;
    }

    deleting = true;
    notice = '';
    errorMessage = '';

    try {
      await deleteAdminProjects([...selectedIds]);
      notice = 'Selected projects deleted.';
      showConfirm = false;
      selectedIds = new Set();
      await loadProjects();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Projects could not be deleted.';
    } finally {
      deleting = false;
    }
  }
</script>

<main class="admin-shell">
  <header class="topbar">
    <div>
      <p class="eyebrow">Local project control</p>
      <h1>Projects Admin</h1>
    </div>

    <button class="btn btn-primary" type="button" onclick={openForm}>
      <Icon name="plus" size={18} />
      Add project
    </button>
  </header>

  <section class="metrics">
    <div>
      <span>{projects.length}</span>
      <p>Projects</p>
    </div>
    <div>
      <span>{categories.length}</span>
      <p>Categories</p>
    </div>
    <div>
      <span>{selectedCount}</span>
      <p>Selected</p>
    </div>
  </section>

  {#if notice}
    <div class="notice success">{notice}</div>
  {/if}

  {#if errorMessage}
    <div class="notice error">{errorMessage}</div>
  {/if}

  <section class="projects-panel">
    <div class="panel-heading">
      <div>
        <h2>Projects</h2>
        <p>Manage portfolio entries stored in Supabase.</p>
      </div>

      {#if selectedCount > 0}
        <div class="bulk-toolbar">
          <span>{selectedCount} selected</span>
          <button class="btn btn-danger" type="button" disabled={!canDelete} onclick={() => (showConfirm = true)}>
            <Icon name="trash" size={17} />
            Delete selected
          </button>
          <button class="icon-button" type="button" aria-label="Clear selection" onclick={clearSelection}>
            <Icon name="x" size={18} />
          </button>
        </div>
      {/if}
    </div>

    <div class="filter-bar">
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
          {formatAdminCategory(category)}
        </button>
      {/each}
    </div>

    {#if loading}
      <p class="project-feedback">Loading projects.</p>
    {:else if filteredProjects.length === 0}
      <p class="project-feedback">No projects in this view.</p>
    {:else}
      <div class="projects-grid">
        {#each filteredProjects as project (project.id)}
          <article class:selected={selectedIds.has(project.id)} class="project-card">
            <label class="select-control">
              <input
                type="checkbox"
                checked={selectedIds.has(project.id)}
                onchange={() => toggleProject(project.id)}
              />
              <span></span>
            </label>

            <button
              type="button"
              class="project-edit-button"
              aria-label={`Edit ${project.title}`}
              onclick={() => openEditForm(project)}
            >
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
            </button>

            <div class="project-links">
              <a href={project._url} target="_blank" rel="noopener noreferrer">Code</a>

              {#if project.live_url}
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">Release</a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</main>

{#if showForm}
  <div class="scrim" role="presentation" onclick={closeForm}></div>
  <aside class="drawer" aria-label={isEditing ? 'Edit project' : 'Add project'}>
    <div class="drawer-header">
      <div>
        <p class="eyebrow">{isEditing ? 'Update Supabase row' : 'New Supabase row'}</p>
        <h2>{isEditing ? 'Edit project' : 'Add project'}</h2>
      </div>
      <button class="icon-button" type="button" aria-label="Close form" onclick={closeForm}>
        <Icon name="x" size={20} />
      </button>
    </div>

    <form class="project-form" onsubmit={(event) => { event.preventDefault(); void submitProject(); }}>
      <label class:error={formErrors.title}>
        <span>Project Name</span>
        <input bind:value={form.title} placeholder=" " />
        {#if formErrors.title}<small>{formErrors.title}</small>{/if}
      </label>

      <label class:error={formErrors.description}>
        <span>Description</span>
        <textarea bind:value={form.description} placeholder=" "></textarea>
        {#if formErrors.description}<small>{formErrors.description}</small>{/if}
      </label>

      <div class="form-row">
        <label>
          <span>Icon</span>
          <select bind:value={form.icon}>
            {#each projectIcons as icon}
              <option value={icon}>{icon}</option>
            {/each}
          </select>
        </label>

        <label class:error={formErrors.category}>
          <span>Category</span>
          {#if categoryMode === 'existing' && categories.length > 0}
            <select bind:value={selectedCategory}>
              {#each categories as category}
                <option value={category}>{formatAdminCategory(category)}</option>
              {/each}
              <option value="">New category</option>
            </select>
            {#if selectedCategory === ''}
              <input class="stacked-input" bind:value={newCategory} placeholder="new-category" />
            {/if}
          {:else}
            <input bind:value={newCategory} placeholder="new-category" />
          {/if}
          {#if categories.length > 0}
            <button
              class="link-button"
              type="button"
              onclick={() => {
                categoryMode = categoryMode === 'new' ? 'existing' : 'new';
                selectedCategory = categoryMode === 'existing' ? categories[0] : '';
              }}
            >
              {categoryMode === 'new' ? 'Use existing' : 'Add new'}
            </button>
          {/if}
          {#if formErrors.category}<small>{formErrors.category}</small>{/if}
        </label>
      </div>

      <label class:error={formErrors.techs}>
        <span>Tech Stack</span>
        <div class="tag-input">
          {#each form.techs as tech}
            <button type="button" class="tag-chip" onclick={() => removeTech(tech)}>
              {tech}
              <Icon name="x" size={12} />
            </button>
          {/each}
          <input
            value={techDraft}
            oninput={handleTechInput}
            onkeydown={handleTechKeydown}
            onblur={handleTechBlur}
            placeholder="python, svelte"
          />
        </div>
        {#if formErrors.techs}<small>{formErrors.techs}</small>{/if}
      </label>

      <label class:error={formErrors._url}>
        <span>GitHub URL</span>
        <input bind:value={form._url} placeholder="https://github.com/..." />
        {#if formErrors._url}<small>{formErrors._url}</small>{/if}
      </label>

      <label class:error={formErrors.live_url}>
        <span>Release Page</span>
        <input bind:value={form.live_url} placeholder="https://..." />
        {#if formErrors.live_url}<small>{formErrors.live_url}</small>{/if}
      </label>

      <div class="drawer-actions">
        <button class="btn btn-secondary" type="button" onclick={closeForm}>Cancel</button>
        <button class="btn btn-primary" type="submit" disabled={saving}>
          <Icon name="plus" size={18} />
          {saving ? (isEditing ? 'Saving' : 'Adding') : (isEditing ? 'Save changes' : 'Add project')}
        </button>
      </div>
    </form>
  </aside>
{/if}

{#if showConfirm}
  <div class="scrim" role="presentation" onclick={() => (showConfirm = false)}></div>
  <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
    <h2 id="delete-title">Delete selected projects</h2>
    <p>
      This removes {selectedProjects.length}
      {selectedProjects.length === 1 ? 'project' : 'projects'} from Supabase.
    </p>
    <div class="delete-list">
      {#each selectedProjects as project}
        <span>{project.title}</span>
      {/each}
    </div>
    <div class="drawer-actions">
      <button class="btn btn-secondary" type="button" onclick={() => (showConfirm = false)}>Cancel</button>
      <button class="btn btn-danger" type="button" disabled={deleting} onclick={() => void confirmDelete()}>
        <Icon name="trash" size={17} />
        {deleting ? 'Deleting' : 'Delete'}
      </button>
    </div>
  </div>
{/if}
