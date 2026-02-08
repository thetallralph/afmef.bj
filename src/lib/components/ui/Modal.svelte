<script>
	let {
		open = $bindable(false),
		title = '',
		size = 'md',
		closable = true,
		children
	} = $props();

	const sizes = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function close() {
		if (closable) {
			open = false;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && closable) {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			onclick={close}
			aria-hidden="true"
		></div>

		<!-- Modal -->
		<div class="relative bg-white rounded-2xl shadow-2xl w-full {sizes[size]} max-h-[90vh] overflow-hidden animate-modal-in">
			<!-- Header -->
			{#if title || closable}
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
					{#if title}
						<h2 id="modal-title" class="text-xl font-bold text-gray-900">{title}</h2>
					{:else}
						<div></div>
					{/if}

					{#if closable}
						<button
							onclick={close}
							class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							aria-label="Fermer"
						>
							<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes modal-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.animate-modal-in {
		animation: modal-in 0.2s ease-out;
	}
</style>
