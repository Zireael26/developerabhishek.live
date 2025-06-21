<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { personalInfo } from '$lib/data/personal';
	import { ArrowRight, Download, Mail } from 'lucide-svelte';
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
			<div class="order-2 text-center lg:order-1 lg:text-left">
				<div class="space-y-6">
					<!-- Greeting -->
					<div class="animate-slide-up inline-block">
						<span class="text-primary-600 text-lg font-medium">Hello, I'm</span>
					</div>

					<!-- Name -->
					<h1
						class="font-display text-secondary-900 dark:text-secondary-100 animate-slide-up text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
						style="animation-delay: 0.1s;"
					>
						{personalInfo.name}
					</h1>

					<!-- Title -->
					<h2
						class="text-secondary-700 dark:text-secondary-200 animate-slide-up text-xl font-semibold sm:text-2xl lg:text-3xl"
						style="animation-delay: 0.2s;"
					>
						{personalInfo.title}
					</h2>

					<!-- Subtitle -->
					<p
						class="text-primary-600 animate-slide-up text-lg font-medium"
						style="animation-delay: 0.3s;"
					>
						{personalInfo.subtitle}
					</p>

					<!-- Bio -->
					<p
						class="text-secondary-600 dark:text-secondary-400 animate-slide-up max-w-2xl text-lg leading-relaxed"
						style="animation-delay: 0.4s;"
					>
						{personalInfo.bio}
					</p>

					<!-- CTA Buttons -->
					<div
						class="animate-slide-up flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start"
						style="animation-delay: 0.5s;"
					>
						<Button href="/contact" size="lg" class="group">
							<Mail class="mr-2 h-5 w-5" />
							Get In Touch
							<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>

						<Button href={personalInfo.resumeUrl} variant="outline" size="lg" class="group">
							<Download class="mr-2 h-5 w-5" />
							Download Resume
						</Button>
					</div>

					<!-- Quick Stats -->
					<div
						class="animate-slide-up flex flex-col justify-center gap-6 pt-8 sm:flex-row lg:justify-start"
						style="animation-delay: 0.6s;"
					>
						<div class="text-center lg:text-left">
							<div class="text-primary-600 text-2xl font-bold">5+</div>
							<div class="text-secondary-600 dark:text-secondary-400 text-sm">Years Experience</div>
						</div>
						<div class="text-center lg:text-left">
							<div class="text-primary-600 text-2xl font-bold">3</div>
							<div class="text-secondary-600 dark:text-secondary-400 text-sm">Hackathon Wins</div>
						</div>
						<div class="text-center lg:text-left">
							<div class="text-primary-600 text-2xl font-bold">2x</div>
							<div class="text-secondary-600 dark:text-secondary-400 text-sm">Einstein Award</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Image/Avatar -->
			<div
				class="animate-fade-in order-1 flex justify-center lg:order-2"
				style="animation-delay: 0.2s;"
			>
				<div class="relative">
					<!-- Professional photo -->
					<div
						class="ring-primary-200 dark:ring-primary-800 h-64 w-64 overflow-hidden rounded-full shadow-2xl ring-4 lg:h-80 lg:w-80"
					>
						<img
							src="/profile.webp"
							alt="{personalInfo.name} - Professional Profile"
							class="h-full w-full object-cover"
						/>
					</div>

					<!-- Decorative elements -->
					<div
						class="bg-accent-400 absolute -top-4 -right-4 h-16 w-16 animate-pulse rounded-full"
					></div>
					<div
						class="bg-primary-300 absolute -bottom-4 -left-4 h-12 w-12 animate-pulse rounded-full"
						style="animation-delay: 1s;"
					></div>
				</div>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
			<div class="border-secondary-400 flex h-10 w-6 justify-center rounded-full border-2">
				<div class="bg-secondary-400 mt-2 h-3 w-1 animate-pulse rounded-full"></div>
			</div>
		</div>
	</div>
</section>
