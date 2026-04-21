<script>
	let { data, form } = $props();

	let password = $state('');
	let showPassword = $state(false);
	let activeSection = $state('introduction');
	let showBackToTop = $state(false);

	const lastUpdated = '21 avril 2026';

	const sections = [
		{ id: 'introduction', title: 'Introduction' },
		{ id: 'roles', title: 'Rôles et statuts' },
		{ id: 'inscription', title: 'Inscription et validation' },
		{ id: 'connexion', title: 'Connexion et mot de passe' },
		{ id: 'profil', title: 'Profil membre' },
		{ id: 'annuaire', title: 'Annuaire' },
		{ id: 'cotisations', title: 'Cotisations et paiement' },
		{ id: 'public', title: 'Pages publiques' },
		{ id: 'gestion', title: 'Espace Gestion (admin)' },
		{ id: 'pocketbase', title: 'PocketBase /admin' },
		{ id: 'vigilance', title: 'Points de vigilance' },
		{ id: 'support', title: 'Support technique' }
	];

	$effect(() => {
		if (!data.hasAccess || typeof window === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-30% 0px -60% 0px' }
		);

		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		const onScroll = () => {
			showBackToTop = window.scrollY > 600;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Guide — Fonctionnement de la plateforme AFMEF</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !data.hasAccess}
	<!-- Écran de connexion -->
	<main class="min-h-screen bg-gradient-to-br from-primary-bg to-white flex items-center justify-center p-4">
		<div class="w-full max-w-md">
			<div class="text-center mb-8">
				<a href="/" class="inline-block">
					<img src="/favicon.png" alt="AFMEF" class="w-16 h-16 mx-auto mb-4" />
				</a>
				<h1 class="text-2xl font-bold text-gray-900">Guide interne</h1>
				<p class="text-gray-600 mt-2">Accès réservé — saisissez le mot de passe</p>
			</div>

			<div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
				{#if form?.error}
					<div
						role="alert"
						class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
					>
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/login" class="space-y-4">
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
							Mot de passe
						</label>
						<div class="relative">
							<!-- svelte-ignore a11y_autofocus -->
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								required
								autofocus
								autocomplete="current-password"
								aria-invalid={form?.error ? 'true' : undefined}
								class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
								aria-pressed={showPassword}
								class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition-colors"
							>
								{#if showPassword}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
									</svg>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<button
						type="submit"
						class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
					>
						Accéder au guide
					</button>
				</form>
			</div>

			<p class="text-center text-sm text-gray-500 mt-6">
				<a href="/" class="hover:text-primary transition-colors">← Retour au site</a>
			</p>
		</div>
	</main>
{:else}
	<!-- Guide -->
	<div class="guide-root bg-primary-bg min-h-screen">
		<!-- En-tête -->
		<header class="bg-primary text-white">
			<div class="container mx-auto px-4 max-w-[1200px] py-12 md:py-16">
				<div class="flex items-start justify-between gap-6 flex-wrap">
					<div>
						<div class="flex items-center gap-3 mb-4">
							<span class="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
								Document interne
							</span>
							<span class="text-white/60 text-xs">
								Mis à jour le {lastUpdated}
							</span>
						</div>
						<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
							Guide de la plateforme AFMEF
						</h1>
						<p class="text-white/80 text-lg max-w-2xl">
							Comment la communauté fonctionne côté membres et côté administration.
						</p>
					</div>
					<form method="POST" action="?/logout">
						<button
							type="submit"
							class="text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-colors"
						>
							Quitter le guide
						</button>
					</form>
				</div>
			</div>
		</header>

		<!-- Corps -->
		<div class="container mx-auto px-4 max-w-[1200px] py-12 md:py-16">
			<div class="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
				<!-- Sommaire -->
				<aside class="lg:sticky lg:top-24 lg:self-start">
					<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<p id="sommaire-label" class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
							Sommaire
						</p>
						<nav aria-labelledby="sommaire-label" class="space-y-1">
							{#each sections as section, i}
								<a
									href="#{section.id}"
									aria-current={activeSection === section.id ? 'location' : undefined}
									class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection === section.id ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}"
								>
									<span class="text-gray-400 mr-2">{String(i + 1).padStart(2, '0')}</span>
									{section.title}
								</a>
							{/each}
						</nav>
					</div>
				</aside>

				<!-- Contenu -->
				<article class="space-y-12 max-w-3xl">
					<section id="introduction" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							1. Introduction
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								La plateforme AFMEF repose sur deux briques : une application <strong>SvelteKit</strong> (le site public et les espaces privés) et un backend <strong>PocketBase</strong> qui stocke les utilisateurs, les cotisations, les activités et les ressources.
							</p>
							<p>
								Elle poursuit trois objectifs : présenter l'Amicale au grand public, offrir aux membres un espace personnel (profil, annuaire, cotisations) et donner aux administratrices les outils pour gérer la communauté au quotidien.
							</p>
						</div>
					</section>

					<section id="roles" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							2. Rôles et statuts
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>Chaque compte possède un <strong>rôle</strong> et un <strong>statut</strong>.</p>
							<div class="grid sm:grid-cols-2 gap-4">
								<div class="rounded-xl border border-gray-200 p-4">
									<p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Rôles</p>
									<ul class="space-y-2 text-sm">
										<li><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">member</code> — membre standard</li>
										<li><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">admin</code> — accès à <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/gestion</code></li>
									</ul>
								</div>
								<div class="rounded-xl border border-gray-200 p-4">
									<p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Statuts</p>
									<ul class="space-y-2 text-sm">
										<li><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pending</code> — en attente de validation</li>
										<li><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">active</code> — accès complet à l'espace membre</li>
										<li><code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">inactive</code> — compte bloqué</li>
									</ul>
								</div>
							</div>
							<p class="text-sm text-gray-600">
								Un compte <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pending</code> ou <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">inactive</code> peut s'authentifier mais est immédiatement déconnecté côté serveur : aucune page privée n'est accessible tant que le statut n'est pas <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">active</code>.
							</p>
						</div>
					</section>

					<section id="inscription" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							3. Inscription et validation
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Toute candidate s'inscrit depuis <a href="/espace-membre/inscription" class="text-primary font-medium hover:underline">/espace-membre/inscription</a>. Les champs collectés :
							</p>
							<ul class="list-disc list-inside space-y-1 text-sm pl-2">
								<li>nom complet, e-mail, mot de passe (8 caractères minimum)</li>
								<li>téléphone, structure, fonction (facultatifs)</li>
							</ul>
							<p>
								Le compte est créé avec le statut <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pending</code>. La candidate reçoit un message de confirmation et est invitée à se connecter — mais la connexion reste bloquée tant qu'une administratrice n'a pas validé son compte dans <a href="/gestion/membres" class="text-primary font-medium hover:underline">/gestion/membres</a>.
							</p>
							<div class="rounded-xl bg-primary-bg border border-primary/10 p-4 text-sm">
								<p class="font-semibold text-primary-dark mb-1">Raccourci admin</p>
								<p>Un admin peut également créer un compte directement depuis <code class="text-xs bg-white px-1.5 py-0.5 rounded">/gestion/membres/nouveau</code>. Dans ce cas le compte est immédiatement <code class="text-xs bg-white px-1.5 py-0.5 rounded">active</code> — aucune validation supplémentaire n'est nécessaire.</p>
							</div>
						</div>
					</section>

					<section id="connexion" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							4. Connexion et mot de passe
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Connexion classique sur <a href="/espace-membre/connexion" class="text-primary font-medium hover:underline">/espace-membre/connexion</a>. En cas de tentative avec un compte en attente, la candidate est redirigée avec le paramètre <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">?pending=1</code> et voit un message l'informant que sa demande est en cours de traitement.
							</p>
							<p>
								Pour réinitialiser un mot de passe, rendez-vous sur <a href="/espace-membre/mot-de-passe-oublie" class="text-primary font-medium hover:underline">/espace-membre/mot-de-passe-oublie</a>. L'envoi de l'e-mail est pris en charge nativement par PocketBase — le lien reçu ouvre le formulaire de nouveau mot de passe et la session est prête ensuite.
							</p>
						</div>
					</section>

					<section id="profil" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							5. Profil membre
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Chaque membre gère son profil sur <a href="/espace-membre/profil" class="text-primary font-medium hover:underline">/espace-membre/profil</a> :
							</p>
							<ul class="list-disc list-inside space-y-1 text-sm pl-2">
								<li>informations personnelles (nom, téléphone, structure, fonction, bio)</li>
								<li>avatar (upload séparé)</li>
								<li>préférences de confidentialité : <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">showInDirectory</code>, <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">showEmail</code>, <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">showPhone</code></li>
							</ul>
							<p class="text-sm text-gray-600">
								Par défaut, un nouveau profil apparaît dans l'annuaire avec l'e-mail visible et le téléphone masqué. Chacune peut ajuster ces réglages à tout moment.
							</p>
						</div>
					</section>

					<section id="annuaire" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							6. Annuaire
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								L'annuaire est accessible uniquement aux membres authentifiés sur <a href="/espace-membre/annuaire" class="text-primary font-medium hover:underline">/espace-membre/annuaire</a>. Il liste tous les membres dont <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">showInDirectory</code> est activé, paginés par 20 et cherchables par nom, structure ou fonction.
							</p>
							<p class="text-sm text-gray-600">
								L'e-mail et le téléphone n'apparaissent sur la fiche que si la membre les a rendus visibles dans son profil.
							</p>
						</div>
					</section>

					<section id="cotisations" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							7. Cotisations et paiement
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Cotisation annuelle : <strong>10 000 FCFA</strong>. Chaque membre consulte l'historique et règle depuis <a href="/espace-membre/cotisations" class="text-primary font-medium hover:underline">/espace-membre/cotisations</a>. Une bannière indique si la cotisation de l'année est à jour ou en retard.
							</p>
							<p class="font-semibold text-gray-900">Paiement en ligne (KKiaPay)</p>
							<ol class="list-decimal list-inside space-y-1 text-sm pl-2">
								<li>La membre clique sur « Payer maintenant » pour une cotisation en attente.</li>
								<li>Elle saisit son numéro Mobile Money (8 chiffres minimum).</li>
								<li>KKiaPay effectue le débit côté client.</li>
								<li>Le serveur appelle <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/api/payment/verify</code> pour confirmer la transaction et passe la cotisation en <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">paid</code>.</li>
							</ol>
							<div class="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm">
								<p class="font-semibold text-yellow-900 mb-1">Mode sandbox</p>
								<p class="text-yellow-900/90">KKiaPay est actuellement en sandbox — aucun débit réel n'est effectué. Avant la mise en production, passer le SDK en mode live et retester le flux complet.</p>
							</div>
							<p class="font-semibold text-gray-900">Paiement hors ligne</p>
							<p>
								Lorsqu'un règlement est reçu en espèces ou par virement, une administratrice le saisit manuellement depuis <a href="/gestion/cotisations" class="text-primary font-medium hover:underline">/gestion/cotisations</a> en cliquant « Marquer comme payé ». La date et la méthode de paiement sont enregistrées.
							</p>
						</div>
					</section>

					<section id="public" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							8. Pages publiques
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<ul class="space-y-2">
								<li><a href="/" class="text-primary font-medium hover:underline">/</a> — page d'accueil, carousel et mise en avant.</li>
								<li><a href="/a-propos" class="text-primary font-medium hover:underline">/a-propos</a> — présentation de l'Amicale.</li>
								<li><a href="/activites" class="text-primary font-medium hover:underline">/activites</a> — alimenté par la collection <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">activites</code>.</li>
								<li><a href="/ressources" class="text-primary font-medium hover:underline">/ressources</a> — alimenté par la collection <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">ressources</code> (PDF, textes de loi, etc.).</li>
								<li><a href="/adhesion" class="text-primary font-medium hover:underline">/adhesion</a> — parcours d'adhésion orienté grand public.</li>
								<li><a href="/faire-un-don" class="text-primary font-medium hover:underline">/faire-un-don</a> — actuellement « bientôt disponible », aucun flux de paiement en place.</li>
								<li><a href="/contact" class="text-primary font-medium hover:underline">/contact</a> — formulaire de contact.</li>
							</ul>
							<p class="text-sm text-gray-600">
								Les pages Activités et Ressources lisent directement les collections PocketBase correspondantes. Pour ajouter ou modifier un contenu, passer par PocketBase (voir section suivante).
							</p>
						</div>
					</section>

					<section id="gestion" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							9. Espace Gestion (admin)
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								L'espace <a href="/gestion" class="text-primary font-medium hover:underline">/gestion</a> est réservé aux comptes <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">admin</code>. Tout autre utilisateur est redirigé.
							</p>
							<div class="rounded-xl border border-gray-200 p-4">
								<p class="font-semibold text-gray-900 mb-2">Tableau de bord</p>
								<p class="text-sm">Statistiques (total membres, actives, en attente, cotisations payées), raccourci vers les nouvelles inscriptions à valider, liens rapides vers les actions fréquentes.</p>
							</div>
							<div class="rounded-xl border border-gray-200 p-4">
								<p class="font-semibold text-gray-900 mb-2">Membres — <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/gestion/membres</code></p>
								<ul class="list-disc list-inside space-y-1 text-sm pl-2">
									<li>liste paginée, recherche par nom/e-mail/structure, filtre par statut</li>
									<li>validation des comptes <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pending</code> (passage en <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">active</code>)</li>
									<li>création directe d'un compte via <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/gestion/membres/nouveau</code></li>
									<li>suppression d'un membre (action <strong>irréversible</strong>)</li>
								</ul>
							</div>
							<div class="rounded-xl border border-gray-200 p-4">
								<p class="font-semibold text-gray-900 mb-2">Cotisations — <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/gestion/cotisations</code></p>
								<ul class="list-disc list-inside space-y-1 text-sm pl-2">
									<li>filtres année et statut (<code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pending</code>/<code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">paid</code>)</li>
									<li>action « Marquer comme payé » pour les règlements hors ligne</li>
									<li>historique complet par membre et par année</li>
								</ul>
							</div>
							<p class="text-sm text-gray-600">
								La création des cotisations annuelles pour l'ensemble des membres se fait actuellement depuis l'admin PocketBase (pas d'action groupée dans l'UI).
							</p>
						</div>
					</section>

					<section id="pocketbase" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							10. PocketBase /admin
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Le dashboard PocketBase est accessible sur <a href="/admin" class="text-primary font-medium hover:underline">/admin</a> (redirection Caddy vers <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/_/</code>). Il permet de :
							</p>
							<ul class="list-disc list-inside space-y-1 text-sm pl-2">
								<li>créer et modifier les activités (collection <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">activites</code>) et les ressources (<code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">ressources</code>)</li>
								<li>téléverser images (activités) et fichiers PDF (ressources)</li>
								<li>éditer directement n'importe quel enregistrement (utilisateurs, cotisations…)</li>
								<li>gérer les règles d'accès (<code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">listRule</code>, <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">viewRule</code>, etc.)</li>
							</ul>
							<p class="text-sm text-gray-600">
								Les identifiants superuser sont définis dans les variables d'environnement (<code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">PB_ADMIN_EMAIL</code>, <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">PB_ADMIN_PASSWORD</code>) et créés au premier démarrage par <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">pb_init.sh</code>.
							</p>
						</div>
					</section>

					<section id="vigilance" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							11. Points de vigilance
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<ul class="space-y-3">
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>Changer le mot de passe superuser PocketBase dès la première ouverture du dashboard.</span>
								</li>
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>Suivre régulièrement <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/gestion/membres?status=pending</code> pour ne pas laisser de candidatures en attente.</span>
								</li>
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>La suppression d'un membre est définitive — privilégier le statut <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">inactive</code> lorsqu'il faut simplement désactiver un accès.</span>
								</li>
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>KKiaPay est en sandbox. Avant la mise en production, passer le SDK en mode live, configurer les clés et refaire un test bout-en-bout.</span>
								</li>
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>Les pages Activités et Ressources sont publiques : vérifier le contenu avant publication (orthographe, images, poids des fichiers PDF).</span>
								</li>
								<li class="flex gap-3">
									<span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">!</span>
									<span>Le mot de passe du guide est lu depuis la variable d'environnement <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">GUIDE_PASSWORD</code> — la définir en production pour remplacer la valeur par défaut.</span>
								</li>
							</ul>
						</div>
					</section>

					<section id="support" class="scroll-mt-24">
						<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							12. Support technique
						</h2>
						<div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed">
							<p>
								Un bug à signaler, une évolution à discuter, un accès à débloquer ?
							</p>
							<div class="grid sm:grid-cols-2 gap-4">
								<div class="rounded-xl border border-gray-200 p-4">
									<p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Contact fonctionnel</p>
									<p class="text-sm">Bureau Exécutif AFMEF — pour toute question sur les membres, cotisations ou contenus publiés.</p>
								</div>
								<div class="rounded-xl border border-gray-200 p-4">
									<p class="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Contact technique</p>
									<p class="text-sm">Équipe de développement — pour les bugs, incidents, et évolutions de la plateforme.</p>
								</div>
							</div>
							<p class="text-sm text-gray-600">
								Avant d'ouvrir un ticket, vérifier le statut du serveur et relancer une fois le navigateur (cache, cookies de session). Pour les incidents PocketBase, consulter les logs Coolify.
							</p>
						</div>
					</section>
				</article>
			</div>
		</div>

		<!-- Retour en haut -->
		<button
			type="button"
			onclick={scrollToTop}
			aria-label="Retour en haut"
			class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 flex items-center justify-center {showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
			</svg>
		</button>
	</div>
{/if}

<style>
	:global(html):has(.guide-root) {
		scroll-behavior: smooth;
	}
</style>
