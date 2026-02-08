<script>
	let isVisible = $state({});

	const avantages = [
		{
			icon: 'users',
			title: 'Réseau solidaire',
			description: 'Intégrez un réseau de femmes engagées et bénéficiez du soutien de vos pairs dans votre parcours professionnel et personnel.'
		},
		{
			icon: 'sparkles',
			title: 'Développement personnel',
			description: 'Accédez à des ateliers, formations et séminaires pour renforcer vos compétences et vous épanouir.'
		},
		{
			icon: 'shield',
			title: 'Protection & accompagnement',
			description: 'Bénéficiez d\'un accompagnement en cas de difficultés professionnelles, harcèlement ou injustice.'
		},
		{
			icon: 'megaphone',
			title: 'Voix collective',
			description: 'Participez aux discussions avec les autorités et faites entendre votre voix sur les sujets qui vous concernent.'
		},
		{
			icon: 'calendar',
			title: 'Événements exclusifs',
			description: 'Participez à des activités de réjouissance, sportives, cultuelles et touristiques réservées aux membres.'
		},
		{
			icon: 'heart',
			title: 'Entraide & solidarité',
			description: 'Bénéficiez de la solidarité du groupe dans les moments de joie comme dans les épreuves de la vie.'
		}
	];

	const conditions = [
		{
			number: '01',
			title: 'Être femme',
			description: 'L\'AFMEF est ouverte à toutes les femmes, sans distinction.'
		},
		{
			number: '02',
			title: 'Travailler au MEF',
			description: 'Être agent du Ministère de l\'Économie et des Finances ou de ses structures rattachées.'
		},
		{
			number: '03',
			title: 'Adhérer aux valeurs',
			description: 'Partager les valeurs de solidarité, d\'entraide et d\'épanouissement promues par l\'Amicale.'
		},
		{
			number: '04',
			title: 'S\'acquitter des cotisations',
			description: 'S\'engager à payer régulièrement les cotisations annuelles fixées par l\'Assemblée Générale.'
		}
	];

	const steps = [
		{
			step: 1,
			title: 'Remplir le formulaire',
			description: 'Téléchargez et complétez le formulaire d\'adhésion avec vos informations.',
			icon: 'document'
		},
		{
			step: 2,
			title: 'Soumettre votre dossier',
			description: 'Déposez votre dossier auprès de la représentante AFMEF de votre structure.',
			icon: 'upload'
		},
		{
			step: 3,
			title: 'Validation',
			description: 'Votre demande sera examinée et validée par le Bureau Exécutif.',
			icon: 'check'
		},
		{
			step: 4,
			title: 'Bienvenue !',
			description: 'Recevez votre carte de membre et participez à toutes nos activités.',
			icon: 'star'
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
	<title>Adhésion - AFMEF</title>
	<meta name="description" content="Rejoignez l'AFMEF, l'Amicale des Femmes du Ministère en charge des Finances. Découvrez les avantages et conditions d'adhésion." />
</svelte:head>

<!-- Hero Section with Image -->
<section class="relative bg-primary overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute -right-64 top-1/2 -translate-y-1/2 w-[900px] h-[900px] lg:w-[1100px] lg:h-[1100px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.12"></circle>
		</svg>
		<div class="absolute top-20 left-20 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
		<div class="absolute bottom-32 left-1/4 w-2 h-2 bg-white/40 rounded-full"></div>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px] pt-20 md:pt-28 pb-8">
		<div id="hero-content" data-animate class="text-center max-w-4xl mx-auto {isVisible['hero-content'] ? 'animate-fade-in' : 'opacity-0'}">
			<div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
				<span class="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
				<span class="text-white/90 text-sm font-medium">Rejoignez-nous</span>
			</div>

			<h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.05]">
				Devenez membre de
				<span class="text-secondary">l'AFMEF</span>
			</h1>

			<p class="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
				Intégrez une communauté de femmes engagées pour la solidarité, l'entraide et l'épanouissement au sein du MEF.
			</p>
		</div>
	</div>

	<!-- Hero Image -->
	<div class="relative z-20">
		<div class="container mx-auto px-4 max-w-[1100px]">
			<div class="relative rounded-t-3xl overflow-hidden shadow-2xl">
				<img
					src="/images/carousel/slide1.jpg"
					alt="Membres de l'AFMEF réunies"
					class="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent"></div>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="bg-white py-12 md:py-16 -mt-1">
	<div class="container mx-auto px-4 max-w-[1100px]">
		<div id="stats" data-animate class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 {isVisible['stats'] ? 'animate-fade-in-up' : 'opacity-0'}">
			<div class="text-center p-6 rounded-2xl bg-primary-bg">
				<div class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">500+</div>
				<p class="text-gray-600 font-medium">Membres actives</p>
			</div>
			<div class="text-center p-6 rounded-2xl bg-primary-bg">
				<div class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">3</div>
				<p class="text-gray-600 font-medium">Années d'existence</p>
			</div>
			<div class="text-center p-6 rounded-2xl bg-primary-bg">
				<div class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">50+</div>
				<p class="text-gray-600 font-medium">Activités organisées</p>
			</div>
			<div class="text-center p-6 rounded-2xl bg-secondary">
				<div class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-2">100%</div>
				<p class="text-primary-dark/80 font-medium">Engagement</p>
			</div>
		</div>
	</div>
