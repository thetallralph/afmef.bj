<script>
	/**
	 * @type {'success' | 'error' | 'warning' | 'info'}
	 */
	let {
		type = 'info',
		title = '',
		dismissible = false,
		ondismiss = null,
		children
	} = $props();

	let visible = $state(true);

	const styles = {
		success: {
			bg: 'bg-green-50 border-green-200',
			text: 'text-green-800',
			icon: 'text-green-500'
		},
		error: {
			bg: 'bg-red-50 border-red-200',
			text: 'text-red-800',
			icon: 'text-red-500'
		},
		warning: {
			bg: 'bg-yellow-50 border-yellow-200',
			text: 'text-yellow-800',
			icon: 'text-yellow-500'
		},
		info: {
			bg: 'bg-blue-50 border-blue-200',
			text: 'text-blue-800',
			icon: 'text-blue-500'
		}
	};

	const icons = {
		success: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
		error: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
		warning: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />`,
		info: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
	};

	function dismiss() {
		visible = false;
		if (ondismiss) ondismiss();
	}
</script>

{#if visible}
	<div class="rounded-xl border-2 p-4 {styles[type].bg} {styles[type].text}" role="alert">
		<div class="flex items-start gap-3">
			<svg class="w-5 h-5 mt-0.5 flex-shrink-0 {styles[type].icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{@html icons[type]}
			</svg>

			<div class="flex-1">
				{#if title}
					<h4 class="font-semibold mb-1">{title}</h4>
				{/if}
				<div class="text-sm">
					{@render children()}
				</div>
			</div>

			{#if dismissible}
				<button
					onclick={dismiss}
					class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
					aria-label="Fermer"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}
