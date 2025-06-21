<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let darkMode = $state(false);

	// Initialize dark mode based on system preference or localStorage
	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') {
			darkMode = true;
		} else if (stored === 'light') {
			darkMode = false;
		} else {
			// No preference stored, use system preference
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		updateDarkMode();
	});

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			localStorage.setItem('theme', 'dark');
		} else {
			localStorage.setItem('theme', 'light');
		}
		updateDarkMode();
	}

	function updateDarkMode() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<div class="flex min-h-screen flex-col bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100">
	<Header {darkMode} {toggleDarkMode} />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
