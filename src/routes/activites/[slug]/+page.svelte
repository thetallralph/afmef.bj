<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let { data } = $props();

	const { activite, activitesConnexes } = data;

	// État pour le bouton copier
	let copied = $state(false);

	// URL complète de la page
	let pageUrl = $derived(browser ? window.location.href : `https://afmef.bj/activites/${activite.slug}`);

	// Formater la date
	function formatDate(date) {
		return new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}

	// Obtenir l'URL de l'image (taille appropriée)
	function getImageUrl(image, size = 'medium_large') {
		if (!image) return null;
		return image.sizes?.[size]?.source_url || image.sizes?.medium?.source_url || image.url;
	}

	// Partage sur réseaux sociaux
	function shareOnFacebook() {
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank', 'width=600,height=400');
	}

	function shareOnTwitter() {
		const text = encodeURIComponent(activite.title);
		window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${text}`, '_blank', 'width=600,height=400');
	}

	function shareOnWhatsApp() {
		const text = encodeURIComponent(`${activite.title} - ${pageUrl}`);
		window.open(`https://wa.me/?text=${text}`, '_blank');
	}

	function shareOnLinkedIn() {
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank', 'width=600,height=400');
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(pageUrl);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<svelte:head>
	<title>{activite.title} - AFMEF</title>
	<meta name="description" content={activite.excerpt} />
	<!-- Open Graph -->
	<meta property="og:title" content={activite.title} />
	<meta property="og:description" content={activite.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={pageUrl} />
	{#if activite.image?.url}
		<meta property="og:image" content={activite.image.url} />
	{/if}
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={activite.title} />
	<meta name="twitter:description" content={activite.excerpt} />
	{#if activite.image?.url}
		<meta name="twitter:image" content={activite.image.url} />
	{/if}
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-end">
	<!-- Background Image -->
	{#if getImageUrl(activite.image, 'large')}
		<div class="absolute inset-0">
			<img
				src={getImageUrl(activite.image, 'large')}
				alt=""
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
		</div>
	{:else}
		<div class="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary-darker"></div>
	{/if}

	<!-- Content -->
	<div class="relative z-10 container mx-auto px-4 max-w-[1300px] pb-10 md:pb-14 pt-24 md:pt-32">
		<!-- Breadcrumb -->
		<nav class="mb-6 md:mb-8">
			<a
				href="/activites"
				class="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Retour aux activités
			</a>
		</nav>

		<!-- Meta: Catégorie + Date -->
		<div class="flex flex-wrap items-center gap-3 mb-4 md:mb-5">
			{#if activite.types.length > 0}
				<span class="inline-block px-4 py-1.5 bg-secondary text-primary-darker text-sm font-bold rounded-full">
					{activite.types[0].name}
				</span>
			{/if}
			<time class="text-white/80 text-sm md:text-base font-medium">
				{formatDate(activite.date)}
			</time>
		</div>

		<!-- Titre -->
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl hero-title">
			{activite.title}
		</h1>
	</div>
</section>

<!-- Content Section -->
<section class="py-12 md:py-16 bg-white">
	<div class="container mx-auto px-4">
		<div class="max-w-[900px] mx-auto">
			<!-- Social Sharing - Top -->
			<div class="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
				<span class="text-sm font-medium text-gray-500">Partager :</span>
				<div class="flex items-center gap-2">
					<!-- Facebook -->
					<button
						onclick={shareOnFacebook}
						class="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
						aria-label="Partager sur Facebook"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
					</button>

					<!-- Twitter/X -->
					<button
						onclick={shareOnTwitter}
						class="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition-opacity"
						aria-label="Partager sur X"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
					</button>

					<!-- WhatsApp -->
					<button
						onclick={shareOnWhatsApp}
						class="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
						aria-label="Partager sur WhatsApp"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
						</svg>
					</button>

					<!-- LinkedIn -->
					<button
						onclick={shareOnLinkedIn}
						class="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
						aria-label="Partager sur LinkedIn"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					</button>

					<!-- Copy Link -->
					<button
						onclick={copyLink}
						class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
						aria-label="Copier le lien"
					>
						{#if copied}
							<svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						{:else}
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
						{/if}
					</button>
				</div>
				{#if copied}
					<span class="text-sm text-primary font-medium animate-fade-in">Lien copié !</span>
				{/if}
			</div>

			<!-- Article Content -->
			<article class="article-content">
				{@html activite.content}
			</article>

			<!-- Tags + Social Sharing - Bottom -->
			<div class="mt-12 pt-8 border-t border-gray-200">
				<!-- Tags -->
				{#if activite.types.length > 0}
					<div class="mb-8">
						<span class="text-sm font-medium text-gray-500 mb-3 block">Catégories :</span>
						<div class="flex flex-wrap gap-2">
							{#each activite.types as type}
								<a
									href="/activites?type={type.slug}"
									class="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-all"
								>
									{type.name}
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Share + Navigation -->
				<div class="flex flex-wrap items-center justify-between gap-6">
					<!-- Share buttons -->
					<div class="flex items-center gap-3">
						<span class="text-sm font-medium text-gray-500">Partager :</span>
						<div class="flex items-center gap-2">
							<button
								onclick={shareOnFacebook}
								class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all"
								aria-label="Partager sur Facebook"
							>
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</button>
							<button
								onclick={shareOnTwitter}
								class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all"
								aria-label="Partager sur X"
							>
								<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
								</svg>
							</button>
							<button
								onclick={shareOnWhatsApp}
								class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#25D366] hover:text-white transition-all"
								aria-label="Partager sur WhatsApp"
							>
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
								</svg>
							</button>
							<button
								onclick={copyLink}
								class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-all"
								aria-label="Copier le lien"
							>
								{#if copied}
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								{:else}
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- Back link -->
					<a
						href="/activites"
						class="inline-flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						Toutes les activités
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Section Articles Connexes -->
{#if activitesConnexes.length > 0}
	<section class="py-12 md:py-16 bg-gray-50">
		<div class="container mx-auto px-4 max-w-[1300px]">
			<!-- Titre de section -->
			<div class="mb-8">
				<h2 class="text-2xl md:text-3xl font-bold text-gray-900">Articles connexes</h2>
				<div class="w-16 h-1 bg-primary mt-3 rounded-full"></div>
			</div>

			<!-- Grille -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each activitesConnexes as item, i}
					<article
						class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
						style="animation: fadeInUp 0.6s ease-out {i * 80}ms backwards"
					>
						<a href="/activites/{item.slug}" class="block">
							<!-- Image avec ratio 4:3 fixe -->
							<div class="aspect-[4/3] overflow-hidden bg-gray-100">
								{#if getImageUrl(item.image)}
									<img
										src={getImageUrl(item.image)}
										alt={item.image?.alt || item.title}
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
										loading="lazy"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
										<svg class="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								{/if}
							</div>

							<!-- Contenu -->
							<div class="p-5">
								<!-- Badge + Date -->
								<div class="flex flex-wrap items-center gap-2 mb-3">
									{#if item.types.length > 0}
										<span class="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
											{item.types[0].name}
										</span>
									{/if}
									<time class="text-sm text-gray-500">
										{formatDate(item.date)}
									</time>
								</div>

								<!-- Titre -->
								<h3 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 line-clamp-2">
									{item.title}
								</h3>

								<!-- Lire plus -->
								<span class="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
									Lire la suite
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</div>
	</section>
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

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.hero-title {
		animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-out;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ==========================================
	   ARTICLE CONTENT STYLING
	   ========================================== */

	/* Base typography */
	.article-content {
		font-size: 1.125rem;
		line-height: 1.8;
		color: #374151;
	}

	.article-content :global(p) {
		margin-bottom: 1.5rem;
	}

	.article-content :global(p:empty) {
		display: none;
	}

	/* Headings */
	.article-content :global(h2) {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	.article-content :global(h3) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}

	.article-content :global(h4) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	/* Lists */
	.article-content :global(ul),
	.article-content :global(ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.75rem;
	}

	.article-content :global(li) {
		margin-bottom: 0.5rem;
		line-height: 1.7;
	}

	.article-content :global(ul li) {
		list-style-type: disc;
	}

	.article-content :global(ul li::marker) {
		color: #07873f;
	}

	.article-content :global(ol li) {
		list-style-type: decimal;
	}

	/* Links */
	.article-content :global(a) {
		color: #07873f;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		transition: all 0.2s;
	}

	.article-content :global(a:hover) {
		color: #043218;
		text-decoration-thickness: 2px;
	}

	/* Strong/Bold */
	.article-content :global(strong),
	.article-content :global(b) {
		font-weight: 600;
		color: #111827;
	}

	/* Blockquotes */
	.article-content :global(blockquote) {
		border-left: 4px solid #07873f;
		padding: 1rem 1.5rem;
		margin: 2rem 0;
		background: #f0fdf4;
		border-radius: 0 0.75rem 0.75rem 0;
		font-style: italic;
		color: #374151;
	}

	.article-content :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	/* ==========================================
	   IMAGES AND FIGURES
	   ========================================== */

	.article-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 1rem;
		margin: 1.5rem auto;
		display: block;
	}

	.article-content :global(figure) {
		margin: 2rem 0;
	}

	.article-content :global(figure img) {
		margin: 0 auto;
	}

	.article-content :global(figcaption) {
		text-align: center;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.75rem;
		font-style: italic;
	}

	/* ==========================================
	   WORDPRESS BLOCKS
	   ========================================== */

	/* Group blocks */
	.article-content :global(.wp-block-group) {
		margin: 1.5rem 0;
	}

	/* Image blocks */
	.article-content :global(.wp-block-image) {
		margin: 2rem 0;
	}

	.article-content :global(.wp-block-image img) {
		margin: 0 auto;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.article-content :global(.wp-block-image.aligncenter) {
		text-align: center;
	}

	.article-content :global(.wp-block-image.alignleft) {
		float: left;
		margin-right: 1.5rem;
		margin-bottom: 1rem;
		max-width: 50%;
	}

	.article-content :global(.wp-block-image.alignright) {
		float: right;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
		max-width: 50%;
	}

	/* Gallery blocks */
	.article-content :global(.wp-block-gallery) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.article-content :global(.wp-block-gallery figure) {
		margin: 0;
	}

	.article-content :global(.wp-block-gallery img) {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 0.75rem;
		margin: 0;
	}

	/* Columns */
	.article-content :global(.wp-block-columns) {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.article-content :global(.wp-block-column) {
		flex: 1;
		min-width: 250px;
	}

	/* ==========================================
	   VIDEO AND EMBED BLOCKS
	   ========================================== */

	.article-content :global(.wp-block-embed) {
		margin: 2.5rem 0;
	}

	.article-content :global(.wp-block-embed__wrapper) {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		height: 0;
		overflow: hidden;
		border-radius: 1rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.article-content :global(.wp-block-embed__wrapper iframe),
	.article-content :global(.wp-block-embed__wrapper video) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: 1rem;
	}

	/* YouTube specific */
	.article-content :global(.wp-block-embed-youtube) {
		background: #000;
		border-radius: 1rem;
		overflow: hidden;
	}

	/* Astra theme embed container */
	.article-content :global(.ast-oembed-container) {
		position: relative;
		padding-bottom: 56.25%;
		height: 0 !important;
		overflow: hidden;
	}

	.article-content :global(.ast-oembed-container iframe) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* Generic video/iframe styling */
	.article-content :global(iframe) {
		max-width: 100%;
		border-radius: 0.75rem;
	}

	.article-content :global(video) {
		max-width: 100%;
		border-radius: 1rem;
		margin: 2rem 0;
	}

	/* ==========================================
	   SPECIAL ELEMENTS
	   ========================================== */

	/* Tables */
	.article-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-size: 1rem;
	}

	.article-content :global(th),
	.article-content :global(td) {
		padding: 0.75rem 1rem;
		border: 1px solid #e5e7eb;
		text-align: left;
	}

	.article-content :global(th) {
		background: #f9fafb;
		font-weight: 600;
		color: #111827;
	}

	.article-content :global(tr:nth-child(even)) {
		background: #f9fafb;
	}

	/* Horizontal rule */
	.article-content :global(hr) {
		border: none;
		border-top: 2px solid #e5e7eb;
		margin: 2.5rem 0;
	}

	/* Code blocks */
	.article-content :global(pre),
	.article-content :global(code) {
		font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
		background: #1f2937;
		color: #e5e7eb;
		border-radius: 0.5rem;
	}

	.article-content :global(code) {
		padding: 0.125rem 0.375rem;
		font-size: 0.875em;
	}

	.article-content :global(pre) {
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
		overflow-x: auto;
	}

	.article-content :global(pre code) {
		padding: 0;
		background: transparent;
	}

	/* Emoji images (from Facebook etc) */
	.article-content :global(img[src*="emoji"]),
	.article-content :global(img[src*="fbcdn"]) {
		display: inline;
		width: 1.25em;
		height: 1.25em;
		margin: 0 0.1em;
		vertical-align: -0.2em;
		border-radius: 0;
		box-shadow: none;
	}

	/* ==========================================
	   RESPONSIVE
	   ========================================== */

	@media (max-width: 768px) {
		.article-content {
			font-size: 1rem;
		}

		.article-content :global(h2) {
			font-size: 1.5rem;
		}

		.article-content :global(h3) {
			font-size: 1.25rem;
		}

		.article-content :global(.wp-block-image.alignleft),
		.article-content :global(.wp-block-image.alignright) {
			float: none;
			max-width: 100%;
			margin-left: 0;
			margin-right: 0;
		}

		.article-content :global(.wp-block-gallery) {
			grid-template-columns: repeat(2, 1fr);
		}

		.article-content :global(.wp-block-gallery img) {
			height: 150px;
		}

		.article-content :global(.wp-block-columns) {
			flex-direction: column;
		}

		.article-content :global(.wp-block-column) {
			min-width: 100%;
		}
	}

	/* Clear floats after content */
	.article-content::after {
		content: '';
		display: table;
		clear: both;
	}
</style>
