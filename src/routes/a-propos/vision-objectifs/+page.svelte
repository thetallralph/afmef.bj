<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import AboutNavLinks from '$lib/components/AboutNavLinks.svelte';

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
	<title>Vision et Objectifs - AFMEF</title>
	<meta name="description" content="Découvrez la vision et les objectifs de l'AFMEF pour l'épanouissement des femmes du MEF." />
</svelte:head>

<PageHeader
	title="Vision et Objectifs"
	subtitle="Les ambitions qui guident notre action pour l'épanouissement des femmes du Ministère en charge des Finances."
/>

<!-- Objectifs Section - Same as Home -->
<section class="py-20 md:py-28 bg-white relative overflow-hidden">
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
				Créer un environnement de renforcement des liens de solidarité et d'épanouissement des femmes du Ministère de l'Économie et des Finances
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
						<p class="text-gray-600 text-lg">une ambiance de solidarité entre les femmes du Ministère en charge des Finances et les autres organisations de défense et de protection de la femme.</p>
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
						<p class="text-gray-600 text-lg">les femmes béninoises en général et celles du MEF en particulier pour leur autonomisation afin de contribuer au développement et à la prospérité de notre chère patrie le Bénin.</p>
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
						<p class="text-gray-600 text-lg">le harcèlement, les brimades et autres injustices à l'égard des femmes et porter assistance aux victimes.</p>
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
						<p class="text-gray-600 text-lg">les femmes en portant valablement et dignement leurs voix dans les cercles de décisions de notre pays.</p>
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
						<p class="text-gray-600 text-lg">des manifestations de mobilisation des femmes autour des enjeux touchant à leur bien-être.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<AboutNavLinks currentPage="vision-objectifs" />

<style>
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
</style>
