<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { Menu, X, Sun, Moon } from 'lucide-svelte';
	import { personalInfo } from '$lib/data/personal';

	let { darkMode = false, toggleDarkMode }: { darkMode?: boolean; toggleDarkMode?: () => void } =
		$props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/experience', label: 'Experience' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/skills', label: 'Skills' },
		{ href: '/contact', label: 'Contact' }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header
	class="dark:bg-secondary-900/80 border-secondary-200 dark:border-secondary-700 fixed top-0 right-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md"
>
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex-shrink-0">
				<a
					href="/"
					class="font-display text-primary-600 hover:text-primary-700 text-xl font-bold transition-colors"
				>
					{personalInfo.name}
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors
								{$page.url.pathname === item.href
								? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
								: 'text-secondary-700 dark:text-secondary-300 hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800'}"
						>
							{item.label}
						</a>
					{/each}
				</div>
			</div>

			<!-- Desktop Actions -->
			<div class="hidden md:flex md:items-center md:space-x-4">
				<!-- Dark Mode Toggle -->
				<button
					type="button"
					onclick={toggleDarkMode}
					class="text-secondary-400 hover:text-secondary-500 dark:text-secondary-500 dark:hover:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 transition-colors focus:ring-2 focus:outline-none"
					aria-label="Toggle dark mode"
				>
					{#if darkMode}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</button>

				<!-- CTA Button -->
				<Button href={personalInfo.resumeUrl} variant="outline" size="sm">Resume</Button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					type="button"
					class="text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:outline-none focus:ring-inset"
					aria-controls="mobile-menu"
					aria-expanded={mobileMenuOpen}
					onclick={toggleMobileMenu}
				>
					<span class="sr-only">Open main menu</span>
					{#if mobileMenuOpen}
						<X class="block h-6 w-6" />
					{:else}
						<Menu class="block h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden" id="mobile-menu">
				<div
					class="dark:bg-secondary-900 border-secondary-200 dark:border-secondary-700 space-y-1 border-t bg-white px-2 pt-2 pb-3 sm:px-3"
				>
					{#each navItems as item (item.href)}
						<a
							href={item.href}
							class="block rounded-md px-3 py-2 text-base font-medium transition-colors
								{$page.url.pathname === item.href
								? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
								: 'text-secondary-700 dark:text-secondary-300 hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800'}"
							onclick={closeMobileMenu}
						>
							{item.label}
						</a>
					{/each}
					<div class="space-y-3 pt-4">
						<!-- Dark Mode Toggle -->
						<button
							type="button"
							onclick={toggleDarkMode}
							class="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800 flex w-full items-center rounded-md px-3 py-2 text-base font-medium transition-colors"
						>
							{#if darkMode}
								<Sun class="mr-3 h-5 w-5" />
								Light Mode
							{:else}
								<Moon class="mr-3 h-5 w-5" />
								Dark Mode
							{/if}
						</button>

						<!-- Resume Button -->
						<Button href={personalInfo.resumeUrl} variant="outline" size="sm" class="w-full">
							Resume
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</nav>
</header>

<!-- Spacer to account for fixed header -->
<div class="h-16"></div>
