<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MemberHeader from '$lib/components/member/MemberHeader.svelte';
	import { logout } from '$lib/stores/auth.svelte.js';

	let { data, children } = $props();

	const isPublicPage = $derived(
		$page.url.pathname === '/espace-membre/connexion' ||
		$page.url.pathname === '/espace-membre/mot-de-passe-oublie'
	);

	async function handleLogout() {
		await logout();
		goto('/espace-membre/connexion');
	}
</script>

<svelte:head>
	<title>Espace Membre - AFMEF</title>
</svelte:head>

{#if isPublicPage}
	<!-- Public pages (login, password reset) - standalone layout -->
	{@render children()}
{:else}
	<!-- Protected pages with main header + member sub-header -->
	<Header />
	<MemberHeader user={data.user} onlogout={handleLogout} />

	<main class="min-h-[60vh] bg-gray-50 py-8 lg:py-12">
		<div class="container mx-auto px-4 max-w-5xl">
			{@render children()}
		</div>
	</main>

	<Footer />
{/if}
