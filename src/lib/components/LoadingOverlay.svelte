<script>
	let { message = "Chargement en cours..." } = $props();
</script>

<div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm">
	<div class="flex flex-col items-center gap-4">
		<!-- Logo animé -->
		<div class="relative">
			<div class="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
				</svg>
			</div>
		</div>

		<!-- Message -->
		<div class="text-center">
			<p class="text-gray-700 font-medium">{message}</p>
			<div class="flex items-center justify-center gap-1 mt-2">
				<span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
				<span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
				<span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.animate-bounce {
		animation: bounce 0.6s ease-in-out infinite;
	}
</style>
