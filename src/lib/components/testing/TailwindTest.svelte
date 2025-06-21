<div
	class="dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 space-y-8 bg-white p-8"
>
	<h1 class="font-display text-primary-600 dark:text-primary-400 text-4xl font-bold">
		Tailwind v4 Utilities Test
	</h1>

	<!-- Layout Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Layout</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div class="bg-primary-50 dark:bg-primary-900 rounded-lg p-4">
				<p class="text-primary-700 dark:text-primary-300">Grid Col 1</p>
			</div>
			<div class="bg-primary-100 dark:bg-primary-800 rounded-lg p-4">
				<p class="text-primary-700 dark:text-primary-300">Grid Col 2</p>
			</div>
			<div class="bg-primary-200 dark:bg-primary-700 rounded-lg p-4">
				<p class="text-primary-700 dark:text-primary-300">Grid Col 3</p>
			</div>
		</div>
	</section>

	<!-- Flexbox Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Flexbox</h2>
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="bg-accent-100 dark:bg-accent-800 flex-1 rounded p-4">
				<p class="text-accent-800 dark:text-accent-200">Flex Item 1</p>
			</div>
			<div class="bg-accent-200 dark:bg-accent-700 flex-1 rounded p-4">
				<p class="text-accent-800 dark:text-accent-200">Flex Item 2</p>
			</div>
			<div class="bg-accent-300 dark:bg-accent-600 flex-shrink-0 rounded p-4">
				<p class="text-accent-800 dark:text-accent-200">Fixed Width</p>
			</div>
		</div>
	</section>

	<!-- Typography Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Typography</h2>
		<div class="space-y-2">
			<p class="text-secondary-600 dark:text-secondary-400 text-xs">Extra small text</p>
			<p class="text-secondary-600 dark:text-secondary-400 text-sm">Small text</p>
			<p class="text-secondary-700 dark:text-secondary-300 text-base">Base text</p>
			<p class="text-secondary-700 dark:text-secondary-300 text-lg">Large text</p>
			<p class="text-secondary-800 dark:text-secondary-200 text-xl font-semibold">
				Extra large text
			</p>
			<p class="text-secondary-900 dark:text-secondary-100 text-2xl font-bold">2XL text</p>
			<p class="font-display text-primary-600 dark:text-primary-400 text-3xl">Display font</p>
			<p
				class="text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-800 rounded p-2 font-mono text-sm"
			>
				Monospace code font
			</p>
		</div>
	</section>

	<!-- Colors Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Colors</h2>

		<!-- Primary Colors -->
		<div class="space-y-2">
			<h3 class="text-secondary-700 dark:text-secondary-300 text-lg font-medium">Primary Colors</h3>
			<div class="flex flex-wrap gap-2">
				<div
					class="bg-primary-50 border-secondary-200 dark:border-secondary-700 h-16 w-16 rounded border"
				></div>
				<div class="bg-primary-100 h-16 w-16 rounded"></div>
				<div class="bg-primary-200 h-16 w-16 rounded"></div>
				<div class="bg-primary-300 h-16 w-16 rounded"></div>
				<div class="bg-primary-400 h-16 w-16 rounded"></div>
				<div class="bg-primary-500 h-16 w-16 rounded"></div>
				<div class="bg-primary-600 h-16 w-16 rounded"></div>
				<div class="bg-primary-700 h-16 w-16 rounded"></div>
				<div class="bg-primary-800 h-16 w-16 rounded"></div>
				<div class="bg-primary-900 h-16 w-16 rounded"></div>
			</div>
		</div>

		<!-- Secondary Colors -->
		<div class="space-y-2">
			<h3 class="text-secondary-700 dark:text-secondary-300 text-lg font-medium">
				Secondary Colors
			</h3>
			<div class="flex flex-wrap gap-2">
				<div
					class="bg-secondary-50 border-secondary-200 dark:border-secondary-700 h-16 w-16 rounded border"
				></div>
				<div class="bg-secondary-100 h-16 w-16 rounded"></div>
				<div class="bg-secondary-200 h-16 w-16 rounded"></div>
				<div class="bg-secondary-300 h-16 w-16 rounded"></div>
				<div class="bg-secondary-400 h-16 w-16 rounded"></div>
				<div class="bg-secondary-500 h-16 w-16 rounded"></div>
				<div class="bg-secondary-600 h-16 w-16 rounded"></div>
				<div class="bg-secondary-700 h-16 w-16 rounded"></div>
				<div class="bg-secondary-800 h-16 w-16 rounded"></div>
				<div class="bg-secondary-900 h-16 w-16 rounded"></div>
			</div>
		</div>

		<!-- Accent Colors -->
		<div class="space-y-2">
			<h3 class="text-secondary-700 dark:text-secondary-300 text-lg font-medium">Accent Colors</h3>
			<div class="flex flex-wrap gap-2">
				<div
					class="bg-accent-50 border-secondary-200 dark:border-secondary-700 h-16 w-16 rounded border"
				></div>
				<div class="bg-accent-100 h-16 w-16 rounded"></div>
				<div class="bg-accent-200 h-16 w-16 rounded"></div>
				<div class="bg-accent-300 h-16 w-16 rounded"></div>
				<div class="bg-accent-400 h-16 w-16 rounded"></div>
				<div class="bg-accent-500 h-16 w-16 rounded"></div>
				<div class="bg-accent-600 h-16 w-16 rounded"></div>
				<div class="bg-accent-700 h-16 w-16 rounded"></div>
				<div class="bg-accent-800 h-16 w-16 rounded"></div>
				<div class="bg-accent-900 h-16 w-16 rounded"></div>
			</div>
		</div>
	</section>

	<!-- Spacing Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Spacing</h2>
		<div class="space-y-4">
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-1">
				<p class="text-primary-700 dark:text-primary-300">Padding 1</p>
			</div>
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-2">
				<p class="text-primary-700 dark:text-primary-300">Padding 2</p>
			</div>
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-4">
				<p class="text-primary-700 dark:text-primary-300">Padding 4</p>
			</div>
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-8">
				<p class="text-primary-700 dark:text-primary-300">Padding 8</p>
			</div>
			<div class="bg-accent-100 dark:bg-accent-800 rounded px-4 py-2">
				<p class="text-accent-700 dark:text-accent-300">Mixed padding (px-4 py-2)</p>
			</div>
		</div>
	</section>

	<!-- Border & Rounded Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Borders</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div
				class="border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800 rounded-none border p-4"
			>
				<p class="text-secondary-700 dark:text-secondary-300">No rounded</p>
			</div>
			<div
				class="border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800 rounded border p-4"
			>
				<p class="text-secondary-700 dark:text-secondary-300">Rounded</p>
			</div>
			<div
				class="border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800 rounded-lg border p-4"
			>
				<p class="text-secondary-700 dark:text-secondary-300">Rounded LG</p>
			</div>
			<div
				class="border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800 rounded-full border p-4"
			>
				<p class="text-secondary-700 dark:text-secondary-300 text-center">Full</p>
			</div>
		</div>
	</section>

	<!-- Effects Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Effects</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="dark:bg-secondary-800 rounded-lg bg-white p-4 shadow-sm">
				<p class="text-secondary-700 dark:text-secondary-300">Shadow SM</p>
			</div>
			<div class="dark:bg-secondary-800 rounded-lg bg-white p-4 shadow-md">
				<p class="text-secondary-700 dark:text-secondary-300">Shadow MD</p>
			</div>
			<div class="dark:bg-secondary-800 rounded-lg bg-white p-4 shadow-lg">
				<p class="text-secondary-700 dark:text-secondary-300">Shadow LG</p>
			</div>
		</div>
	</section>

	<!-- Interactive Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Interactive</h2>
		<div class="flex flex-wrap gap-4">
			<button
				class="bg-primary-600 hover:bg-primary-700 rounded px-4 py-2 text-white transition-colors"
			>
				Primary Button
			</button>
			<button
				class="bg-accent-500 hover:bg-accent-600 rounded px-4 py-2 text-white transition-colors"
			>
				Accent Button
			</button>
			<button
				class="border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded border px-4 py-2 transition-colors"
			>
				Outline Button
			</button>
		</div>
	</section>

	<!-- Position Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Position</h2>
		<div class="bg-secondary-100 dark:bg-secondary-800 relative h-32 rounded-lg">
			<div class="bg-primary-500 absolute top-2 left-2 rounded px-2 py-1 text-sm text-white">
				Top Left
			</div>
			<div class="bg-accent-500 absolute top-2 right-2 rounded px-2 py-1 text-sm text-white">
				Top Right
			</div>
			<div class="bg-secondary-500 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
				Bottom Left
			</div>
			<div class="absolute right-2 bottom-2 rounded bg-red-500 px-2 py-1 text-sm text-white">
				Bottom Right
			</div>
			<div
				class="dark:bg-secondary-700 absolute inset-4 flex items-center justify-center rounded bg-white"
			>
				<p class="text-secondary-700 dark:text-secondary-300">Centered with inset-4</p>
			</div>
		</div>
	</section>

	<!-- Responsive Tests -->
	<section class="space-y-4">
		<h2 class="text-secondary-800 dark:text-secondary-200 text-2xl font-semibold">Responsive</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-4 text-center">
				<p class="text-primary-700 dark:text-primary-300 text-sm">Responsive</p>
			</div>
			<div class="bg-accent-100 dark:bg-accent-800 rounded p-4 text-center">
				<p class="text-accent-700 dark:text-accent-300 text-sm">Grid</p>
			</div>
			<div class="bg-secondary-100 dark:bg-secondary-700 rounded p-4 text-center">
				<p class="text-secondary-700 dark:text-secondary-300 text-sm">Layout</p>
			</div>
			<div class="bg-primary-100 dark:bg-primary-800 rounded p-4 text-center">
				<p class="text-primary-700 dark:text-primary-300 text-sm">Test</p>
			</div>
			<div class="bg-accent-100 dark:bg-accent-800 rounded p-4 text-center">
				<p class="text-accent-700 dark:text-accent-300 text-sm">Mobile</p>
			</div>
			<div class="bg-secondary-100 dark:bg-secondary-700 rounded p-4 text-center">
				<p class="text-secondary-700 dark:text-secondary-300 text-sm">Desktop</p>
			</div>
		</div>
	</section>
</div>
