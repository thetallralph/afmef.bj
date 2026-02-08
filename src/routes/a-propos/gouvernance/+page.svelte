<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import AboutNavLinks from '$lib/components/AboutNavLinks.svelte';

	let isVisible = $state({});

	const organs = [
		{
			title: "L'Assemblée Générale (AG)",
			description: "Organe suprême de l'Amicale, l'Assemblée Générale se réunit une (01) fois par an en session ordinaire sur convocation de la Présidente du Bureau Exécutif. Elle se réunit en session extraordinaire dans les mêmes formes et en cas de besoin.",
			roles: [
				"Définir les orientations de l'Amicale.",
				"Amender et adopter les statuts et le règlement intérieur.",
				"Élire les membres du Bureau Exécutif (BE) et du Commissariat aux comptes.",
				"Examiner les rapports d'activités du BE, des Structures Décentralisées.",
				"Examiner le rapport de gestion administrative et financière du BE et celui du Commissariat aux Comptes.",
				"Délibérer sur toutes les questions qui lui sont soumises par le Bureau Exécutif."
			],
			color: 'primary'
		},
		{
			title: "Le Bureau Exécutif (BE)",
			description: "Organe dirigeant de l'Amicale, il est composé de dix-sept (17) membres élus en Assemblée Générale pour un mandat de deux (02) ans.",
			roles: [
				"Mettre en application les décisions et recommandations de l'Assemblée Générale.",
				"Coordonner les activités des structures décentralisées."
			],
			note: "Le Bureau Exécutif rend compte à l'Assemblée Générale.",
			structuresDecentralisees: "Le Bureau Exécutif s'appuie dans l'exécution de sa mission sur les Structures décentralisées qui ont pour rôle de veiller à la mise en œuvre des directives et recommandations du Bureau Exécutif dans leurs zones respectives. Les structures décentralisées participent à la mobilisation des femmes, à leur sensibilisation aux idéaux et aux orientations de l'Amicale.",
			color: 'secondary'
		},
		{
			title: "Le Commissariat aux Comptes",
			description: "Organe de contrôle de l'Amicale, les trois (03) commissaires aux comptes sont chargées de :",
			roles: [
				"Procéder à la vérification semestrielle de la gestion du Bureau Exécutif de l'AFMEF.",
				"Dresser un rapport détaillé et un avis motivé à l'Assemblée Générale."
			],
			note: "Elles conseillent le Bureau Exécutif dans le sens de l'amélioration de sa gestion dans le strict respect des règles de transparence et de reddition des comptes.",
			color: 'red-600'
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
	<title>Gouvernance - AFMEF</title>
	<meta name="description" content="Découvrez la gouvernance de l'AFMEF, structurée autour de trois principaux organes." />
</svelte:head>

<PageHeader
	title="Gouvernance"
	subtitle="Une gestion axée sur le strict respect des textes statutaires et structurée autour de trois principaux organes"
/>

<!-- Organs Section -->
<section class="py-20 md:py-28 bg-white">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div class="space-y-16">
			{#each organs as organ, i}
				<div
					id="organ-{i}"
					data-animate
					class="grid lg:grid-cols-3 gap-8 {isVisible[`organ-${i}`] ? 'animate-fade-in' : 'opacity-0'}"
				>
					<!-- Title Card -->
					<div class="lg:col-span-1">
						<div class="sticky top-24 p-8 rounded-2xl {organ.color === 'primary' ? 'bg-primary' : organ.color === 'secondary' ? 'bg-secondary' : 'bg-red-600'}">
							<h2 class="text-2xl md:text-3xl font-bold {organ.color === 'secondary' ? 'text-gray-900' : 'text-white'}">
								{organ.title}
							</h2>
						</div>
					</div>

					<!-- Content -->
					<div class="lg:col-span-2 space-y-6">
						<p class="text-lg text-gray-600">{organ.description}</p>

						<div>
							<h3 class="font-bold text-gray-900 mb-3">Rôles et attributions :</h3>
							<ul class="space-y-2">
								{#each organ.roles as role}
									<li class="flex gap-3 text-gray-600">
										<span class="text-primary mt-1 flex-shrink-0">
											<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
										</span>
										<span>{role}</span>
									</li>
								{/each}
							</ul>
						</div>

						{#if organ.note}
							<div class="p-4 bg-primary-bg rounded-xl">
								<p class="text-gray-700 italic">{organ.note}</p>
							</div>
						{/if}

						{#if organ.structuresDecentralisees}
							<div class="p-6 bg-gray-50 rounded-xl border-l-4 border-secondary">
								<h4 class="font-bold text-gray-900 mb-2">Structures Décentralisées</h4>
								<p class="text-gray-600">{organ.structuresDecentralisees}</p>
							</div>
						{/if}
					</div>
				</div>

				{#if i < organs.length - 1}
					<div class="border-b border-gray-200"></div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<AboutNavLinks currentPage="gouvernance" />

<style>
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
