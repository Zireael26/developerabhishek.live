<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		padding?: boolean;
		hover?: boolean;
	}

	let { children, class: className = '', padding = true, hover = true }: Props = $props();

	const baseClasses =
		'bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700';
	const paddingClasses = padding ? 'p-6' : '';
	const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';

	const classes = `${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`;
</script>

<div class={classes}>
	{@render children()}
</div>