</section>

<!-- Avantages Section -->
<section class="py-20 md:py-28 bg-white relative overflow-hidden">
	<div class="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
	<div class="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="avantages-header" data-animate class="text-center mb-16 {isVisible['avantages-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Pourquoi nous rejoindre</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
				Les avantages de l'adhésion
			</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">
				En devenant membre de l'AFMEF, vous bénéficiez de nombreux avantages qui contribueront à votre épanouissement personnel et professionnel.
			</p>
		</div>

		<div id="avantages-grid" data-animate class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 {isVisible['avantages-grid'] ? 'animate-fade-in-up' : 'opacity-0'}">
			{#each avantages as avantage, i}
				<div
					class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20 hover:-translate-y-2"
					style="animation-delay: {i * 100}ms"
				>
					<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
						{#if avantage.icon === 'users'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
							</svg>
						{:else if avantage.icon === 'sparkles'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
							</svg>
						{:else if avantage.icon === 'shield'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
							</svg>
						{:else if avantage.icon === 'megaphone'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
							</svg>
						{:else if avantage.icon === 'calendar'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
							</svg>
						{:else if avantage.icon === 'heart'}
							<svg class="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
							</svg>
						{/if}
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">{avantage.title}</h3>
					<p class="text-gray-600 leading-relaxed">{avantage.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Image Banner -->
<section class="relative h-[300px] md:h-[400px] overflow-hidden">
	<img
		src="/images/carousel/slide3.jpg"
		alt="Activités AFMEF"
		class="w-full h-full object-cover"
	/>
	<div class="absolute inset-0 bg-primary/70"></div>
	<div class="absolute inset-0 flex items-center justify-center">
		<div class="text-center text-white px-4">
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ensemble, plus fortes</h2>
			<p class="text-xl text-white/90 max-w-2xl mx-auto">Le travail, notre bouclier</p>
		</div>
	</div>
</section>

<!-- Conditions Section -->
<section id="conditions" class="py-20 md:py-28 bg-primary-bg relative overflow-hidden">
	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="conditions-header" data-animate class="text-center mb-16 {isVisible['conditions-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Éligibilité</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
				Conditions d'adhésion
			</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">
				Pour rejoindre l'AFMEF, vous devez remplir les conditions suivantes.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
			<!-- Left - Conditions -->
			<div id="conditions-content" data-animate class="space-y-6 {isVisible['conditions-content'] ? 'animate-fade-in' : 'opacity-0'}">
				{#each conditions as condition, i}
					<div class="flex gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300" style="animation-delay: {i * 100}ms">
						<div class="flex-shrink-0 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
							<span class="text-xl font-bold text-white">{condition.number}</span>
						</div>
						<div class="pt-1">
							<h3 class="text-xl font-bold text-gray-900 mb-2">{condition.title}</h3>
							<p class="text-gray-600">{condition.description}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Right - Image -->
			<div id="conditions-image" data-animate class="relative lg:sticky lg:top-32 {isVisible['conditions-image'] ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 200ms">
				<div class="relative rounded-3xl overflow-hidden shadow-2xl">
					<img
						src="/images/carousel/slide5.jpg"
						alt="Membres de l'AFMEF"
						class="w-full h-[400px] lg:h-[500px] object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-8">
						<div class="flex items-center gap-3 mb-3">
							<div class="w-10 h-1 bg-secondary rounded-full"></div>
							<span class="text-secondary text-sm font-semibold uppercase tracking-wider">Notre devise</span>
						</div>
						<p class="text-white text-2xl font-semibold">
							"Ensemble, nous sommes plus fortes"
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="py-20 md:py-28 bg-white relative overflow-hidden">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="process-header" data-animate class="text-center mb-16 {isVisible['process-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Processus</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
				Comment adhérer ?
			</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">
				Suivez ces étapes simples pour devenir membre de l'AFMEF.
			</p>
		</div>

		<div id="process-steps" data-animate class="relative {isVisible['process-steps'] ? 'animate-fade-in-up' : 'opacity-0'}">
			<!-- Connection line - positioned at center of circles (w-14 = 56px, so center is 28px = top-7) -->
			<div class="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary"></div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
				{#each steps as step, i}
					<div class="relative" style="animation-delay: {i * 150}ms">
						<!-- Step number circle -->
						<div class="relative z-10 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-8 mx-auto shadow-lg shadow-primary/30">
							{step.step}
						</div>

						<div class="bg-primary-bg rounded-2xl p-6 text-center min-h-[220px]">
							<div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-5 mx-auto shadow-sm">
								{#if step.icon === 'document'}
									<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
									</svg>
								{:else if step.icon === 'upload'}
									<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
									</svg>
								{:else if step.icon === 'check'}
									<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								{:else if step.icon === 'star'}
									<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
									</svg>
								{/if}
							</div>
							<h3 class="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
							<p class="text-gray-600 text-sm">{step.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Cotisation Section -->
<section class="py-20 md:py-28 bg-secondary relative overflow-hidden">
	<div class="absolute top-10 left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
	<div class="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

	<div id="cotisation" data-animate class="relative container mx-auto px-4 max-w-[1100px] {isVisible['cotisation'] ? 'animate-fade-in' : 'opacity-0'}">
		<div class="bg-white rounded-3xl overflow-hidden shadow-xl">
			<div class="grid md:grid-cols-2">
				<!-- Left - Image -->
				<div class="relative h-[250px] md:h-auto">
					<img
						src="/images/carousel/slide7.jpg"
						alt="Membres AFMEF"
						class="w-full h-full object-cover"
					/>
					<div class="absolute inset-0 bg-primary/40"></div>
				</div>

				<!-- Right - Content -->
				<div class="p-8 md:p-12">
					<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Cotisation</span>
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Cotisation annuelle
					</h2>
					<p class="text-gray-600 mb-6">
						Les cotisations permettent de financer les activités de l'Amicale et d'assurer son bon fonctionnement.
					</p>

					<div class="bg-primary-bg rounded-2xl p-6 mb-6">
						<p class="text-gray-600 text-sm mb-1">Montant annuel</p>
						<div class="text-4xl md:text-5xl font-bold text-primary">
							10 000 <span class="text-xl">FCFA</span>
						</div>
					</div>

					<ul class="space-y-3">
						<li class="flex items-center gap-3">
							<svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span class="text-gray-700">Accès à toutes les activités</span>
						</li>
						<li class="flex items-center gap-3">
							<svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span class="text-gray-700">Participation aux formations</span>
						</li>
						<li class="flex items-center gap-3">
							<svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span class="text-gray-700">Droit de vote à l'Assemblée Générale</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="relative py-24 md:py-32 overflow-hidden bg-primary">
	<!-- Background Image -->
	<div class="absolute inset-0">
		<img
			src="/images/carousel/slide2.jpg"
			alt=""
			class="w-full h-full object-cover opacity-20"
		/>
	</div>
	<div class="absolute inset-0 bg-primary/90"></div>

	<!-- Decorative -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.1"></circle>
		</svg>
	</div>

	<div id="cta-section" data-animate class="relative container mx-auto px-4 max-w-[1300px] text-center {isVisible['cta-section'] ? 'animate-fade-in' : 'opacity-0'}">
		<h2 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
			Prête à rejoindre la
			<span class="text-secondary">famille AFMEF</span> ?
		</h2>
		<p class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
			Contactez-nous pour obtenir le formulaire d'adhésion et rejoindre notre communauté de femmes engagées.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a href="/contact" class="group inline-flex items-center gap-2 bg-secondary hover:bg-yellow-400 text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5">
				Nous contacter
				<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
			<a href="tel:+2290147474707" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full border border-white/20 transition-all duration-300 hover:-translate-y-0.5">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
				</svg>
				Appeler
			</a>
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

	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
	}
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
