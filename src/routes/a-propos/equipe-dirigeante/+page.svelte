<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import AboutNavLinks from '$lib/components/AboutNavLinks.svelte';

	let isVisible = $state({});

	const bureauExecutif = [
		{ role: "Présidente", name: "AKOTO OKRY Vicentia", image: "https://afmef.bj/wp-content/uploads/2025/11/0R7A0246-683x1024.jpg" },
		{ role: "1ère Vice-Présidente", name: "HONONTA HOUSSOU Eudoxie", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R40-scaled-reyd20ae17wuhc3mqlrzhc8h5tk0uxul8vtmwl1qxs.jpg" },
		{ role: "2ème Vice-Présidente", name: "BERAUD Rose Abeni", image: null },
		{ role: "Secrétaire Générale", name: "SAMON Nassiratou", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R125-scaled-reycnsy6rcgv1gqdogqxsx9q07kcjlglykxhu23wyo.jpg" },
		{ role: "Trésorière Générale", name: "DJEDOU Eudoxie", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R109-scaled-reyczi1vt4hbirqpdirstz084twsbzwcwh70u0rjj4.jpg" },
		{ role: "Organisatrice Générale", name: "DJENGUE Elodie", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R113-scaled-reycsqlon181zrkbv3jfe6fua18pye1vn089jcsiao.jpg" },
		{ role: "Secrétaire Générale Adjointe", name: "VODOUHE Mariquess", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R123-scaled-reycs9ol80kw6s8wlw855apjl3k43u6pkohiwdhleo.jpg" },
		{ role: "Trésorière Générale Adjointe", name: "KPANOU KIKI Justine", image: null },
		{ role: "1ère Organisatrice Générale Adjointe", name: "AGOSSOU Laurentine", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R129-scaled-reyde2jtqofbh6kuathmhanflu3ln3qkwl7ymf5v34.jpg" },
		{ role: "2ème Organisatrice Générale Adjointe", name: "HONVO HOUNKPE Rose", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R132-scaled-reydm7tgyzks3iquqc9838n8y1y4co2u0wrgcr315s.jpg" },
		{ role: "1ère Responsable chargée de la mobilisation", name: "BABABONI Adidjatou", image: null },
		{ role: "2ème Responsable chargée de la mobilisation", name: "AHOUANDOGBO Elode", image: null },
		{ role: "Secrétaire aux Affaires Culturelles et Sportives", name: "MINANON HESSA Rosalie", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R26-scaled-reydfhb3zqcsw4j42ffh7xubon5f6rc33kg6jd2lr4.jpg" },
		{ role: "Secrétaire Adjointe aux Affaires Culturelles et Sportives", name: "ASSABA Gisèle", image: null },
		{ role: "Secrétaire à la Formation, au Genre et à l'Autonomisation des Femmes", name: "CASSA Meyrine", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R73-scaled-reydejgx5p2ha5w9k0swq6dqars7hnlqywyp9egrz4.jpg" },
		{ role: "Secrétaire Adjointe à la Formation, au Genre et à l'Autonomisation des Femmes", name: "ATTINKPAHOUN Isabelle", image: null },
		{ role: "Conseillère Juridique", name: "AZONDEKON Isabelle", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R149-scaled-reydmnsq766nkw3n515vrmm31lrcziu9r3upigfc80.jpg" }
	];

	const commissaires = [
		{ role: "1ère Commissaire aux Comptes", name: "KUADJO Christiane", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R130-scaled-reyctqbjuqky8y4g2iz90xfcuoco2vzofx0prvbjq8.jpg" },
		{ role: "2ème Commissaire aux Comptes", name: "HOUESSOU Leslie", image: "https://afmef.bj/wp-content/uploads/elementor/thumbs/R35-scaled-reydf29oyds7qd4yi8xg41my6h7jrlodpi0euxowio.jpg" },
		{ role: "3ème Commissaire aux Comptes", name: "AHOUNOU Castelle", image: null }
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
	<title>Equipe Dirigeante - AFMEF</title>
	<meta name="description" content="Découvrez l'équipe dirigeante de l'AFMEF, le Bureau Exécutif et le Commissariat aux Comptes." />
</svelte:head>

<PageHeader
	title="Équipe Dirigeante"
	subtitle="Des femmes engagées au service de l'Amicale"
/>

<!-- Bureau Executif Section -->
<section class="py-20 md:py-28 bg-white">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="be-header" data-animate class="text-center mb-16 {isVisible['be-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Leadership</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Bureau Exécutif</h2>
			<p class="text-gray-600 mt-4 max-w-2xl mx-auto">17 membres élus pour un mandat de 2 ans</p>
		</div>

		<!-- President Highlight -->
		<div id="president" data-animate class="mb-16 {isVisible['president'] ? 'animate-fade-in' : 'opacity-0'}">
			<div class="max-w-md mx-auto text-center">
				<div class="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4] max-w-xs mx-auto shadow-xl">
					<img
						src={bureauExecutif[0].image}
						alt={bureauExecutif[0].name}
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
						<p class="text-secondary font-semibold text-sm uppercase tracking-wider">{bureauExecutif[0].role}</p>
						<h3 class="text-2xl font-bold">{bureauExecutif[0].name}</h3>
					</div>
				</div>
			</div>
		</div>

		<!-- Other Members Grid -->
		<div id="be-grid" data-animate class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 {isVisible['be-grid'] ? 'animate-fade-in' : 'opacity-0'}">
			{#each bureauExecutif.slice(1) as member, i}
				<div class="group text-center" style="animation-delay: {i * 50}ms">
					<div class="relative overflow-hidden rounded-xl mb-4 aspect-[3/4] bg-gray-100">
						{#if member.image}
							<img
								src={member.image}
								alt={member.name}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center bg-primary/10">
								<svg class="w-16 h-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
								</svg>
							</div>
						{/if}
					</div>
					<p class="text-primary text-sm font-medium">{member.role}</p>
					<h3 class="font-bold text-gray-900">{member.name}</h3>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Commissariat Section -->
<section class="py-20 md:py-28 bg-primary-bg">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="cac-header" data-animate class="text-center mb-16 {isVisible['cac-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-red-600 text-sm font-semibold uppercase tracking-wider mb-4 block">Contrôle</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Commissariat aux Comptes</h2>
			<p class="text-gray-600 mt-4 max-w-2xl mx-auto">3 commissaires chargées du contrôle de gestion</p>
		</div>

		<div id="cac-grid" data-animate class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto {isVisible['cac-grid'] ? 'animate-fade-in' : 'opacity-0'}">
			{#each commissaires as member, i}
				<div class="group text-center" style="animation-delay: {i * 100}ms">
					<div class="relative overflow-hidden rounded-xl mb-4 aspect-[3/4] bg-gray-100">
						{#if member.image}
							<img
								src={member.image}
								alt={member.name}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center bg-red-50">
								<svg class="w-16 h-16 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
								</svg>
							</div>
						{/if}
					</div>
					<p class="text-red-600 text-sm font-medium">{member.role}</p>
					<h3 class="font-bold text-gray-900">{member.name}</h3>
				</div>
			{/each}
		</div>
	</div>
</section>

<AboutNavLinks currentPage="equipe-dirigeante" />

<style>
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
