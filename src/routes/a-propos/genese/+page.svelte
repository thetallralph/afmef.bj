<script>
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
	<title>Genèse - AFMEF</title>
	<meta name="description" content="Découvrez l'histoire de la création de l'AFMEF, l'Amicale des Femmes du Ministère en charge des Finances." />
</svelte:head>

<!-- Hero Section with Overlapping Image -->
<section class="relative bg-primary overflow-visible">
	<!-- Decorative Circle -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute -right-64 top-1/2 -translate-y-1/2 w-[900px] h-[900px] lg:w-[1100px] lg:h-[1100px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.15"></circle>
		</svg>
	</div>

	<!-- Floating decorative elements -->
	<div class="absolute top-20 left-10 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
	<div class="absolute bottom-32 left-1/4 w-2 h-2 bg-white/40 rounded-full"></div>
	<div class="absolute top-1/3 right-20 w-4 h-4 border-2 border-secondary/50 rounded-full"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px] pt-20 md:pt-28 pb-8">
		<div id="hero-content" data-animate class="text-center max-w-4xl mx-auto {isVisible['hero-content'] ? 'animate-fade-in' : 'opacity-0'}">

			<h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.05]">
				Genèse
			</h1>

			<p class="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
				Une Aventure Collective au Service de l'Épanouissement des Femmes du MEF
			</p>
		</div>
	</div>

	<!-- Overlapping Image Container -->
	<div class="relative z-20">
		<div class="container mx-auto px-4 max-w-[1100px]">
			<img
				src="https://afmef.bj/wp-content/uploads/2025/11/hero-about-1.png"
				alt="AFMEF - Assemblée Générale Constitutive"
				class="w-full h-auto relative z-10"
			/>
		</div>
	</div>
</section>

<!-- Opening Statement - Image overlaps into this section -->
<section class="relative bg-white -mt-16 md:-mt-24 lg:-mt-32 pt-24 md:pt-32 lg:pt-44 pb-16 md:pb-24">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="opening" data-animate class="max-w-4xl mx-auto text-center {isVisible['opening'] ? 'animate-fade-in' : 'opacity-0'}">
			<div class="w-16 h-16 bg-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-8">
				<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
				</svg>
			</div>
			<p class="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-relaxed font-light">
				L'Amicale des Femmes du Ministère en charge des Finances est née de
				<span class="text-primary font-semibold">l'ambition des femmes</span>
				de s'organiser pour renforcer les liens de solidarité et travailler ensemble pour leur
				<span class="text-primary font-semibold">épanouissement individuel et collectif</span>.
			</p>
		</div>
	</div>
</section>

