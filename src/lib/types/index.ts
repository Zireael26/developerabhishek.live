export interface Experience {
	company: string;
	positions: Position[];
}

export interface Position {
	title: string;
	duration: string;
	description?: string;
	achievements?: string[];
	technologies?: string[];
}

export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	githubUrl?: string;
	liveUrl?: string;
	imageUrl?: string;
	featured: boolean;
}

export interface Skill {
	category: string;
	items: string[];
}

export interface Education {
	institution: string;
	degree: string;
	duration: string;
	cgpa?: string;
	achievements?: string[];
}

export interface SocialLink {
	platform: string;
	url: string;
	icon: string;
}

export interface ContactInfo {
	email: string;
	phone?: string;
	location: string;
	socialLinks: SocialLink[];
}
