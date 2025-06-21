<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { projects } from '$lib/data/projects';
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { ExternalLink, Star, Code } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withViewport } from '$lib/utils/animations';
</script>

<section id="projects" class="bg-secondary-50 dark:bg-secondary-800 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div class="mb-16 text-center" use:motion>
				<h2
					class="text-secondary-900 dark:text-secondary-100 mb-4 text-4xl font-bold tracking-tight"
				>
					Featured Projects
				</h2>
				<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-2xl text-lg">
					A collection of projects that showcase my skills in full-stack development, blockchain,
					and emerging technologies.
				</p>
			</div>
		</Motion>

		<!-- Featured Projects Grid -->
		<Motion {...withViewport(animations.staggerContainer)} let:motion>
			<div class="mb-20 grid gap-8 lg:grid-cols-2" use:motion>
				{#each projects.filter((p) => p.featured) as project (project.id)}
					<Motion {...withViewport(animations.staggerChild)} let:motion>
						<div use:motion>
							<Card class="group h-full transition-all duration-300">
								<!-- Project Image/Icon -->
								<div
									class="from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 relative mb-6 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br"
								>
									<!-- Featured badge -->
									<div class="absolute top-4 right-4">
										<Motion
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
											let:motion
										>
											<div use:motion>
												<Badge text="Featured" variant="primary" size="sm" />
											</div>
										</Motion>
									</div>

									<!-- Tech stack background -->
									<div class="absolute inset-0 flex items-center justify-center opacity-10">
										<Code class="h-20 w-20" />
									</div>
								</div>

								<!-- Project Content -->
								<div class="space-y-4">
									<h3
										class="text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 text-xl font-semibold transition-colors"
									>
										{project.title}
									</h3>

									<p class="text-secondary-600 dark:text-secondary-400">
										{project.description}
									</p>

									<!-- Technologies -->
									<Motion {...withViewport(animations.staggerContainer)} let:motion>
										<div class="flex flex-wrap gap-2" use:motion>
											{#each project.technologies as tech (tech)}
												<Motion {...animations.skillBadge} let:motion>
													<div use:motion>
														<Badge text={tech} variant="secondary" size="sm" animate />
													</div>
												</Motion>
											{/each}
										</div>
									</Motion>

									<!-- Action buttons -->
									<Motion {...withViewport(animations.staggerContainer)} let:motion>
										<div class="flex space-x-3 pt-4" use:motion>
											{#if project.githubUrl}
												<Motion {...animations.buttonHover} let:motion>
													<div use:motion>
														<Button
															href={project.githubUrl}
															variant="outline"
															size="sm"
															class="group/btn flex-1"
															animate
														>
															<div class="mr-2 h-4 w-4">
																<SiGithub size={16} />
															</div>
															Code
															<ExternalLink
																class="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
															/>
														</Button>
													</div>
												</Motion>
											{/if}
											{#if project.liveUrl}
												<Motion {...animations.buttonHover} let:motion>
													<div use:motion>
														<Button
															href={project.liveUrl}
															size="sm"
															class="group/btn flex-1"
															animate
														>
															Live Demo
															<ExternalLink
																class="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
															/>
														</Button>
													</div>
												</Motion>
											{/if}
										</div>
									</Motion>
								</div>
							</Card>
						</div>
					</Motion>
				{/each}
			</div>
		</Motion>

		<!-- Other Projects Section -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div class="text-center" use:motion>
				<h3 class="text-secondary-900 dark:text-secondary-100 mb-8 text-2xl font-semibold">
					Other Notable Projects
				</h3>
			</div>
		</Motion>

		<!-- Other Projects Grid -->
		<Motion {...withViewport(animations.staggerContainer)} let:motion>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" use:motion>
				{#each projects.filter((p) => !p.featured) as project (project.id)}
					<Motion {...withViewport(animations.staggerChild)} let:motion>
						<div use:motion>
							<Card class="group transition-all duration-300">
								<!-- Project header -->
								<div class="mb-4 flex items-start justify-between">
									<div
										class="bg-secondary-100 dark:bg-secondary-700 flex h-10 w-10 items-center justify-center rounded-lg"
									>
										<Code class="text-secondary-600 dark:text-secondary-400 h-5 w-5" />
									</div>
									<div class="flex space-x-2">
										{#if project.githubUrl}
											<Motion whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} let:motion>
												<a
													href={project.githubUrl}
													class="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
													use:motion
												>
													<SiGithub size={20} />
												</a>
											</Motion>
										{/if}
										{#if project.liveUrl}
											<Motion whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} let:motion>
												<a
													href={project.liveUrl}
													class="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
													use:motion
												>
													<ExternalLink size={20} />
												</a>
											</Motion>
										{/if}
									</div>
								</div>

								<!-- Project content -->
								<div class="space-y-3">
									<h4
										class="text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 text-lg font-semibold transition-colors"
									>
										{project.title}
									</h4>
									<p class="text-secondary-600 dark:text-secondary-400 text-sm">
										{project.description}
									</p>

									<!-- Technologies -->
									<Motion {...withViewport(animations.staggerContainer)} let:motion>
										<div class="flex flex-wrap gap-1" use:motion>
											{#each project.technologies.slice(0, 3) as tech (tech)}
												<Motion {...animations.skillBadge} let:motion>
													<div use:motion>
														<Badge text={tech} variant="secondary" size="sm" animate />
													</div>
												</Motion>
											{/each}
											{#if project.technologies.length > 3}
												<Motion {...animations.skillBadge} let:motion>
													<div use:motion>
														<Badge
															text="+{project.technologies.length - 3} more"
															variant="secondary"
															size="sm"
															animate
														/>
													</div>
												</Motion>
											{/if}
										</div>
									</Motion>
								</div>
							</Card>
						</div>
					</Motion>
				{/each}
			</div>
		</Motion>

		<!-- GitHub CTA -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div class="mt-16 text-center" use:motion>
				<p class="text-secondary-600 dark:text-secondary-400 mb-6">Want to see more of my work?</p>
				<Motion {...animations.buttonHover} let:motion>
					<div use:motion>
						<Button
							href="https://github.com/Zireael26"
							variant="outline"
							size="lg"
							class="group"
							animate
						>
							<div class="mr-2 h-5 w-5">
								<SiGithub size={20} />
							</div>
							View All Projects on GitHub
							<ExternalLink
								class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</Button>
					</div>
				</Motion>
			</div>
		</Motion>
	</div>
</section>
