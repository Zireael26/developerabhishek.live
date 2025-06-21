<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { skills } from '$lib/data/skills';
	import { Code } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withViewport } from '$lib/utils/animations';
	import {
		SiGnubash,
		SiReact,
		SiAmazonwebservices,
		SiMongodb,
		SiEthereum,
		SiTensorflow,
		SiGit
	} from '@icons-pack/svelte-simple-icons';

	const categoryIcons = {
		'Programming Languages': Code,
		'Backend Technologies': SiGnubash,
		'Frontend Technologies': SiReact,
		'Cloud & DevOps': SiAmazonwebservices,
		Databases: SiMongodb,
		'Blockchain & Web3': SiEthereum,
		'Emerging Technologies': SiTensorflow,
		'Tools & Methodologies': SiGit
	};

	const categoryColors = {
		'Programming Languages': 'primary',
		'Backend Technologies': 'secondary',
		'Frontend Technologies': 'accent',
		'Cloud & DevOps': 'primary',
		Databases: 'secondary',
		'Blockchain & Web3': 'accent',
		'Emerging Technologies': 'success',
		'Tools & Methodologies': 'primary'
	};
</script>

<section id="skills" class="dark:bg-secondary-900 bg-white py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div class="mb-16 text-center" use:motion>
				<h2
					class="font-display text-secondary-900 mb-4 text-3xl font-bold sm:text-4xl dark:text-white"
				>
					Technical Skills
				</h2>
				<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-3xl text-lg">
					A comprehensive toolkit built through years of hands-on experience and continuous learning
					in modern software development.
				</p>
			</div>
		</Motion>

		<!-- Skills Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
			{#each skills as skillCategory (skillCategory.category)}
				{@const IconComponent = categoryIcons[skillCategory.category as keyof typeof categoryIcons]}
				{@const badgeVariant =
					categoryColors[skillCategory.category as keyof typeof categoryColors]}
				<Card class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
					<!-- Category Header -->
					<div class="mb-6 flex items-center space-x-3">
						{#if badgeVariant === 'primary'}
							<div
								class="bg-primary-100 dark:bg-primary-900/20 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<IconComponent class="text-primary-600 h-5 w-5" />
							</div>
						{:else if badgeVariant === 'secondary'}
							<div
								class="bg-secondary-100 dark:bg-secondary-900/20 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<IconComponent class="text-secondary-600 h-5 w-5" />
							</div>
						{:else if badgeVariant === 'accent'}
							<div
								class="bg-accent-100 dark:bg-accent-900/20 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<IconComponent class="text-accent-600 h-5 w-5" />
							</div>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20"
							>
								<IconComponent class="h-5 w-5 text-green-600" />
							</div>
						{/if}
						<h3 class="text-secondary-900 text-lg font-semibold dark:text-white">
							{skillCategory.category}
						</h3>
					</div>

					<!-- Skills -->
					<div class="flex flex-wrap gap-2">
						{#each skillCategory.items as skill (skill)}
							<Badge
								text={skill}
								variant={badgeVariant as 'primary' | 'secondary' | 'accent' | 'success'}
								size="sm"
								class="transition-all duration-200 hover:scale-105"
							/>
						{/each}
					</div>

					<!-- Category specific info -->
					{#if skillCategory.category === 'Emerging Technologies'}
						<div
							class="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
						>
							<p class="text-sm text-green-800 dark:text-green-200">
								<strong>Current Focus:</strong> Actively learning and implementing AI/ML solutions
							</p>
						</div>
					{:else if skillCategory.category === 'Blockchain & Web3'}
						<div
							class="bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800 mt-4 rounded-lg border p-3"
						>
							<p class="text-accent-800 dark:text-accent-200 text-sm">
								<strong>Specialization:</strong> Cosmos ecosystem and DeFi protocols
							</p>
						</div>
					{:else if skillCategory.category === 'Cloud & DevOps'}
						<div
							class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 mt-4 rounded-lg border p-3"
						>
							<p class="text-primary-800 dark:text-primary-200 text-sm">
								<strong>Experience:</strong> Production deployments serving millions of users
							</p>
						</div>
					{/if}
				</Card>
			{/each}
		</div>

		<!-- Proficiency Levels -->
		<div class="mt-16">
			<h3 class="text-secondary-900 mb-8 text-center text-2xl font-bold dark:text-white">
				Proficiency Levels
			</h3>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Expert Level -->
				<Card class="border-l-4 border-l-green-500 text-center">
					<div class="space-y-4">
						<div
							class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
						>
							<span class="text-2xl">🚀</span>
						</div>
						<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">Expert</h4>
						<p class="text-secondary-600 dark:text-secondary-400 text-sm">5+ years of experience</p>
						<div class="space-y-1">
							<Badge text="Go" variant="success" size="sm" />
							<Badge text="Java" variant="success" size="sm" />
							<Badge text="Spring Boot" variant="success" size="sm" />
							<Badge text="AWS" variant="success" size="sm" />
						</div>
					</div>
				</Card>

				<!-- Advanced Level -->
				<Card class="border-l-primary-500 border-l-4 text-center">
					<div class="space-y-4">
						<div
							class="bg-primary-100 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
						>
							<span class="text-2xl">⭐</span>
						</div>
						<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">Advanced</h4>
						<p class="text-secondary-600 dark:text-secondary-400 text-sm">
							3-4 years of experience
						</p>
						<div class="space-y-1">
							<Badge text="Python" variant="primary" size="sm" />
							<Badge text="React" variant="primary" size="sm" />
							<Badge text="PostgreSQL" variant="primary" size="sm" />
							<Badge text="Docker" variant="primary" size="sm" />
						</div>
					</div>
				</Card>

				<!-- Learning Level -->
				<Card class="border-l-accent-500 border-l-4 text-center">
					<div class="space-y-4">
						<div
							class="bg-accent-100 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
						>
							<span class="text-2xl">📚</span>
						</div>
						<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">Learning</h4>
						<p class="text-secondary-600 dark:text-secondary-400 text-sm">
							Actively developing skills
						</p>
						<div class="space-y-1">
							<Badge text="AI/ML" variant="accent" size="sm" />
							<Badge text="Neural Networks" variant="accent" size="sm" />
							<Badge text="MLOps" variant="accent" size="sm" />
							<Badge text="Data Science" variant="accent" size="sm" />
						</div>
					</div>
				</Card>
			</div>
		</div>
	</div>
</section>
