# Abhishek's Portfolio Website

A modern, animated portfolio website showcasing my work as a software engineer. Built with SvelteKit, TypeScript, and Tailwind CSS, featuring smooth animations powered by Framer Motion.

🌐 **Live Site**: [developerabhishek.live](https://developerabhishek.live)

## ✨ Features

- **Modern Tech Stack**: SvelteKit, TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion integration for engaging user experience
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Performance Optimized**: Fast loading with SvelteKit's optimizations
- **Type Safe**: Full TypeScript implementation
- **Accessible**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) via [svelte-motion](https://svelte-motion.gradientdescent.de/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Code Quality**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/developerabhishek.live.git
cd developerabhishek.live
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📝 Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run type checking
pnpm check

# Run linting
pnpm lint

# Format code with Prettier
pnpm format
```

## 🏗️ Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/        # Layout components
│   │   │   ├── sections/      # Page sections (Hero, About, etc.)
│   │   │   └── ui/            # Reusable UI components
│   │   ├── data/              # Static data (experience, projects, etc.)
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions and animations
│   ├── routes/                # SvelteKit routes
│   ├── app.html               # HTML template
│   └── app.css                # Global styles
├── static/                    # Static assets
├── docs/                      # Documentation
└── ...config files
```

## 🎨 Customization

### Data
Update your personal information, experience, and projects in the `src/lib/data/` directory:
- `personal.ts` - Personal information and contact details
- `experience.ts` - Work experience and education
- `projects.ts` - Portfolio projects
- `skills.ts` - Technical skills and competencies

### Styling
The project uses Tailwind CSS for styling. Customize:
- `tailwind.config.js` - Tailwind configuration
- `src/app.css` - Global styles and CSS variables

### Animations
Animation configurations are centralized in `src/lib/utils/animations.ts` for easy customization.

## 🚀 Deployment

This site is deployed on Vercel with automatic deployments from the main branch.

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the SvelteKit configuration
3. Set the Node.js version to 20.x in your deployment settings
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Node.js. You may need to install the appropriate [SvelteKit adapter](https://kit.svelte.dev/docs/adapters) for your target platform.

## 📊 Performance

- **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: All green
- **Bundle Size**: Optimized with SvelteKit's automatic code splitting

## 🤝 Contributing

This is a personal portfolio project, but feel free to:
- Report bugs or suggest improvements via issues
- Fork the project as a template for your own portfolio
- Submit pull requests for bug fixes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Website**: [developerabhishek.live](https://developerabhishek.live)
- **Email**: [abhishek.nexus26@gmail.com](mailto:abhishek.nexus26@gmail.com)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)

---

Built with ❤️ using SvelteKit and TypeScript
