<script>
	let isVisible = $state({});
	let formData = $state({
		nom: '',
		prenom: '',
		email: '',
		telephone: '',
		sujet: '',
		message: ''
	});
	let isSubmitting = $state(false);
	let submitStatus = $state(null);

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

	async function handleSubmit(e) {
		e.preventDefault();
		isSubmitting = true;
		submitStatus = null;

		// Simulate form submission
		await new Promise(resolve => setTimeout(resolve, 1500));

		submitStatus = 'success';
		isSubmitting = false;

		// Reset form
		formData = {
			nom: '',
			prenom: '',
			email: '',
			telephone: '',
			sujet: '',
			message: ''
		};
	}
</script>

<svelte:head>
	<title>Contactez-nous - AFMEF</title>
	<meta name="description" content="Contactez l'AFMEF, l'Amicale des Femmes du Ministère en charge des Finances. Nous sommes à votre écoute." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary overflow-hidden">
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<svg class="absolute -right-64 top-1/2 -translate-y-1/2 w-[900px] h-[900px] lg:w-[1100px] lg:h-[1100px]" viewBox="0 0 1838 1838" fill="none">
			<circle cx="919" cy="919" r="828.5" stroke="#FDD116" stroke-width="181" opacity="0.12"></circle>
		</svg>
		<div class="absolute top-20 left-10 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
		<div class="absolute bottom-32 left-1/4 w-2 h-2 bg-white/40 rounded-full"></div>
	</div>

	<div class="relative container mx-auto px-4 max-w-[1300px] pt-20 md:pt-28 pb-16 md:pb-24">
		<div id="hero-content" data-animate class="text-center max-w-3xl mx-auto {isVisible['hero-content'] ? 'animate-fade-in' : 'opacity-0'}">
			<span class="text-secondary text-sm font-semibold uppercase tracking-wider mb-4 block">Contact</span>
			<h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.05]">
				Restons en
				<span class="text-secondary">contact</span>
			</h1>
			<p class="text-xl md:text-2xl text-white/80 leading-relaxed">
				Une question ou envie de nous rejoindre ? N'hésitez pas à nous écrire.
			</p>
		</div>
	</div>
</section>