<!-- Timeline Section -->
<section class="py-20 md:py-28 bg-primary-bg relative overflow-hidden">
	<!-- Decorative -->
	<div class="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
	<div class="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="timeline-header" data-animate class="text-center mb-16 {isVisible['timeline-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Chronologie</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Les Étapes Clés</h2>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Vertical Line (desktop) -->
			<div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary to-secondary -translate-x-1/2"></div>

			<!-- Timeline Item 1 -->
			<div id="timeline-1" data-animate class="relative lg:flex lg:items-center lg:gap-16 mb-16 lg:mb-24 {isVisible['timeline-1'] ? 'animate-fade-in' : 'opacity-0'}">
				<!-- Left Content -->
				<div class="lg:w-1/2 lg:text-right lg:pr-16">
					<div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
						<span class="inline-block px-4 py-1 bg-primary text-white text-sm font-bold rounded-full mb-4">2022</span>
						<h3 class="text-2xl font-bold text-gray-900 mb-4">L'Initiative</h3>
						<p class="text-gray-600 leading-relaxed">
							Encouragée et soutenue fortement par le Ministre d'État, Monsieur <strong class="text-gray-900">Romuald WADAGNI</strong>, cette noble initiative s'est concrétisée après plusieurs mois de travaux préparatoires sous le leadership éclairé de la Secrétaire Générale Adjointe du Ministère.
						</p>
					</div>
				</div>

				<!-- Center Dot -->
				<div class="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg items-center justify-center">
					<div class="w-2 h-2 bg-white rounded-full"></div>
				</div>

				<!-- Right Empty (for layout) -->
				<div class="lg:w-1/2"></div>
			</div>

			<!-- Timeline Item 2 -->
			<div id="timeline-2" data-animate class="relative lg:flex lg:items-center lg:gap-16 mb-16 lg:mb-24 {isVisible['timeline-2'] ? 'animate-fade-in' : 'opacity-0'}">
				<!-- Left Empty -->
				<div class="lg:w-1/2"></div>

				<!-- Center Dot -->
				<div class="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-lg items-center justify-center">
					<div class="w-2 h-2 bg-primary rounded-full"></div>
				</div>

				<!-- Right Content -->
				<div class="lg:w-1/2 lg:pl-16">
					<div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
						<span class="inline-block px-4 py-1 bg-secondary text-primary-dark text-sm font-bold rounded-full mb-4">26 Nov 2022</span>
						<h3 class="text-2xl font-bold text-gray-900 mb-4">L'Assemblée Générale Constitutive</h3>
						<p class="text-gray-600 leading-relaxed">
							Organisation de l'Assemblée Générale Constitutive à Cotonou avec la <strong class="text-gray-900">participation massive des femmes</strong> du ministère en charge des finances venues de l'ensemble du territoire national.
						</p>
					</div>
				</div>
			</div>

			<!-- Timeline Item 3 -->
			<div id="timeline-3" data-animate class="relative lg:flex lg:items-center lg:gap-16 mb-16 lg:mb-24 {isVisible['timeline-3'] ? 'animate-fade-in' : 'opacity-0'}">
				<!-- Left Content -->
				<div class="lg:w-1/2 lg:text-right lg:pr-16">
					<div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
						<span class="inline-block px-4 py-1 bg-primary text-white text-sm font-bold rounded-full mb-4">2022-2024</span>
						<h3 class="text-2xl font-bold text-gray-900 mb-4">Les Fondations</h3>
						<p class="text-gray-600 leading-relaxed">
							Sous la Présidence de <strong class="text-gray-900">Mme Awaou BACO</strong>, les bases de développement des activités de l'Amicale ont été posées à travers différentes initiatives impactantes au bénéfice des adhérentes et de certaines couches sociales de la population.
						</p>
					</div>
				</div>

				<!-- Center Dot -->
				<div class="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg items-center justify-center">
					<div class="w-2 h-2 bg-white rounded-full"></div>
				</div>

				<!-- Right Empty -->
				<div class="lg:w-1/2"></div>
			</div>

			<!-- Timeline Item 4 -->
			<div id="timeline-4" data-animate class="relative lg:flex lg:items-center lg:gap-16 {isVisible['timeline-4'] ? 'animate-fade-in' : 'opacity-0'}">
				<!-- Left Empty -->
				<div class="lg:w-1/2"></div>

				<!-- Center Dot -->
				<div class="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-lg items-center justify-center">
					<div class="w-2 h-2 bg-primary rounded-full"></div>
				</div>

				<!-- Right Content -->
				<div class="lg:w-1/2 lg:pl-16">
					<div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
						<span class="inline-block px-4 py-1 bg-secondary text-primary-dark text-sm font-bold rounded-full mb-4">2024 - Présent</span>
						<h3 class="text-2xl font-bold text-gray-900 mb-4">Nouveau Leadership</h3>
						<p class="text-gray-600 leading-relaxed">
							Conformément aux dispositions des textes fondamentaux, Mme BACO a passé le flambeau à <strong class="text-gray-900">Mme Vicentia AKOTO OKRY</strong>, précédemment 1ère Vice-Présidente, pour conduire les destinées de l'organisation.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Key Figures Section -->
<section class="py-20 md:py-28 bg-white relative overflow-hidden">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<div id="figures-header" data-animate class="text-center mb-16 {isVisible['figures-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Personnalités Clés</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Les Figures Fondatrices</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">Les personnalités qui ont porté cette vision et contribué à la création de l'AFMEF</p>
		</div>

		<!-- Founding Leaders -->
		<div id="founders" data-animate class="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto mb-20 {isVisible['founders'] ? 'animate-fade-in-up' : 'opacity-0'}">
			<!-- Alice MASSIM-OUALI AFFO -->
			<div class="group relative">
				<div class="relative overflow-hidden rounded-3xl">
					<!-- Yellow accent corner -->
					<div class="absolute top-0 right-0 w-24 h-24 bg-secondary rounded-bl-[100px] z-10"></div>

					<div class="aspect-[3/4] overflow-hidden">
						<img
							src="https://afmef.bj/wp-content/uploads/2025/11/R144-bis-1-1481x1536.jpg"
							alt="Mme Alice MASSIM-OUALI AFFO"
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						/>
					</div>

					<!-- Overlay on hover -->
					<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

					<!-- Content -->
					<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
						<div class="flex items-center gap-2 mb-2">
							<div class="w-8 h-[2px] bg-secondary"></div>
							<span class="text-secondary text-xs font-semibold uppercase tracking-wider">Leadership</span>
						</div>
						<h3 class="text-2xl font-bold mb-1">Mme Alice MASSIM-OUALI AFFO</h3>
						<p class="text-white/80 text-sm">Présidente du Comité d'Organisation & du Présidium de l'Assemblée Générale Constitutive</p>
					</div>
				</div>
			</div>

			<!-- William TCHEPKE -->
			<div class="group relative">
				<div class="relative overflow-hidden rounded-3xl">
					<!-- Green accent corner -->
					<div class="absolute top-0 right-0 w-24 h-24 bg-primary rounded-bl-[100px] z-10"></div>

					<div class="aspect-[3/4] overflow-hidden">
						<img
							src="https://afmef.bj/wp-content/uploads/2025/11/william-hd.png"
							alt="M. William TCHEPKE"
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						/>
					</div>

					<!-- Overlay -->
					<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

					<!-- Content -->
					<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
						<div class="flex items-center gap-2 mb-2">
							<div class="w-8 h-[2px] bg-secondary"></div>
							<span class="text-secondary text-xs font-semibold uppercase tracking-wider">Engagement</span>
						</div>
						<h3 class="text-2xl font-bold mb-1">M. William TCHEPKE</h3>
						<p class="text-white/80 text-sm">Chargé d'études Communication et Relations Extérieures, Membre actif du Comité d'organisation</p>
					</div>
				</div>
			</div>
		</div>

	</div>
</section>

<!-- Presidents Section - Full Width -->
<section class="py-20 md:py-28 bg-gradient-to-br from-primary-bg via-white to-primary-bg relative overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/20"></div>
	<div class="absolute top-1/4 left-10 w-20 h-20 bg-secondary/10 rounded-full blur-2xl"></div>
	<div class="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

	<div class="relative container mx-auto px-4 max-w-[1300px]">
		<div id="presidents-header" data-animate class="text-center mb-16 {isVisible['presidents-header'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">Leadership</span>
			<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Les Présidentes de l'AFMEF</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">Les femmes qui ont conduit et conduisent les destinées de notre amicale</p>
		</div>

		<!-- Presidents Timeline -->
		<div id="presidents" data-animate class="relative {isVisible['presidents'] ? 'animate-fade-in-up' : 'opacity-0'}">
			<!-- Connection Line -->
			<div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary -translate-y-1/2 z-0"></div>

			<div class="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto relative z-10">
				<!-- Awaou BACO - First President -->
				<div class="group">
					<div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
						<!-- Image Container -->
						<div class="relative">
							<div class="aspect-[4/5] overflow-hidden">
								<img
									src="https://afmef.bj/wp-content/uploads/2025/11/awaou-bako-hd-.png"
									alt="Mme Awaou BACO"
									class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
								/>
							</div>
							<!-- Overlay gradient -->
							<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent"></div>

							<!-- Mandate badge -->
							<div class="absolute top-4 left-4">
								<span class="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-primary text-sm font-bold rounded-full shadow-lg">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
									</svg>
									2022 - 2024
								</span>
							</div>

							<!-- Name overlay -->
							<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
								<h3 class="text-2xl md:text-3xl font-bold mb-1">Mme Awaou BACO</h3>
								<p class="text-white/80">1ère Présidente de l'AFMEF</p>
							</div>
						</div>

						<!-- Content -->
						<div class="p-6 bg-gradient-to-b from-white to-primary-bg/30">
							<p class="text-gray-600 leading-relaxed mb-4">
								Sous sa présidence, les bases de développement des activités de l'Amicale ont été posées à travers différentes initiatives impactantes.
							</p>
							<div class="flex items-center gap-2 text-primary font-semibold">
								<span class="w-8 h-[2px] bg-primary"></span>
								<span>Présidente Fondatrice</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Vicentia AKOTO OKRY - Current President -->
				<div class="group">
					<div class="bg-primary rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ring-4 ring-secondary/50">
						<!-- Image Container -->
						<div class="relative">
							<div class="aspect-[4/5] overflow-hidden">
								<img
									src="https://afmef.bj/wp-content/uploads/2025/11/vicentia-okry-hd.png"
									alt="Mme Vicentia AKOTO OKRY"
									class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
								/>
							</div>
							<!-- Overlay gradient -->
							<div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent"></div>

							<!-- Mandate badge -->
							<div class="absolute top-4 left-4">
								<span class="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-primary-dark text-sm font-bold rounded-full shadow-lg">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
									</svg>
									2024 - Présent
								</span>
							</div>

							<!-- Name overlay -->
							<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
								<h3 class="text-2xl md:text-3xl font-bold mb-1">Mme Vicentia AKOTO OKRY</h3>
								<p class="text-white/80">Présidente en exercice</p>
							</div>
						</div>

						<!-- Content -->
						<div class="p-6 bg-primary-dark/20">
							<p class="text-white/90 leading-relaxed mb-4">
								Précédemment 1ère Vice-Présidente, elle conduit désormais les destinées de l'AFMEF avec détermination et vision.
							</p>
							<div class="flex items-center gap-2 text-secondary font-semibold">
								<span class="w-8 h-[2px] bg-secondary"></span>
								<span>Présidente en Exercice</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Quote Section -->
<section class="py-20 bg-primary relative overflow-hidden">
	<!-- Decorative -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.08"></circle>
		</svg>
	</div>

	<div id="quote" data-animate class="relative container mx-auto px-4 max-w-[900px] text-center {isVisible['quote'] ? 'animate-fade-in' : 'opacity-0'}">
		<svg class="w-16 h-16 text-secondary/30 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
			<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
		</svg>
		<blockquote class="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed mb-8">
			La participation massive des femmes du ministère en charge des finances venues de l'ensemble du territoire national est le
			<span class="text-secondary font-semibold">signe manifeste du bien-fondé</span>
			de la création de cette Amicale.
		</blockquote>
	</div>
</section>

<AboutNavLinks currentPage="genese" />

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
