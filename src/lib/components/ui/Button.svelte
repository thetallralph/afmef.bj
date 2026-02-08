<script>
	/**
	 * @type {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'}
	 */
	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		href = null,
		class: className = '',
		onclick = null,
		children
	} = $props();

	const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants = {
		primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
		secondary: 'bg-secondary hover:bg-secondary-dark text-gray-900 focus:ring-secondary',
		outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
		ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
		danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
	};

	const sizes = {
		sm: 'py-2 px-4 text-sm',
		md: 'py-3 px-6 text-base',
		lg: 'py-4 px-8 text-lg'
	};

	const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
</script>

{#if href && !disabled}
	<a {href} class={classes}>
		{#if loading}
			<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{/if}
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} disabled={disabled || loading} {onclick}>
		{#if loading}
			<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{/if}
		{@render children()}
	</button>
{/if}
