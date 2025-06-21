<script lang="ts">
	import { personalInfo, contactInfo } from '$lib/data/personal';
	import { SiGithub, SiX } from '@icons-pack/svelte-simple-icons';
	import LinkedInIcon from '$lib/components/icons/LinkedIn.svelte';
	import { Mail, MapPin } from 'lucide-svelte';

	const iconMap = {
		github: SiGithub,
		linkedin: LinkedInIcon,
		twitter: SiX,
		email: Mail
	};

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-secondary-900 text-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Brand Section -->
			<div class="col-span-1">
				<h3 class="font-display mb-4 text-xl font-bold text-white">
					{personalInfo.name}
				</h3>
				<p class="text-secondary-300 mb-4">
					{personalInfo.title}
				</p>
				<p class="text-secondary-400 text-sm leading-relaxed">
					{personalInfo.bio}
				</p>
			</div>

			<!-- Quick Links -->
			<div class="col-span-1">
				<h4 class="mb-4 text-lg font-semibold text-white">Quick Links</h4>
				<ul class="space-y-2">
					<li>
						<a href="/about" class="text-secondary-300 transition-colors hover:text-white">About</a>
					</li>
					<li>
						<a href="/experience" class="text-secondary-300 transition-colors hover:text-white"
							>Experience</a
						>
					</li>
					<li>
						<a href="/projects" class="text-secondary-300 transition-colors hover:text-white"
							>Projects</a
						>
					</li>
					<li>
						<a href="/skills" class="text-secondary-300 transition-colors hover:text-white"
							>Skills</a
						>
					</li>
					<li>
						<a href="/contact" class="text-secondary-300 transition-colors hover:text-white"
							>Contact</a
						>
					</li>
					<li>
						<a
							href={personalInfo.resumeUrl}
							class="text-secondary-300 transition-colors hover:text-white">Resume</a
						>
					</li>
				</ul>
			</div>

			<!-- Contact Info -->
			<div class="col-span-1">
				<h4 class="mb-4 text-lg font-semibold text-white">Get In Touch</h4>
				<div class="space-y-3">
					<div class="flex items-center space-x-3">
						<Mail class="text-secondary-400 h-5 w-5" />
						<a
							href="mailto:{contactInfo.email}"
							class="text-secondary-300 transition-colors hover:text-white"
						>
							{contactInfo.email}
						</a>
					</div>
					<div class="flex items-center space-x-3">
						<MapPin class="text-secondary-400 h-5 w-5" />
						<span class="text-secondary-300">{contactInfo.location}</span>
					</div>
				</div>

				<!-- Social Links -->
				<div class="mt-6">
					<h5 class="mb-3 text-base font-semibold text-white">Follow Me</h5>
					<div class="flex space-x-4">
						{#each contactInfo.socialLinks as social (social.platform)}
							{@const IconComponent = iconMap[social.icon as keyof typeof iconMap]}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-secondary-400 transition-colors hover:text-white"
								aria-label={social.platform}
							>
								<IconComponent class="h-6 w-6" />
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-secondary-800 mt-8 border-t pt-8">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<p class="text-secondary-400 text-sm">
					© {currentYear}
					{personalInfo.name}. All rights reserved.
				</p>
				<p class="text-secondary-400 mt-2 text-sm md:mt-0">Built with SvelteKit & Tailwind CSS</p>
			</div>
		</div>
	</div>
</footer>
