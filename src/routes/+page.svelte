<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
</script>

<svelte:head>
	<title
		>Abhishek Kaushik - Associate Software Engineering Manager & Principal Software Architect</title
	>
	<meta
		name="description"
		content="Software engineering leader with 5+ years of experience building scalable systems and leading high-performing teams. Currently focused on AI/ML integration and emerging technologies."
	/>
	<meta
		name="keywords"
		content="Software Engineer, Engineering Manager, Principal Architect, Full Stack Developer, Go Developer, AI Engineer, Blockchain Developer"
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="Abhishek Kaushik - Software Engineering Leader" />
	<meta
		property="og:description"
		content="Software engineering leader with 5+ years of experience building scalable systems and leading high-performing teams."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://developerabhishek.live" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Abhishek Kaushik - Software Engineering Leader" />
	<meta
		name="twitter:description"
		content="Software engineering leader with 5+ years of experience building scalable systems and leading high-performing teams."
	/>
</svelte:head>

<Hero />
<About />
<Experience />
<Skills />
<Projects />
<Contact />
