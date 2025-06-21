// Animation configurations for the portfolio
export const animations = {
	// Page entrance animations
	pageEnter: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.5, ease: 'easeOut' }
	},

	// Section animations with staggering
	section: {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6, ease: 'easeOut' }
	},

	// Card hover animations
	cardHover: {
		whileHover: {
			scale: 1.02,
			y: -8,
			transition: { duration: 0.2, ease: 'easeOut' }
		},
		whileTap: { scale: 0.98 }
	},

	// Button hover animations
	buttonHover: {
		whileHover: { scale: 1.05 },
		whileTap: { scale: 0.95 },
		transition: { duration: 0.2 }
	},

	// Icon animations
	iconFloat: {
		animate: {
			y: [0, -8, 0],
			rotate: [0, 5, 0]
		},
		transition: {
			duration: 3,
			repeat: Infinity,
			ease: 'easeInOut'
		}
	},

	// Skill badge animations
	skillBadge: {
		initial: { opacity: 0, scale: 0.8 },
		animate: { opacity: 1, scale: 1 },
		whileHover: { scale: 1.1 },
		transition: { duration: 0.3 }
	},

	// Text reveal animations
	textReveal: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 }
	},

	// Stagger container for lists
	staggerContainer: {
		initial: {},
		animate: {
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1
			}
		},
		transition: { duration: 0.6 }
	},

	// Stagger child item
	staggerChild: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 }
	},

	// About section specific animations
	aboutContent: {
		initial: { opacity: 0, x: -30 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.6, ease: 'easeOut' }
	},

	aboutImage: {
		initial: { opacity: 0, x: 30 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 }
	},

	aboutValues: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5, ease: 'easeOut' }
	},

	// Experience timeline animations
	timelineCompany: {
		initial: { opacity: 0, x: -30 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.5, ease: 'easeOut' }
	},

	timelinePosition: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.4, ease: 'easeOut' }
	},

	timelineDot: {
		initial: { scale: 0 },
		animate: { scale: 1 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	// Contact form animations
	contactInfo: {
		initial: { opacity: 0, x: -30 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.6, ease: 'easeOut' }
	},

	contactForm: {
		initial: { opacity: 0, x: 30 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 }
	},

	formField: {
		initial: { opacity: 0, y: 15 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	socialIcon: {
		whileHover: {
			scale: 1.1,
			rotate: 5,
			transition: { duration: 0.2 }
		},
		whileTap: { scale: 0.95 }
	}
};

// Utility function to add delay to animations
export const withDelay = (animation: any, delay: number) => ({
	...animation,
	transition: {
		...animation.transition,
		delay
	}
});

// Viewport-based animations (for scroll-triggered animations)
export const viewport = {
	once: true,
	amount: 0.2,
	margin: '-100px'
};

// Helper function to combine animation with viewport settings
export const withViewport = (animation: any) => ({
	...animation,
	viewport
});
