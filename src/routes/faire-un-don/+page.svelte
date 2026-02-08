<script>
	let isVisible = $state({});

	$effect(() => {
		if (typeof window === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = { ...isVisible, [entry.target.id]: true };
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		const elements = document.querySelectorAll('[data-animate]');
		elements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Faire un Don - AFMEF</title>
	<meta name="description" content="Soutenez l'AFMEF en faisant un don. Page bientôt disponible." />
</svelte:head>

<section class="relative min-h-[70vh] bg-white flex items-center">
	<div class="relative container mx-auto px-4 max-w-[800px] py-20">
		<div id="hero-content" data-animate class="text-center {isVisible['hero-content'] ? 'animate-fade-in' : 'opacity-0'}">
			<!-- Icon -->
			<div class="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
				<svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
				</svg>
			</div>

			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
				Faire un Don
			</h1>

			<div class="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6">
				<span class="w-2 h-2 bg-secondary rounded-full"></span>
				<span class="text-gray-700 text-sm font-medium">Bientôt disponible</span>
			</div>

			<p class="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-10">
				Nous travaillons activement sur cette page pour vous permettre de soutenir les actions de l'AFMEF.
			</p>

			<!-- CTA -->
			<div class="flex flex-wrap justify-center gap-4">
				<a href="/" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Retour à l'accueil
				</a>
				<a href="/contact" class="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
					Nous contacter
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
