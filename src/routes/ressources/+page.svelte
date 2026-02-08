<script>
	import { onMount } from 'svelte';
	import { getRessources } from '$lib/services/wordpress.js';

	// État de chargement
	let isLoading = $state(true);
	let ressources = $state([]);
	let total = $state(0);

	let selectedRessource = $state(null);

	// Charger les données
	async function loadData() {
		isLoading = true;
		try {
			const data = await getRessources({ perPage: 50 });
			ressources = data.ressources;
			total = data.total;
		} catch (error) {
			console.error('Erreur lors du chargement des ressources:', error);
			ressources = [];
		} finally {
			isLoading = false;
		}
	}

	// Ouvrir le modal avec le PDF
	function openPdfModal(ressource) {
		if (!ressource.fichier?.url) {
			window.open(ressource.link, '_blank');
			return;
		}
		selectedRessource = ressource;
		document.body.style.overflow = 'hidden';
	}

	// Fermer le modal
	function closeModal() {
		selectedRessource = null;
		document.body.style.overflow = '';
	}

	// Télécharger le PDF
	function downloadPdf() {
		if (selectedRessource?.fichier?.url) {
			const link = document.createElement('a');
			link.href = selectedRessource.fichier.url;
			link.download = selectedRessource.fichier.filename || 'document.pdf';
			link.target = '_blank';
			link.click();
		}
	}

	// Déterminer l'icône selon le type
	function getIconType(ressource) {
		const title = ressource.title.toLowerCase();
		if (title.includes('loi') || title.includes('code')) return 'law';
		if (title.includes('statut') || title.includes('règlement')) return 'document';
		if (title.includes('rapport')) return 'report';
		if (title.includes('magazine') || title.includes('plaquette')) return 'magazine';
		return 'document';
	}

	onMount(() => {
		loadData();
	});

	// Fermer avec Escape
	$effect(() => {
		if (typeof window === 'undefined') return;

		function handleKeydown(e) {
			if (e.key === 'Escape' && selectedRessource) {
				closeModal();
			}
		}

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<title>Ressources - AFMEF</title>
	<meta name="description" content="Accédez aux documents officiels, rapports, formulaires et guides de l'AFMEF." />
</svelte:head>

<!-- Hero Section (statique, s'affiche immédiatement) -->
<section class="relative bg-primary overflow-hidden">
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute -right-64 top-1/2 -translate-y-1/2 w-[900px] h-[900px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.12"></circle>
		</svg>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px] py-16 md:py-20">
		<div class="text-center max-w-3xl mx-auto">
			<span class="text-secondary text-sm font-semibold uppercase tracking-wider mb-4 block">Documentation</span>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
				Ressources
			</h1>
			<p class="text-xl text-white/80 leading-relaxed">
				Retrouvez tous les documents officiels, rapports, formulaires et guides de l'AFMEF.
			</p>
		</div>
	</div>
</section>

<!-- Resources Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container mx-auto px-4 max-w-[1200px]">
		{#if isLoading}
			<!-- Skeleton Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(6) as _, i}
					<div class="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
						<div class="flex items-start gap-4 mb-4">
							<div class="w-14 h-14 bg-gray-200 rounded-xl"></div>
							<div class="ml-auto">
								<div class="h-7 w-14 bg-gray-200 rounded-lg"></div>
							</div>
						</div>
						<div class="h-6 w-full bg-gray-200 rounded mb-2"></div>
						<div class="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
						<div class="h-4 w-full bg-gray-200 rounded mb-2"></div>
						<div class="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
						<div class="pt-4 border-t border-gray-100">
							<div class="h-5 w-24 bg-gray-200 rounded ml-auto"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if ressources && ressources.length > 0}
			<!-- Resources Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each ressources as ressource, i (ressource.id)}
					{@const iconType = getIconType(ressource)}
					<button
						onclick={() => openPdfModal(ressource)}
						class="group bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
						style="animation: fadeInUp 0.5s ease-out {i * 50}ms backwards"
					>
						<!-- Header avec icône -->
						<div class="flex items-start gap-4 mb-4">
							<div class="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
								{#if iconType === 'law'}
									<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
									</svg>
								{:else if iconType === 'magazine'}
									<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
									</svg>
								{:else if iconType === 'report'}
									<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
									</svg>
								{:else}
									<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
									</svg>
								{/if}
							</div>

							<!-- Badge PDF -->
							{#if ressource.fichier}
								<div class="ml-auto">
									<span class="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase">
										<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z"/>
										</svg>
										PDF
									</span>
								</div>
							{/if}
						</div>

						<!-- Titre -->
						<h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
							{ressource.title}
						</h3>

						<!-- Description -->
						{#if ressource.description}
							<p class="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
								{ressource.description}
							</p>
						{/if}

						<!-- Footer -->
						<div class="flex items-center justify-end pt-4 border-t border-gray-100">
							<span class="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
								Consulter
								<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
								</svg>
							</span>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="text-center py-16">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune ressource disponible</h3>
				<p class="text-gray-600">Les ressources seront bientôt disponibles.</p>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section (statique) -->
<section class="py-16 bg-white">
	<div class="container mx-auto px-4 max-w-[900px]">
		<div class="text-center">
			<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
				Vous ne trouvez pas ce que vous cherchez ?
			</h2>
			<p class="text-gray-600 mb-8 max-w-xl mx-auto">
				Contactez-nous et nous vous aiderons à trouver les informations dont vous avez besoin.
			</p>
			<a href="/contact" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-all duration-300">
				Nous contacter
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- PDF Modal -->
{#if selectedRessource}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-fast"
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		onclick={(e) => e.target === e.currentTarget && closeModal()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-scale-in">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
				<div class="flex items-center gap-3 min-w-0 flex-1">
					<div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
						</svg>
					</div>
					<h3 id="modal-title" class="font-semibold text-gray-900 truncate">{selectedRessource.title}</h3>
				</div>

				<div class="flex items-center gap-1 flex-shrink-0">
					<button
						onclick={downloadPdf}
						class="p-2.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
						title="Télécharger"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
						</svg>
					</button>

					<a
						href={selectedRessource.fichier?.url || selectedRessource.link}
						target="_blank"
						rel="noopener noreferrer"
						class="p-2.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
						title="Ouvrir dans un nouvel onglet"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
					</a>

					<button
						onclick={closeModal}
						class="p-2.5 text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors ml-2"
						title="Fermer (Échap)"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<div class="flex-1 bg-gray-100 overflow-hidden">
				<iframe
					src="{selectedRessource.fichier.url}#toolbar=1&navpanes=0&scrollbar=1"
					class="w-full h-full border-0"
					title={selectedRessource.title}
				></iframe>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-fast {
		animation: fadeIn 0.2s ease-out forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.animate-scale-in {
		animation: scaleIn 0.25s ease-out forwards;
	}

	@keyframes scaleIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
