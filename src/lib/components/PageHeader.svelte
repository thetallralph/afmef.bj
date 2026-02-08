<script>
	let { title, subtitle, badge = "À propos" } = $props();
</script>

<section class="relative bg-primary py-16 md:py-24 overflow-hidden">
	<!-- Decorative circle -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.08"></circle>
		</svg>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div class="text-center max-w-3xl mx-auto animate-fade-in">
			<span class="text-secondary text-sm font-semibold uppercase tracking-wider mb-4 block">{badge}</span>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
				{title}
			</h1>
			{#if subtitle}
				<p class="text-lg md:text-xl text-white/80 leading-relaxed">
					{subtitle}
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
