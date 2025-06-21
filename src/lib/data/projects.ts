import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
		id: 'portfolio-website',
		title: 'Personal Portfolio Website',
		description:
			'Modern, responsive portfolio built with SvelteKit and TypeScript. Features dark mode, animations, and optimized performance.',
		technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
		githubUrl: 'https://github.com/abhishekkaushik/portfolio',
		liveUrl: 'https://developerabhishek.live',
		featured: true
	},
	{
		id: 'microservices-platform',
		title: 'Hosting Platform Microservices',
		description:
			'Scalable microservices architecture for hosting platform serving millions of users. Built with Go and deployed on AWS.',
		technologies: ['Go', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL'],
		featured: true
	},
	{
		id: 'blockchain-explorer',
		title: 'Cosmos Blockchain Explorer',
		description:
			'Web3 application for exploring Cosmos blockchain transactions and validator information using CosmJS SDK.',
		technologies: ['React', 'CosmJS', 'Cosmos SDK', 'TypeScript', 'Web3'],
		githubUrl: 'https://github.com/abhishekkaushik/cosmos-explorer',
		featured: true
	},
	{
		id: 'ai-chatbot',
		title: 'AI-Powered Customer Support Bot',
		description:
			'Intelligent chatbot system using machine learning for automated customer support with 85% accuracy rate.',
		technologies: ['Python', 'FastAPI', 'TensorFlow', 'NLP', 'MongoDB'],
		featured: true
	},
	{
		id: 'real-time-dashboard',
		title: 'Real-time Analytics Dashboard',
		description:
			'Live monitoring dashboard for system metrics with WebSocket connections and interactive charts.',
		technologies: ['Vue.js', 'Node.js', 'WebSockets', 'Chart.js', 'Redis'],
		githubUrl: 'https://github.com/abhishekkaushik/analytics-dashboard',
		featured: false
	},
	{
		id: 'api-gateway',
		title: 'Enterprise API Gateway',
		description:
			'High-performance API gateway with rate limiting, authentication, and request routing capabilities.',
		technologies: ['Go', 'Redis', 'JWT', 'Docker', 'Nginx'],
		featured: false
	}
];
