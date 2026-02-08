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
	<title>Espace Membre - AFMEF</title>
	<meta name="description" content="Accédez à votre espace membre AFMEF. Page bientôt disponible." />
</svelte:head>

<section class="relative min-h-[70vh] bg-white flex items-center">
	<div class="relative container mx-auto px-4 max-w-[800px] py-20">
		<div id="hero-content" data-animate class="text-center {isVisible['hero-content'] ? 'animate-fade-in' : 'opacity-0'}">
			<!-- Icon -->
			<div class="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
				<svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
				</svg>
			</div>

			<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
				Espace Membre
			</h1>

			<div class="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6">
				<span class="w-2 h-2 bg-secondary rounded-full"></span>
				<span class="text-gray-700 text-sm font-medium">Bientôt disponible</span>
			</div>

			<p class="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-10">
				Votre espace personnel pour accéder aux ressources exclusives, événements et services réservés aux membres de l'AFMEF.
			</p>

			<!-- CTA -->
			<div class="flex flex-wrap justify-center gap-4">
				<a href="/" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Retour à l'accueil
				</a>
				<a href="/adhesion" class="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
					Devenir membre
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
