<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { personalInfo } from '$lib/data/personal';
	import { ArrowRight, Download, Mail } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withDelay, viewport } from '$lib/utils/animations';
</script>

<section
	class="from-primary-50 to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-900/20 relative flex min-h-screen items-center justify-center bg-gradient-to-br via-white"
>
	<!-- Background decoration -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="bg-primary-200 absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="bg-accent-200 absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full opacity-70 mix-blend-multiply blur-xl filter"
			style="animation-delay: 2s;"
		></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<!-- Content -->
			<Motion
				initial={animations.pageEnter.initial}
				animate={animations.pageEnter.animate}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				let:motion
			>
				<div class="order-2 text-center lg:order-1 lg:text-left" use:motion>
					<div class="space-y-6">
						<!-- Greeting -->
						<Motion
							initial={animations.textReveal.initial}
							animate={animations.textReveal.animate}
							transition={withDelay(animations.textReveal.transition, 0.2)}
							let:motion
						>
							<div class="inline-block" use:motion>
								<span class="text-primary-600 text-lg font-medium">Hello, I'm</span>
							</div>
						</Motion>

						<!-- Name -->
						<Motion
							initial={animations.textReveal.initial}
							animate={animations.textReveal.animate}
							transition={withDelay(animations.textReveal.transition, 0.3)}
							let:motion
						>
							<h1
								class="font-display text-secondary-900 dark:text-secondary-100 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
								use:motion
							>
								{personalInfo.name}
							</h1>
						</Motion>

						<!-- Title -->
						<Motion
							initial={animations.textReveal.initial}
							animate={animations.textReveal.animate}
							transition={withDelay(animations.textReveal.transition, 0.4)}
							let:motion
						>
							<h2
								class="text-secondary-700 dark:text-secondary-200 text-xl font-semibold sm:text-2xl lg:text-3xl"
								use:motion
							>
								{personalInfo.title}
							</h2>
						</Motion>

						<!-- Subtitle -->
						<Motion
							initial={animations.textReveal.initial}
							animate={animations.textReveal.animate}
							transition={withDelay(animations.textReveal.transition, 0.5)}
							let:motion
						>
							<p class="text-primary-600 text-lg font-medium" use:motion>
								{personalInfo.subtitle}
							</p>
						</Motion>

						<!-- Bio -->
						<Motion
							initial={animations.textReveal.initial}
							animate={animations.textReveal.animate}
							transition={withDelay(animations.textReveal.transition, 0.6)}
							let:motion
						>
							<p
								class="text-secondary-600 dark:text-secondary-400 max-w-2xl text-lg leading-relaxed"
								use:motion
							>
								{personalInfo.bio}
							</p>
						</Motion>

						<!-- CTA Buttons -->
						<Motion
							initial={animations.staggerContainer.initial}
							animate={animations.staggerContainer.animate}
							transition={withDelay(animations.staggerContainer.transition, 0.7)}
							let:motion
						>
							<div
								class="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start"
								use:motion
							>
								<Motion {...animations.buttonHover} let:motion>
									<div use:motion>
										<Button href="/contact" size="lg" class="group" animate>
											<Mail class="mr-2 h-5 w-5" />
											Get In Touch
											<ArrowRight
												class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
											/>
										</Button>
									</div>
								</Motion>

								<Motion {...animations.buttonHover} let:motion>
									<div use:motion>
										<Button
											href={personalInfo.resumeUrl}
											variant="outline"
											size="lg"
											class="group"
											animate
										>
											<Download class="mr-2 h-5 w-5" />
											Download Resume
										</Button>
									</div>
								</Motion>
							</div>
						</Motion>

						<!-- Quick Stats -->
						<Motion
							initial={animations.staggerContainer.initial}
							animate={animations.staggerContainer.animate}
							transition={withDelay(animations.staggerContainer.transition, 0.8)}
							let:motion
						>
							<div
								class="flex flex-col justify-center gap-6 pt-8 sm:flex-row lg:justify-start"
								use:motion
							>
								<Motion {...animations.staggerChild} let:motion>
									<div class="text-center lg:text-left" use:motion>
										<div class="text-primary-600 text-2xl font-bold">5+</div>
										<div class="text-secondary-600 dark:text-secondary-400 text-sm">
											Years Experience
										</div>
									</div>
								</Motion>
								<Motion {...animations.staggerChild} let:motion>
									<div class="text-center lg:text-left" use:motion>
										<div class="text-primary-600 text-2xl font-bold">3</div>
										<div class="text-secondary-600 dark:text-secondary-400 text-sm">
											Hackathon Wins
										</div>
									</div>
								</Motion>
								<Motion {...animations.staggerChild} let:motion>
									<div class="text-center lg:text-left" use:motion>
										<div class="text-primary-600 text-2xl font-bold">2x</div>
										<div class="text-secondary-600 dark:text-secondary-400 text-sm">
											Einstein Award
										</div>
									</div>
								</Motion>
							</div>
						</Motion>
					</div>
				</div>
			</Motion>

			<!-- Image/Avatar -->
			<Motion
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
				let:motion
			>
				<div class="order-1 flex justify-center lg:order-2" use:motion>
					<div class="relative">
						<!-- Professional photo -->
						<Motion whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} let:motion>
							<div
								class="ring-primary-200 dark:ring-primary-800 h-64 w-64 overflow-hidden rounded-full shadow-2xl ring-4 lg:h-80 lg:w-80"
								use:motion
							>
								<img
									src="/profile.webp"
									alt="{personalInfo.name} - Professional Profile"
									class="h-full w-full object-cover"
								/>
							</div>
						</Motion>

						<!-- Decorative elements -->
						<Motion
							{...animations.iconFloat}
							transition={{ ...animations.iconFloat.transition, delay: 1 }}
							let:motion
						>
							<div
								class="bg-accent-400 absolute -top-4 -right-4 h-16 w-16 rounded-full"
								use:motion
							></div>
						</Motion>
						<Motion
							{...animations.iconFloat}
							transition={{ ...animations.iconFloat.transition, delay: 1.5 }}
							let:motion
						>
							<div
								class="bg-primary-300 absolute -bottom-4 -left-4 h-12 w-12 rounded-full"
								use:motion
							></div>
						</Motion>
					</div>
				</div>
			</Motion>
		</div>

		<!-- Scroll indicator -->
		<Motion
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 1.2 }}
			let:motion
		>
			<div class="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce" use:motion>
				<div class="border-secondary-400 flex h-10 w-6 justify-center rounded-full border-2">
					<div class="bg-secondary-400 mt-2 h-3 w-1 animate-pulse rounded-full"></div>
				</div>
			</div>
		</Motion>
	</div>
</section>
