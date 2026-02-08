<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let currentSlide = $state(0);
	let isVisible = $state({});
	let scrollOffset = $state(0);

	// Data from server
	const sliderArticles = data.sliderArticles;
	const newsArticles = data.newsArticles;

	const activities = [
		{
			title: 'Renforcement de capacités',
			image: 'https://afmef.bj/wp-content/uploads/2025/11/5D3_0067-1024x606.jpg',
			descriptions: [
				'Ateliers, conférences et séminaires spécialisés pour renforcer les compétences techniques et transversales des femmes du MEF.',
				'Nos programmes sont conçus pour répondre aux défis spécifiques rencontrés par les femmes dans leur parcours professionnel au sein du ministère.'
			],
			link: '/activite?type=renforcement-de-capacites'
		},
		{
			title: 'Actions socio-communautaires',
			image: 'https://afmef.bj/wp-content/uploads/2025/11/0R7A9304-1024x683.jpg',
			descriptions: [
				'Contribuer à soulager à travers des actions sociales, les personnes en situation de précarité et plus spécifiquement les enfants orphelins.'
			],
			link: '/activite?type=actions-sociales'
		},
		{
			title: 'Célébrations',
			image: 'https://afmef.bj/wp-content/uploads/2025/11/031A5390-1024x683.jpg',
			descriptions: [
				'Soutenir la vision et l\'engagement du Chef de l\'État pour intensifier la défense des droits des femmes et combattre toutes les manifestations de violence à l\'encontre des femmes.',
				'Travailler en étroite collaboration avec le Ministre d\'État, Ministre de tutelle pour offrir plus d\'opportunités aux talents féminins.'
			],
			link: '/activite?type=celebrations-diverses'
		},
		{
			title: 'Sensibilisation & Communication',
			image: 'https://afmef.bj/wp-content/uploads/2025/11/5D3_0013-copie-1024x683.jpg',
			descriptions: [
				'Organiser au profit des membres, des activités de réjouissance, sportives, cultuelles et touristiques pour favoriser le partage, la solidarité et l\'évasion.',
				'Célébrer collectivement nos réussites et affronter conjointement les aléas de la vie.'
			],
			link: '/activite?type=sensibilisation-communication'
		},
		{
			title: 'Initiatives diverses',
			image: 'https://afmef.bj/wp-content/uploads/2025/03/8W6A2398-2.png',
			descriptions: [
				'Mener des actions sociales et humanitaires en faveur des populations vulnérables, notamment les femmes et les familles dans le besoin.',
				'Développer des initiatives de proximité permettant de toucher directement les communautés et d\'apporter des solutions concrètes aux problématiques locales.'
			],
			link: '/activite?type=autres-initiatives'
		}
	];

	function nextSlide() {
		if (sliderArticles.length === 0) return;
		currentSlide = (currentSlide + 1) % sliderArticles.length;
	}

	function prevSlide() {
		if (sliderArticles.length === 0) return;
		currentSlide = (currentSlide - 1 + sliderArticles.length) % sliderArticles.length;
	}

	function goToSlide(index) {
		currentSlide = index;
	}

	// Auto-play carousel
	$effect(() => {
		if (sliderArticles.length === 0) return;
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	});

	// Intersection Observer for scroll animations
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

	// Scroll-based marquee animation
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleScroll = () => {
			scrollOffset = window.scrollY * 0.5;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<title>Accueil - AFMEF - Association des Femmes du Ministère de l'Économie des Finances</title>
	<meta name="description" content="AFMEF, un creuset permanent de renforcement des liens de solidarité et d'épanouissement des femmes du Ministère en charge des Finances." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen overflow-hidden bg-primary">
	<!-- Background image -->
	<div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://afmef.bj/wp-content/uploads/2025/03/Capture-decran-2025-03-12-092700.png');"></div>

	<!-- Green overlay with gradient -->
	<div class="absolute inset-0 bg-primary/90"></div>
	<div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[150px]"></div>

	<!-- Large decorative yellow circle behind slider -->
	<div class="absolute inset-0 overflow-hidden">
		<svg class="absolute right-[500px] sm:hidden lg:right-[400px] top-1/2 -translate-y-1/2 w-[1400px] h-[1400px] lg:w-[1600px] lg:h-[1600px] pointer-events-none" viewBox="0 0 1838 1838" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181"></circle>
		</svg>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px] pt-24 pb-16 md:pt-32 md:pb-24">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
			<!-- Left Content -->
			<div class="text-white order-2 lg:order-1">
				<h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
					<span class="text-white">Le travail,</span>
					<br />
					<span class="text-secondary">notre bouclier.</span>
					<br />
					<span class="text-white/90">Ensemble</span>
					<span class="text-white"> plus fortes.</span>
				</h1>

				<p class="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
					Un creuset permanent de renforcement des liens de solidarité et d'épanouissement des femmes du Ministère en charge des Finances.
				</p>

				<a href="#objectifs" class="group inline-flex items-center gap-2 bg-secondary hover:bg-yellow-400 text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5">
					Découvrir plus
					<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</a>
			</div>

			<!-- Right - Carousel -->
			<div class="relative order-1 lg:order-2">
				<div class="relative">
					<!-- Main carousel -->
					<div class="relative overflow-hidden rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl shadow-2xl shadow-black/50 aspect-[4/3]">
						{#if sliderArticles.length > 0}
							{#each sliderArticles as article, i}
								<a
									href="/activite/{article.slug}"
									class="absolute inset-0 transition-all duration-700 ease-out cursor-pointer"
									class:opacity-100={i === currentSlide}
									class:opacity-0={i !== currentSlide}
									class:scale-100={i === currentSlide}
									class:scale-105={i !== currentSlide}
									class:pointer-events-none={i !== currentSlide}
								>
									<img src={article.image.url} alt={article.title} class="w-full h-full object-cover" />
									<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
									<!-- Article title overlay -->
									<div class="absolute bottom-16 left-4 right-4 text-white">
										{#if article.types?.length > 0}
											<span class="inline-block px-3 py-1 bg-secondary text-gray-900 text-xs font-semibold rounded mb-2">{article.types[0].name}</span>
										{/if}
										<h3 class="text-lg md:text-xl font-bold line-clamp-2 drop-shadow-lg">{article.title}</h3>
									</div>
								</a>
							{/each}

							<!-- Carousel Controls -->
							<div class="absolute inset-x-4 bottom-4 flex items-center justify-between z-10">
								<div class="flex gap-2">
									{#each sliderArticles as _, i}
										<button
											onclick={() => goToSlide(i)}
											class="w-2 h-2 rounded-full transition-all duration-300 {i === currentSlide ? 'bg-secondary w-8' : 'bg-white/50 hover:bg-white/80'}"
											aria-label="Aller à la diapositive {i + 1}"
										></button>
									{/each}
								</div>

								<div class="flex gap-2">
									<button
										onclick={prevSlide}
										class="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all"
										aria-label="Diapositive précédente"
									>
										<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										onclick={nextSlide}
										class="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all"
										aria-label="Diapositive suivante"
									>
										<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							</div>
						{:else}
							<!-- Fallback if no articles -->
							<div class="absolute inset-0 bg-primary-dark/30 flex items-center justify-center">
								<span class="text-white/60">Chargement...</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Actualités Section -->
<section class="py-20 md:py-28 bg-white relative overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
	<div class="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
	<div class="absolute top-1/2 right-20 w-16 h-16 border-2 border-primary/10 rounded-full"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="news-header" data-animate class="text-center mb-12 {isVisible['news-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Actualités</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-6">
				Actualités & Initiatives
			</h2>
			<a href="/actualites" class="group inline-flex items-center gap-2 text-primary-dark font-semibold hover:gap-3 transition-all">
				Voir toutes les actualités
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</div>

		<div id="news-grid" data-animate class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
			{#if newsArticles.length > 0}
				{#each newsArticles as article, i}
					<article class="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 {isVisible['news-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: {i * 100}ms">
						<a href="/activite/{article.slug}" class="block">
							<div class="aspect-[4/3] overflow-hidden relative">
								{#if article.image?.url}
									<img src={article.image.url} alt={article.image.alt || article.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
								{:else}
									<div class="w-full h-full bg-primary/10 flex items-center justify-center">
										<svg class="w-16 h-16 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								{/if}
								<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							</div>
							<div class="p-6">
								{#if article.types?.length > 0}
									<span class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded mb-4">{article.types[0].name}</span>
								{/if}
								<h3 class="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
									{article.title}
								</h3>
							</div>
						</a>
					</article>
				{/each}
			{:else}
				<!-- Empty state -->
				<div class="col-span-2 text-center py-12 text-gray-500">
					<p>Aucune actualité disponible pour le moment.</p>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Objectifs Section -->
<section id="objectifs" class="py-20 md:py-28 bg-primary-bg relative overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
	<div class="absolute bottom-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
	<div class="absolute top-1/3 left-20 w-4 h-4 bg-primary rounded-full"></div>
	<div class="absolute bottom-1/4 right-1/4 w-3 h-3 bg-secondary rounded-full"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<!-- Section Header -->
		<div id="objectives-header" data-animate class="mb-16 {isVisible['objectives-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Objectifs</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark max-w-4xl leading-tight">
				Créer un environnement de renforcement des liens de solidarité et d'épanouissement des femmes du Ministère de l'Economie et des Finances
			</h2>
		</div>

		<!-- Two Column Layout -->
		<div id="objectives-grid" data-animate class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
			<!-- Left - Sticky Image -->
			<div class="lg:sticky lg:top-24 flex-shrink-0">
				<img
					src="https://afmef.bj/wp-content/uploads/2025/03/objectif-image.png"
					alt="Objectifs AFMEF"
					class="w-[420px] max-h-[600px] object-cover object-top rounded-t-2xl rounded-b-full {isVisible['objectives-grid'] ? 'animate-fade-in' : 'opacity-0'}"
				/>
			</div>

			<!-- Right - Objectives List -->
			<div class="flex-1 space-y-0">
				<!-- Objective 1 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 0ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 10.5h-1.5A3.375 3.375 0 007.5 14.25v4.5m6-6V6.75a3 3 0 00-3-3h0a3 3 0 00-3 3v3m6 0h-6"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Favoriser</h3>
						<p class="text-gray-600 text-lg">la promotion et l'épanouissement des femmes du Ministère en charge des Finances.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 2 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 100ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Créer et développer</h3>
						<p class="text-gray-600 text-lg">une ambiance de solidarité entre les femmes du Ministère en charge des Finances.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 3 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 200ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Sensibiliser</h3>
						<p class="text-gray-600 text-lg">les femmes du MEF pour leur autonomisation et leur participation au développement et à la prospérité.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 4 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 300ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Contribuer à lutter</h3>
						<p class="text-gray-600 text-lg">contre la pauvreté et les fléaux socioprofessionnels.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 5 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 400ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Combattre</h3>
						<p class="text-gray-600 text-lg">le harcèlement, les brimades, l'injustice à l'égard des femmes et assister les victimes.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 6 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 500ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Représenter</h3>
						<p class="text-gray-600 text-lg">les femmes dans les discussions avec les autorités.</p>
					</div>
				</div>
				<div class="border-b border-gray-200"></div>

				<!-- Objective 7 -->
				<div class="flex gap-4 py-6 {isVisible['objectives-grid'] ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 600ms">
					<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/></svg>
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-1">Organiser</h3>
						<p class="text-gray-600 text-lg">les manifestations de mobilisation des femmes pour leur émancipation.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Values Marquee -->
<section class="py-8 bg-primary overflow-hidden">
	<div class="marquee-container">
		<div class="marquee-scroll flex items-center" style="transform: translateX(-{scrollOffset % 1500}px)">
			{#each ['Engagement', 'Autonomisation', 'Solidarité', 'Réussite', 'Plaidoyer', 'Leadership', 'Épanouissement', 'Excellence'] as value}
				<span class="text-white text-2xl md:text-4xl lg:text-5xl font-bold px-8 md:px-12 whitespace-nowrap">{value}</span>
				<span class="text-secondary text-3xl md:text-4xl">✦</span>
			{/each}
			{#each ['Engagement', 'Autonomisation', 'Solidarité', 'Réussite', 'Plaidoyer', 'Leadership', 'Épanouissement', 'Excellence'] as value}
				<span class="text-white text-2xl md:text-4xl lg:text-5xl font-bold px-8 md:px-12 whitespace-nowrap">{value}</span>
				<span class="text-secondary text-3xl md:text-4xl">✦</span>
			{/each}
			{#each ['Engagement', 'Autonomisation', 'Solidarité', 'Réussite', 'Plaidoyer', 'Leadership', 'Épanouissement', 'Excellence'] as value}
				<span class="text-white text-2xl md:text-4xl lg:text-5xl font-bold px-8 md:px-12 whitespace-nowrap">{value}</span>
				<span class="text-secondary text-3xl md:text-4xl">✦</span>
			{/each}
		</div>
	</div>
</section>

<!-- Activités Section -->
<section class="py-20 md:py-28 bg-bg-light-yellow relative overflow-hidden">
	<!-- Decorative curved lines -->
	<div class="absolute top-1/3 right-0 w-[800px] h-[800px] pointer-events-none hidden lg:block -translate-y-1/4">
		<svg viewBox="0 0 800 800" fill="none" class="w-full h-full">
			<path d="M800 50 Q500 400 800 750" stroke="#07873f" stroke-width="12" fill="none" opacity="0.2"/>
			<path d="M800 120 Q550 400 800 680" stroke="#dc2626" stroke-width="8" fill="none" opacity="0.2"/>
		</svg>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="activities-header" data-animate class="text-center mb-16 {isVisible['activities-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-red-600 text-sm font-semibold uppercase tracking-wider mb-4 block">Activités</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
				Des initiatives concrètes au service de nos membres & de la communauté
			</h2>
		</div>

		<!-- Grid with vertical stagger effect - 2 columns -->
		<div id="activities-grid" data-animate class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-start">
			{#each activities as activity, i}
				<a
					href={activity.link}
					class="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 {isVisible['activities-grid'] ? 'animate-fade-in-up' : 'opacity-0'} {i % 2 === 1 ? 'md:mt-24' : ''} hover:-translate-y-2"
					style="animation-delay: {i * 100}ms"
				>
					<!-- Image with overlay -->
					<div class="relative overflow-hidden aspect-[4/3]">
						<img
							src={activity.image}
							alt={activity.title}
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
						/>
						<!-- Gradient overlay -->
						<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent"></div>

						<!-- Title on image -->
						<div class="absolute bottom-0 left-0 right-0 p-5">
							<h3 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg group-hover:text-secondary transition-colors duration-300">{activity.title}</h3>
						</div>
					</div>

					<!-- Content -->
					<div class="p-5 bg-white">
						<ul class="space-y-2 mb-4 text-gray-600">
							{#each activity.descriptions.slice(0, 2) as desc}
								<li class="flex gap-2 text-sm">
									<span class="text-primary mt-0.5 flex-shrink-0">•</span>
									<span class="line-clamp-2">{desc}</span>
								</li>
							{/each}
						</ul>

						<div class="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
							<span>En savoir plus</span>
							<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section - Same style as Hero -->
<section class="relative py-24 md:py-32 overflow-hidden bg-primary">
	<!-- Background image - same as hero -->
	<div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://afmef.bj/wp-content/uploads/2025/03/Capture-decran-2025-03-12-092700.png');"></div>

	<!-- Green overlay -->
	<div class="absolute inset-0 bg-primary/90"></div>
	<div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[150px]"></div>

	<!-- Large decorative yellow circle -->
	<div class="absolute inset-0 overflow-hidden">
		<svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px] pointer-events-none" viewBox="0 0 1838 1838" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.15"></circle>
		</svg>
	</div>

	<div id="cta-section" data-animate class="relative container mx-auto px-4 max-w-[1300px] text-center {isVisible['cta-section'] ? 'animate-fade-in' : 'opacity-0'}">
		<h2 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
			Ensemble, nous sommes
			<span class="text-secondary"> plus fortes</span>
		</h2>
		<p class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
			Rejoignez un réseau de femmes engagées et déterminées à faire rayonner les compétences féminines au sein de notre ministère et au-delà.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a href="/adhesion" class="group inline-flex items-center gap-2 bg-secondary hover:bg-yellow-400 text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5">
				Devenir membre
				<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
			<a href="/contact" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full border border-white/20 transition-all duration-300 hover:-translate-y-0.5">
				Nous contacter
			</a>
		</div>
	</div>
</section>

<style>
	/* Scroll-based marquee */
	.marquee-container {
		overflow: hidden;
	}
	.marquee-scroll {
		display: flex;
		will-change: transform;
	}

	/* Pulse animation for background blobs */
	.animate-pulse-slow {
		animation: pulse-slow 8s ease-in-out infinite;
	}
	@keyframes pulse-slow {
		0%, 100% { opacity: 0.2; transform: scale(1); }
		50% { opacity: 0.3; transform: scale(1.1); }
	}

	/* Animation delays */
	.animation-delay-1000 {
		animation-delay: 1000ms;
	}
	.animation-delay-2000 {
		animation-delay: 2000ms;
	}

	/* Fade in animations */
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
	}
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* Line clamp for card titles */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
