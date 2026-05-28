<script lang="ts">
  import { navLinks } from '$lib/data/content';
  import { theme } from '$lib/stores/theme';
  import type { NavSectionId } from '$lib/types';
  import Icon from '$lib/components/Icon.svelte';
  import { onMount } from 'svelte';

  let { activeSection }: { activeSection: NavSectionId } = $props();

  let menuOpen = $state(false);
  let scrolled = $state(false);

  function closeMenu() {
    menuOpen = false;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header class:scrolled class="navbar">
  <div class="container">
    <a href="#home" class="nav-logo" aria-label="Home" onclick={closeMenu}>P<span>.</span>Muriuki</a>

    <nav id="nav-links" class:open={menuOpen} class="nav-links" aria-label="Main navigation">
      {#each navLinks as link}
        <a
          href={`#${link.id}`}
          class:active={activeSection === link.id}
          onclick={closeMenu}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="nav-controls">
      <label class="theme-switch" aria-label="Toggle theme">
        <input
          type="checkbox"
          id="theme-toggle"
          checked={$theme === 'light'}
          onchange={() => theme.toggle($theme)}
        />
        <span class="switch-track">
          <Icon name="sun" className="switch-icon sun-icon" size={16} />
          <span class="switch-knob"></span>
          <Icon name="moon" className="switch-icon moon-icon" size={16} />
        </span>
      </label>

      <button
        id="hamburger"
        class:active={menuOpen}
        class="hamburger"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onclick={toggleMenu}
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
