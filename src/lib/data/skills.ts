import type { Skill } from '$lib/types';

export const skills: Skill[] = [
	{
		category: 'Programming Languages',
		items: ['Go', 'Java', 'Python', 'JavaScript', 'TypeScript', 'C#', 'Dart']
	},
	{
		category: 'Backend Technologies',
		items: ['Spring Boot', 'FastAPI', 'REST APIs', 'RPC', 'Microservices', 'GraphQL']
	},
	{
		category: 'Frontend Technologies',
		items: ['React', 'Vue.js', 'Svelte', 'Flutter', 'HTML5', 'CSS3', 'Tailwind CSS']
	},
	{
		category: 'Cloud & DevOps',
		items: ['AWS (Lambda, SSM, EC2, ECS)', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']
	},
	{
		category: 'Databases',
		items: ['MongoDB', 'PostgreSQL', 'MySQL', 'DynamoDB', 'Redis', 'Elasticsearch']
	},
	{
		category: 'Blockchain & Web3',
		items: ['Cosmos SDK', 'CosmJS', 'DeFi', 'Proof-of-stake', 'Smart Contracts']
	},
	{
		category: 'Emerging Technologies',
		items: ['AI/ML', 'Machine Learning', 'Neural Networks', 'Data Science', 'MLOps']
	},
	{
		category: 'Tools & Methodologies',
		items: ['Git', 'Agile/Scrum', 'TDD', 'System Design', 'API Design', 'Code Review']
	}
];
