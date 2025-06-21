<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { contactInfo, personalInfo } from '$lib/data/personal';
	import { SiGithub, SiX } from '@icons-pack/svelte-simple-icons';
	import LinkedInIcon from '$lib/components/icons/LinkedIn.svelte';
	import { Mail, MapPin, Send, MessageCircle } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
	import { animations, withViewport } from '$lib/utils/animations';

	const iconMap = {
		github: SiGithub,
		linkedin: LinkedInIcon,
		twitter: SiX
	};

	let form = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;

		// Simulate form submission (you can replace this with actual form handling)
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			submitStatus = 'success';
			form = { name: '', email: '', subject: '', message: '' };
		} catch {
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="dark:bg-secondary-900 bg-white py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<Motion {...withViewport(animations.section)} let:motion>
			<div use:motion class="mb-16 text-center">
				<h2
					class="font-display text-secondary-900 mb-4 text-3xl font-bold sm:text-4xl dark:text-white"
				>
					Let's Work Together
				</h2>
				<p class="text-secondary-600 dark:text-secondary-400 mx-auto max-w-3xl text-lg">
					I'm always interested in new opportunities, interesting projects, and meaningful
					conversations. Let's connect!
				</p>
			</div>
		</Motion>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- Contact Information -->
			<Motion {...withViewport(animations.contactInfo)} let:motion>
				<div use:motion class="space-y-8">
					<div>
						<h3 class="text-secondary-900 mb-6 text-2xl font-bold dark:text-white">Get in Touch</h3>
						<p class="text-secondary-600 dark:text-secondary-400 mb-8">
							Whether you're looking to hire, collaborate, or just want to chat about technology, I'd
							love to hear from you.
						</p>
					</div>

					<!-- Contact Methods -->
					<div class="space-y-6">
						<!-- Email -->
						<Motion {...animations.cardHover} let:motion>
							<div use:motion>
								<Card class="transition-all duration-300 hover:shadow-lg">
									<div class="flex items-center space-x-4">
										<div
											class="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 items-center justify-center rounded-lg"
										>
											<Mail class="text-primary-600 h-6 w-6" />
										</div>
										<div>
											<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">Email</h4>
											<a
												href="mailto:{contactInfo.email}"
												class="text-primary-600 hover:text-primary-700 transition-colors"
											>
												{contactInfo.email}
											</a>
										</div>
									</div>
								</Card>
							</div>
						</Motion>

						<!-- Location -->
						<Motion {...animations.cardHover} let:motion>
							<div use:motion>
								<Card class="transition-all duration-300 hover:shadow-lg">
									<div class="flex items-center space-x-4">
										<div
											class="bg-accent-100 dark:bg-accent-900/20 flex h-12 w-12 items-center justify-center rounded-lg"
										>
											<MapPin class="text-accent-600 h-6 w-6" />
										</div>
										<div>
											<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">Location</h4>
											<p class="text-secondary-600 dark:text-secondary-400">{contactInfo.location}</p>
										</div>
									</div>
								</Card>
							</div>
						</Motion>

						<!-- Response Time -->
						<Motion {...animations.cardHover} let:motion>
							<div use:motion>
								<Card class="transition-all duration-300 hover:shadow-lg">
									<div class="flex items-center space-x-4">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20"
										>
											<MessageCircle class="h-6 w-6 text-green-600" />
										</div>
										<div>
											<h4 class="text-secondary-900 text-lg font-semibold dark:text-white">
												Response Time
											</h4>
											<p class="text-secondary-600 dark:text-secondary-400">Usually within 24 hours</p>
										</div>
									</div>
								</Card>
							</div>
						</Motion>
					</div>

					<!-- Social Links -->
					<div>
						<h4 class="text-secondary-900 mb-4 text-lg font-semibold dark:text-white">
							Connect on Social Media
						</h4>
						<div class="flex space-x-4">
							{#each contactInfo.socialLinks as social (social.platform)}
								{@const IconComponent = iconMap[social.icon as keyof typeof iconMap]}
								<Motion {...animations.socialIcon} let:motion>
									<a
										use:motion
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										class="bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-primary-600 flex h-12 w-12 transform items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:text-white"
										aria-label={social.platform}
									>
										<IconComponent class="h-5 w-5" />
									</a>
								</Motion>
							{/each}
						</div>
					</div>
				</div>
			</Motion>

			<!-- Contact Form -->
			<Motion {...withViewport(animations.contactForm)} let:motion>
				<div use:motion>
					<Card>
						<h3 class="text-secondary-900 mb-6 text-2xl font-bold dark:text-white">Send a Message</h3>

						{#if submitStatus === 'success'}
							<div
								class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
							>
								<p class="text-green-800 dark:text-green-200">
									Thank you for your message! I'll get back to you soon.
								</p>
							</div>
						{:else if submitStatus === 'error'}
							<div
								class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
							>
								<p class="text-red-800 dark:text-red-200">
									Something went wrong. Please try again or email me directly.
								</p>
							</div>
						{/if}

						<form onsubmit={handleSubmit} class="space-y-6">
							<!-- Name -->
							<Motion {...animations.formField} let:motion>
								<div use:motion>
									<label
										for="name"
										class="text-secondary-900 mb-2 block text-sm font-medium dark:text-white"
									>
										Name *
									</label>
									<input
										type="text"
										id="name"
										bind:value={form.name}
										required
										class="border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 text-secondary-900 w-full rounded-lg border bg-white px-4 py-3 focus:ring-2 dark:text-white"
										placeholder="Your full name"
									/>
								</div>
							</Motion>

							<!-- Email -->
							<Motion {...animations.formField} let:motion>
								<div use:motion>
									<label
										for="email"
										class="text-secondary-900 mb-2 block text-sm font-medium dark:text-white"
									>
										Email *
									</label>
									<input
										type="email"
										id="email"
										bind:value={form.email}
										required
										class="border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 text-secondary-900 w-full rounded-lg border bg-white px-4 py-3 focus:ring-2 dark:text-white"
										placeholder="your.email@example.com"
									/>
								</div>
							</Motion>

							<!-- Subject -->
							<Motion {...animations.formField} let:motion>
								<div use:motion>
									<label
										for="subject"
										class="text-secondary-900 mb-2 block text-sm font-medium dark:text-white"
									>
										Subject *
									</label>
									<input
										type="text"
										id="subject"
										bind:value={form.subject}
										required
										class="border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 text-secondary-900 w-full rounded-lg border bg-white px-4 py-3 focus:ring-2 dark:text-white"
										placeholder="What's this about?"
									/>
								</div>
							</Motion>

							<!-- Message -->
							<Motion {...animations.formField} let:motion>
								<div use:motion>
									<label
										for="message"
										class="text-secondary-900 mb-2 block text-sm font-medium dark:text-white"
									>
										Message *
									</label>
									<textarea
										id="message"
										bind:value={form.message}
										required
										rows="5"
										class="border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 text-secondary-900 w-full resize-none rounded-lg border bg-white px-4 py-3 focus:ring-2 dark:text-white"
										placeholder="Tell me about your project, opportunity, or just say hello!"
									></textarea>
								</div>
							</Motion>

							<!-- Submit Button -->
							<Motion {...animations.buttonHover} let:motion>
								<div use:motion>
									<Button type="submit" size="lg" disabled={isSubmitting} class="group w-full" animate={false}>
										{#if isSubmitting}
											<div
												class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
											></div>
											Sending...
										{:else}
											<Send class="mr-2 h-5 w-5" />
											Send Message
										{/if}
									</Button>
								</div>
							</Motion>
						</form>
					</Card>
				</div>
			</Motion>
		</div>
	</div>
</section>
