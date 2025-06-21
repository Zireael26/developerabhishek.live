<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { experience } from '$lib/data/experience';
	import { Briefcase, Calendar, Award, ChevronRight } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withViewport } from '$lib/utils/animations';
</script>

<section id="experience" class="bg-secondary-50 dark:bg-secondary-800 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div use:motion class="mb-16 text-center">
				<h2
					class="font-display text-secondary-900 mb-4 text-3xl font-bold sm:text-4xl dark:text-white"
				>
					Professional Experience
				</h2>
				<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-3xl text-lg">
					A journey of growth, innovation, and leadership in software engineering and technology.
				</p>
			</div>
		</Motion>

		<!-- Experience Timeline -->
		<div class="space-y-8">
			{#each experience as company (company.company)}
				<Motion {...withViewport(animations.timelineCompany)} let:motion>
					<div use:motion class="relative">
						<!-- Company Header -->
						<div class="mb-6 flex items-center space-x-4">
							<div class="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-lg">
								<Briefcase class="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 class="text-secondary-900 text-2xl font-bold dark:text-white">
									{company.company}
								</h3>
								<p class="text-secondary-600 dark:text-secondary-400">
									{company.positions[0].duration.split(' - ')[0]} - Present
								</p>
							</div>
						</div>

						<!-- Positions -->
						<div class="border-primary-200 dark:border-primary-800 ml-6 space-y-8 border-l-2 pl-8">
							{#each company.positions as position (position.title)}
								<Motion {...withViewport(animations.timelinePosition)} let:motion>
									<div use:motion class="relative">
										<!-- Timeline dot -->
										<Motion {...withViewport(animations.timelineDot)} let:motion>
											<div
												use:motion
												class="bg-primary-600 dark:border-secondary-800 absolute -left-10 h-4 w-4 rounded-full border-4 border-white"
											></div>
										</Motion>

										<Motion {...animations.cardHover} let:motion>
											<div use:motion>
												<Card class="transition-all duration-300 hover:shadow-lg">
													<!-- Position Header -->
													<div class="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
														<div>
															<h4 class="text-secondary-900 mb-2 text-xl font-semibold dark:text-white">
																{position.title}
															</h4>
															<div
																class="text-secondary-600 dark:text-secondary-400 flex items-center space-x-2"
															>
																<Calendar class="h-4 w-4" />
																<span class="text-sm">{position.duration}</span>
															</div>
														</div>
													</div>

													<!-- Description -->
													{#if position.description}
														<p class="text-secondary-600 dark:text-secondary-400 mb-4">
															{position.description}
														</p>
													{/if}

													<!-- Achievements -->
													{#if position.achievements && position.achievements.length > 0}
														<div class="mb-4">
															<h5
																class="text-secondary-900 mb-3 flex items-center text-sm font-semibold dark:text-white"
															>
																<Award class="text-primary-600 mr-2 h-4 w-4" />
																Key Achievements
															</h5>
															<ul class="space-y-2">
																{#each position.achievements as achievement (achievement)}
																	<li
																		class="text-secondary-600 dark:text-secondary-400 flex items-start space-x-2"
																	>
																		<ChevronRight class="text-primary-600 mt-0.5 h-4 w-4 flex-shrink-0" />
																		<span class="text-sm">{achievement}</span>
																	</li>
																{/each}
															</ul>
														</div>
													{/if}

													<!-- Technologies -->
													{#if position.technologies && position.technologies.length > 0}
														<div>
															<h5 class="text-secondary-900 mb-3 text-sm font-semibold dark:text-white">
																Technologies Used
															</h5>
															<div class="flex flex-wrap gap-2">
																{#each position.technologies as tech (tech)}
																	<Badge text={tech} variant="primary" size="sm" />
																{/each}
															</div>
														</div>
													{/if}
												</Card>
											</div>
										</Motion>
									</div>
								</Motion>
							{/each}
						</div>
					</div>
				</Motion>
			{/each}
		</div>

		<!-- Summary Stats -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div use:motion class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
				<Motion {...animations.cardHover} let:motion>
					<div use:motion>
						<Card class="text-center">
							<div class="text-primary-600 mb-2 text-3xl font-bold">5+</div>
							<div class="text-secondary-600 dark:text-secondary-400">Years of Experience</div>
						</Card>
					</div>
				</Motion>

				<Motion {...animations.cardHover} let:motion>
					<div use:motion>
						<Card class="text-center">
							<div class="text-primary-600 mb-2 text-3xl font-bold">4</div>
							<div class="text-secondary-600 dark:text-secondary-400">Career Promotions</div>
						</Card>
					</div>
				</Motion>

				<Motion {...animations.cardHover} let:motion>
					<div use:motion>
						<Card class="text-center">
							<div class="text-primary-600 mb-2 text-3xl font-bold">8+</div>
							<div class="text-secondary-600 dark:text-secondary-400">Team Members Led</div>
						</Card>
					</div>
				</Motion>
			</div>
		</Motion>
	</div>
</section>
