<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import AboutNavLinks from '$lib/components/AboutNavLinks.svelte';

	let isVisible = $state({});

	const colors = [
		{
			color: 'vert',
			meaning: "l'espérance d'un monde meilleur où les femmes seront davantage valorisées",
			bgClass: 'bg-primary',
			textClass: 'text-white'
		},
		{
			color: 'rouge',
			meaning: "la bravoure reconnue de la femme fièrement incarnée par nos illustres amazones",
			bgClass: 'bg-red-600',
			textClass: 'text-white'
		},
		{
			color: 'jaune',
			meaning: "ressource inestimable de la femme dans la construction de notre nation",
			bgClass: 'bg-secondary',
			textClass: 'text-gray-900'
		}
	];

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
	<title>Logo - AFMEF</title>
	<meta name="description" content="Découvrez la signification du logo de l'AFMEF et son symbolisme." />
</svelte:head>

<PageHeader
	title="Logo"
	subtitle="Une identité qui illustre la solidarité entre les femmes du MEF"
/>

<!-- Logo Section -->
<section class="py-20 md:py-28 bg-white">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="logo-content" data-animate class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center {isVisible['logo-content'] ? 'animate-fade-in' : 'opacity-0'}">
			<!-- Logo Image -->
			<div class="flex justify-center">
				<div class="relative">
					<div class="absolute -inset-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-red-100 rounded-full blur-2xl"></div>
					<img
						src="https://afmef.bj/wp-content/uploads/2024/03/image.png"
						alt="Logo AFMEF"
						class="relative w-full max-w-md"
					/>
				</div>
			</div>

			<!-- Description -->
			<div>
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Symbolisme du Logo</h2>

				<p class="text-lg text-gray-600 mb-8">
					Le logo type de l'Amicale symbolise l'esprit de solidarité à travers une illustration abstraite et harmonieuse de trois figures féminines enlacées. Chacune portant fièrement les couleurs nationales qui s'apparentent aux qualités intrinsèques de la femme béninoise dans toute sa diversité, notamment :
				</p>

				<div class="space-y-4 mb-8">
					{#each colors as item, i}
						<div
							class="flex items-start gap-4 p-4 rounded-xl {item.bgClass}"
							style="animation-delay: {i * 100}ms"
						>
							<div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
								<span class="{item.textClass} font-bold uppercase">{item.color.charAt(0)}</span>
							</div>
							<div>
								<h3 class="font-bold {item.textClass} capitalize mb-1">Le {item.color}</h3>
								<p class="{item.textClass} opacity-90">pour {item.meaning}</p>
							</div>
						</div>
					{/each}
				</div>

				<div class="p-6 bg-primary-bg rounded-xl border-l-4 border-primary">
					<p class="text-gray-700 italic">
						Les trois figures portent une couronne protectrice pour représenter l'Amicale.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<AboutNavLinks currentPage="logo" />

<style>
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
