import type { Experience } from '$lib/types';

export const experience: Experience[] = [
	{
		company: 'Bluehost',
		positions: [
			{
				title: 'Associate Manager - Software Engineering',
				duration: 'April 2025 - Present',
				description:
					'Leading a team of software engineers while driving technical initiatives and mentoring junior developers.',
				achievements: [
					'Led cross-functional team of 8+ engineers',
					'Implemented CI/CD pipeline reducing deployment time by 60%',
					'Mentored 5+ junior developers in career growth'
				],
				technologies: ['Go', 'Java', 'AWS', 'Docker', 'Kubernetes']
			},
			{
				title: 'Senior Software Engineer',
				duration: 'April 2023 - April 2025',
				description:
					'Architected and developed scalable backend systems for hosting infrastructure.',
				achievements: [
					'Designed microservices architecture serving 1M+ users',
					'Reduced system latency by 40% through performance optimization',
					'Won 2x Einstein Award for exceptional contributions'
				],
				technologies: ['Go', 'Spring Boot', 'PostgreSQL', 'AWS Lambda', 'REST APIs']
			},
			{
				title: 'Software Engineer II',
				duration: 'April 2022 - April 2023',
				description: 'Developed and maintained core hosting platform features.',
				achievements: [
					'Built real-time monitoring dashboard',
					'Implemented automated testing reducing bugs by 35%',
					'Contributed to 3 successful hackathon projects'
				],
				technologies: ['Java', 'Python', 'MongoDB', 'React', 'Vue.js']
			},
			{
				title: 'Software Engineer',
				duration: 'June 2020 - March 2022',
				description:
					'Started as a fresh graduate and quickly grew into core development responsibilities.',
				achievements: [
					'Delivered 15+ features in first year',
					'Automated manual processes saving 20+ hours/week',
					'Received recognition for innovative problem-solving'
				],
				technologies: ['Java', 'JavaScript', 'MySQL', 'Spring Boot']
			}
		]
	}
];