<!-- Main Contact Section -->
<section class="py-16 md:py-24 bg-primary-bg relative overflow-hidden">
	<div class="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
	<div class="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

	<div class="relative container mx-auto px-4 max-w-[1100px]">
		<div class="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
			<!-- Left - Contact Form (3 cols) -->
			<div id="contact-form" data-animate class="lg:col-span-3 {isVisible['contact-form'] ? 'animate-fade-in' : 'opacity-0'}">
				<div class="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
					<div class="mb-8">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Envoyez-nous un message</h2>
						<p class="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
					</div>

					{#if submitStatus === 'success'}
						<div class="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
							<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h3 class="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
							<p class="text-gray-600">Merci pour votre message.</p>
						</div>
					{:else}
						<form onsubmit={handleSubmit} class="space-y-5">
							<div class="grid sm:grid-cols-2 gap-5">
								<div>
									<label for="nom" class="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
									<input
										type="text"
										id="nom"
										bind:value={formData.nom}
										required
										class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
										placeholder="Votre nom"
									/>
								</div>
								<div>
									<label for="prenom" class="block text-sm font-semibold text-gray-700 mb-2">Prénom *</label>
									<input
										type="text"
										id="prenom"
										bind:value={formData.prenom}
										required
										class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
										placeholder="Votre prénom"
									/>
								</div>
							</div>

							<div class="grid sm:grid-cols-2 gap-5">
								<div>
									<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
									<input
										type="email"
										id="email"
										bind:value={formData.email}
										required
										class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
										placeholder="votre@email.com"
									/>
								</div>
								<div>
									<label for="telephone" class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
									<input
										type="tel"
										id="telephone"
										bind:value={formData.telephone}
										class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
										placeholder="+229 XX XX XX XX"
									/>
								</div>
							</div>

							<div>
								<label for="sujet" class="block text-sm font-semibold text-gray-700 mb-2">Sujet *</label>
								<select
									id="sujet"
									bind:value={formData.sujet}
									required
									class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
								>
									<option value="">Sélectionnez un sujet</option>
									<option value="adhesion">Demande d'adhésion</option>
									<option value="information">Demande d'information</option>
									<option value="partenariat">Proposition de partenariat</option>
									<option value="suggestion">Suggestion</option>
									<option value="autre">Autre</option>
								</select>
							</div>

							<div>
								<label for="message" class="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
								<textarea
									id="message"
									bind:value={formData.message}
									required
									rows="5"
									class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
									placeholder="Votre message..."
								></textarea>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
							>
								{#if isSubmitting}
									<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Envoi en cours...
								{:else}
									Envoyer le message
									<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
									</svg>
								{/if}
							</button>
						</form>
					{/if}
				</div>
			</div>

			<!-- Right - Contact Info (2 cols) -->
			<div id="contact-info" data-animate class="lg:col-span-2 space-y-6 {isVisible['contact-info'] ? 'animate-fade-in' : 'opacity-0'}" style="animation-delay: 200ms">
				<!-- Direct Contact -->
				<div class="bg-white rounded-2xl p-6 shadow-lg">
					<h3 class="text-xl font-bold text-gray-900 mb-5">Contactez-nous directement</h3>

					<div class="space-y-4">
						<a href="tel:+2290147474707" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary-bg transition-colors group">
							<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
								<svg class="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">Téléphone</p>
								<p class="font-semibold text-gray-900">+229 01 47 47 47 07</p>
							</div>
						</a>

						<a href="mailto:contact@afmef.bj" class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary-bg transition-colors group">
							<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
								<svg class="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">Email</p>
								<p class="font-semibold text-gray-900">contact@afmef.bj</p>
							</div>
						</a>
					</div>
				</div>

				<!-- Social Media -->
				<div class="bg-white rounded-2xl p-6 shadow-lg">
					<h3 class="text-xl font-bold text-gray-900 mb-5">Suivez-nous</h3>

					<div class="space-y-3">
						<a href="https://www.facebook.com/profile.php?id=61560847287467" target="_blank" rel="noopener" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1877F2]/10 transition-colors group">
							<div class="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
							</div>
							<span class="font-medium text-gray-700 group-hover:text-[#1877F2] transition-colors">Facebook</span>
						</a>

						<a href="https://www.instagram.com/afmefbenin" target="_blank" rel="noopener" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#E4405F]/10 transition-colors group">
							<div class="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
							</div>
							<span class="font-medium text-gray-700 group-hover:text-[#E4405F] transition-colors">Instagram</span>
						</a>

						<a href="https://youtube.com/@afmefbenin" target="_blank" rel="noopener" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FF0000]/10 transition-colors group">
							<div class="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
							</div>
							<span class="font-medium text-gray-700 group-hover:text-[#FF0000] transition-colors">YouTube</span>
						</a>

						<a href="https://whatsapp.com/channel/0029VbBlsJGF1YlURfRdjb0h" target="_blank" rel="noopener" class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#25D366]/10 transition-colors group">
							<div class="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
							</div>
							<span class="font-medium text-gray-700 group-hover:text-[#25D366] transition-colors">Chaîne WhatsApp</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-20 bg-secondary relative overflow-hidden">
	<div class="absolute top-10 left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
	<div class="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

	<div id="cta-section" data-animate class="relative container mx-auto px-4 max-w-[900px] text-center {isVisible['cta-section'] ? 'animate-fade-in' : 'opacity-0'}">
		<h2 class="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
			Prête à rejoindre notre communauté ?
		</h2>
		<p class="text-lg text-primary-dark/70 mb-8 max-w-xl mx-auto">
			Devenez membre de l'AFMEF et participez à l'épanouissement des femmes du MEF.
		</p>
		<a href="/adhesion" class="group inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
			Devenir membre
			<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
			</svg>
		</a>
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
</style>
