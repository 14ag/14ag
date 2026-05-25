<script lang="ts">
  import { onDestroy } from 'svelte';
  import AboutSection from '$lib/components/AboutSection.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import ContactSection from '$lib/components/ContactSection.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import ProjectsSection from '$lib/components/ProjectsSection.svelte';
  import SkillsSection from '$lib/components/SkillsSection.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import type { NavSectionId } from '$lib/types';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let activeSection = $state<NavSectionId>('home');
  let toastMessage = $state('');
  let toastVisible = $state(false);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function handleSectionChange(section: NavSectionId) {
    activeSection = section;
  }

  function showToast(message: string) {
    toastMessage = message;
    toastVisible = true;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toastVisible = false;
    }, 3500);
  }

  onDestroy(() => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
  });
</script>

<PageHead />
<Navbar {activeSection} />

<main>
  <Hero onSectionChange={handleSectionChange} />
  <ProjectsSection
    projects={data.projects}
    projectsError={data.projectsError}
    onSectionChange={handleSectionChange}
  />
  <SkillsSection onSectionChange={handleSectionChange} />
  <AboutSection onSectionChange={handleSectionChange} />
  <ContactSection onSectionChange={handleSectionChange} {showToast} />
</main>

<Footer />
<BackToTop />
<Toast message={toastMessage} visible={toastVisible} />
