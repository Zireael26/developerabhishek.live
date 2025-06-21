<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { projects } from '$lib/data/projects';
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { ExternalLink, Star, Code } from 'lucide-svelte';

	const featuredProjects = projects.filter((project) => project.featured);
	const otherProjects = projects.filter((project) => !project.featured);
</script>

<section id="projects" class="bg-secondary-50 dark:bg-secondary-800 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<h2
				class="font-display text-secondary-900 mb-4 text-3xl font-bold sm:text-4xl dark:text-white"
			>
				Featured Projects
			</h2>
			<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-3xl text-lg">
				A showcase of my recent work, demonstrating expertise across full-stack development, system
				architecture, and emerging technologies.
			</p>
		</div>

		<!-- Featured Projects -->
		<div class="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
			{#each featuredProjects as project (project.title)}
				<Card class="group h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
					<!-- Project Image/Icon -->
					<div
						class="from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 relative mb-6 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br"
					>
						<!-- Featured badge -->
						<div class="absolute top-4 right-4">
							<div
								class="bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200 flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium"
							>
								<Star class="h-3 w-3" />
								<span>Featured</span>
							</div>
						</div>

						<!-- Project icon -->
						<div class="bg-primary-600 flex h-16 w-16 items-center justify-center rounded-xl">
							<Code class="h-8 w-8 text-white" />
						</div>
					</div>

					<!-- Project Content -->
					<div class="flex flex-1 flex-col space-y-4">
						<div>
							<h3
								class="text-secondary-900 group-hover:text-primary-600 mb-2 text-xl font-bold transition-colors dark:text-white"
							>
								{project.title}
							</h3>
							<p class="text-secondary-600 dark:text-secondary-400 leading-relaxed">
								{project.description}
							</p>
						</div>

						<!-- Technologies -->
						<div class="flex-1">
							<div class="flex flex-wrap gap-2">
								{#each project.technologies as tech (tech)}
									<Badge text={tech} variant="secondary" size="sm" />
								{/each}
							</div>
						</div>

						<!-- Action buttons -->
						<div class="flex space-x-3 pt-4">
							{#if project.githubUrl}
								<Button
									href={project.githubUrl}
									variant="outline"
									size="sm"
									class="group/btn flex-1"
								>
									<div class="mr-2 h-4 w-4">
										<SiGithub size={16} />
									</div>
									Code
									<ExternalLink
										class="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
									/>
								</Button>
							{/if}
							{#if project.liveUrl}
								<Button href={project.liveUrl} size="sm" class="group/btn flex-1">
									Live Demo
									<ExternalLink
										class="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
									/>
								</Button>
							{/if}
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Other Projects -->
		{#if otherProjects.length > 0}
			<div>
				<h3 class="text-secondary-900 mb-8 text-center text-2xl font-bold dark:text-white">
					Other Projects
				</h3>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each otherProjects as project (project.title)}
						<Card class="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
							<!-- Project header -->
							<div class="mb-4 flex items-start justify-between">
								<div
									class="bg-secondary-100 dark:bg-secondary-700 flex h-10 w-10 items-center justify-center rounded-lg"
								>
									<Code class="text-secondary-600 dark:text-secondary-400 h-5 w-5" />
								</div>
								<div class="flex space-x-2">
									{#if project.githubUrl}
										<a
											href={project.githubUrl}
											class="text-secondary-400 hover:text-secondary-600 transition-colors"
										>
											<SiGithub size={20} />
										</a>
									{/if}
									{#if project.liveUrl}
										<a
											href={project.liveUrl}
											class="text-secondary-400 hover:text-secondary-600 transition-colors"
										>
											<ExternalLink class="h-5 w-5" />
										</a>
									{/if}
								</div>
							</div>

							<!-- Project content -->
							<div class="space-y-3">
								<h4
									class="text-secondary-900 group-hover:text-primary-600 text-lg font-semibold transition-colors dark:text-white"
								>
									{project.title}
								</h4>
								<p class="text-secondary-600 dark:text-secondary-400 text-sm">
									{project.description}
								</p>

								<!-- Technologies -->
								<div class="flex flex-wrap gap-1">
									{#each project.technologies.slice(0, 3) as tech (tech)}
										<Badge text={tech} variant="secondary" size="sm" />
									{/each}
									{#if project.technologies.length > 3}
										<Badge
											text="+{project.technologies.length - 3} more"
											variant="secondary"
											size="sm"
										/>
									{/if}
								</div>
							</div>
						</Card>
					{/each}
				</div>
			</div>
		{/if}

		<!-- CTA -->
		<div class="mt-16 text-center">
			<p class="text-secondary-600 dark:text-secondary-400 mb-6">Want to see more of my work?</p>
			<Button href="https://github.com/Zireael26" variant="outline" size="lg" class="group">
				<div class="mr-2 h-5 w-5">
					<SiGithub size={20} />
				</div>
				View All Projects on GitHub
				<ExternalLink
					class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</Button>
		</div>
	</div>
</section>
