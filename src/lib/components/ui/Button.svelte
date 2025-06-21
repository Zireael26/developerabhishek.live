<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Motion } from 'svelte-motion';
	import { animations } from '$lib/utils/animations';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children: Snippet;
		onclick?: () => void;
		animate?: boolean;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		disabled = false,
		type = 'button',
		class: className = '',
		children,
		onclick,
		animate = true
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants = {
		primary:
			'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-white',
		secondary:
			'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 dark:bg-secondary-600 dark:hover:bg-secondary-700',
		outline:
			'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20',
		ghost:
			'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20'
	};

	const sizes = {
		sm: 'px-3 py-2 text-sm rounded-md',
		md: 'px-4 py-2 text-base rounded-md',
		lg: 'px-6 py-3 text-lg rounded-lg'
	};

	const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
</script>

{#if animate}
	<Motion {...animations.buttonHover} let:motion>
		{#if href}
			<a use:motion {href} class={classes} class:pointer-events-none={disabled} role="button">
				{@render children()}
			</a>
		{:else}
			<button use:motion class={classes} {type} {disabled} {onclick}>
				{@render children()}
			</button>
		{/if}
	</Motion>
{:else if href}
	<a {href} class={classes} class:pointer-events-none={disabled} role="button">
		{@render children()}
	</a>
{:else}
	<button class={classes} {type} {disabled} {onclick}>
		{@render children()}
	</button>
{/if}
