<script lang="ts">
	import { Motion } from 'svelte-motion';
	import { animations } from '$lib/utils/animations';

	interface Props {
		text: string;
		variant?: 'primary' | 'secondary' | 'accent' | 'success';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		animate?: boolean;
	}

	let { text, variant = 'primary', size = 'md', class: className = '', animate = true }: Props = $props();

	const baseClasses = 'inline-flex items-center rounded-full font-medium';

	const variants = {
		primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
		secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
		accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
		success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
	};

	const sizes = {
		sm: 'px-2 py-1 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-4 py-2 text-base'
	};

	const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
</script>

{#if animate}
	<Motion {...animations.skillBadge} let:motion>
		<span use:motion class={classes}>
			{text}
		</span>
	</Motion>
{:else}
	<span class={classes}>
		{text}
	</span>
{/if}
