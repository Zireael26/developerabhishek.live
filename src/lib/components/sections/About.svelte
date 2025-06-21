<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { Code, Users, Lightbulb, Target } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withViewport } from '$lib/utils/animations';
</script>

<section id="about" class="dark:bg-secondary-900 bg-white py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div use:motion class="mb-16 text-center">
				<h2
					class="font-display text-secondary-900 mb-4 text-3xl font-bold sm:text-4xl dark:text-white"
				>
					About Me
				</h2>
				<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-3xl text-lg">
					Passionate about building scalable systems and leading high-performing teams while staying
					at the forefront of emerging technologies.
				</p>
			</div>
		</Motion>

		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<!-- Content -->
			<Motion {...withViewport(animations.aboutContent)} let:motion>
				<div use:motion class="space-y-6">
					<h3 class="text-secondary-900 text-2xl font-bold dark:text-white">
						Software Engineering Leader & Innovator
					</h3>

					<div class="prose prose-lg text-secondary-600 dark:text-secondary-400">
						<p>
							With over 5 years of experience in software engineering, I've evolved from an individual
							contributor to a technical leader who bridges the gap between complex technical
							challenges and business objectives.
						</p>

						<p>
							At Bluehost, I've led initiatives that serve millions of users while building and
							mentoring high-performing engineering teams. My journey spans full-stack development,
							system architecture, and emerging technologies like blockchain and AI/ML.
						</p>

						<p>
							Currently, I'm diving deep into AI and machine learning, exploring how these
							technologies can transform user experiences and drive innovation in web hosting and
							beyond.
						</p>
					</div>

					<!-- Values/Principles -->
					<div class="space-y-4 pt-4">
						<h4 class="text-secondary-900 text-xl font-semibold dark:text-white">What Drives Me</h4>
						<ul class="text-secondary-600 dark:text-secondary-400 space-y-2">
							<li class="flex items-start space-x-3">
								<Target class="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0" />
								<span>Building solutions that create meaningful impact for users and businesses</span>
							</li>
							<li class="flex items-start space-x-3">
								<Users class="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0" />
								<span>Fostering collaborative environments where team members thrive and grow</span>
							</li>
							<li class="flex items-start space-x-3">
								<Lightbulb class="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0" />
								<span
									>Staying curious and embracing emerging technologies to solve tomorrow's challenges</span
								>
							</li>
							<li class="flex items-start space-x-3">
								<Code class="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0" />
								<span>Writing clean, maintainable code that stands the test of time</span>
							</li>
						</ul>
					</div>
				</div>
			</Motion>

			<!-- Highlights Cards -->
			<Motion {...withViewport(animations.aboutImage)} let:motion>
				<div use:motion class="space-y-6">
					<!-- Current Focus -->
					<Motion {...animations.cardHover} let:motion>
						<div use:motion>
							<Card class="border-l-primary-600 border-l-4">
								<div class="space-y-4">
									<div class="flex items-center space-x-3">
										<div class="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
											<Lightbulb class="text-primary-600 h-5 w-5" />
										</div>
										<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">
											Current Focus
										</h4>
									</div>
									<p class="text-secondary-600 dark:text-secondary-400">
										Exploring AI/ML applications in web development, focusing on intelligent
										automation, and user experience enhancement.
									</p>
								</div>
							</Card>
						</div>
					</Motion>

					<!-- Leadership -->
					<Motion {...animations.cardHover} let:motion>
						<div use:motion>
							<Card class="border-l-accent-500 border-l-4">
								<div class="space-y-4">
									<div class="flex items-center space-x-3">
										<div class="bg-accent-100 flex h-10 w-10 items-center justify-center rounded-lg">
											<Users class="text-accent-600 h-5 w-5" />
										</div>
										<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">
											Leadership Journey
										</h4>
									</div>
									<p class="text-secondary-600 dark:text-secondary-400">
										Promoted from Software Engineer to Associate Manager in 5 years, leading
										cross-functional teams and driving technical excellence across multiple projects.
									</p>
								</div>
							</Card>
						</div>
					</Motion>

					<!-- Innovation -->
					<Motion {...animations.cardHover} let:motion>
						<div use:motion>
							<Card class="border-l-4 border-l-green-500">
								<div class="space-y-4">
									<div class="flex items-center space-x-3">
										<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
											<Code class="h-5 w-5 text-green-600" />
										</div>
										<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">
											Innovation Record
										</h4>
									</div>
									<p class="text-secondary-600 dark:text-secondary-400">
										Winner of 3 internal hackathons and recipient of 2 Einstein Awards for outstanding
										technical contributions and innovative solutions.
									</p>
								</div>
							</Card>
						</div>
					</Motion>
				</div>
			</Motion>
		</div>
	</div>
</section>
