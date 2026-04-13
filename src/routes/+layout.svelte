<script>
	import Projects from "./projects.svelte";
	import Contact from "./contact.svelte";
	import Head1 from "./head1.svelte";
	import About from "./about.svelte";
	import Skills1 from "./skills1.svelte";
	import "../app.css";

	import favicon from "$lib/assets/favicon.svg";

	import { onMount } from "svelte";
	let theme = $state("dark");

	onMount(() => {
		theme = localStorage.getItem("theme") || "dark";
		document.documentElement.setAttribute("data-theme", theme);
	});

	function toggleTheme(e) {
		theme = e.target.checked ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}

	let { children } = $props();
</script>

<svelte:head>
	<Head1 />
</svelte:head>

{@render children()}
