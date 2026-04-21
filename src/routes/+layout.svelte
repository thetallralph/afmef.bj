<script>
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	const HIDE_CHROME_PREFIXES = ['/gestion', '/guide'];
	let hideChrome = $derived(
		HIDE_CHROME_PREFIXES.some((p) => $page.url.pathname.startsWith(p))
	);
</script>

<div class="min-h-screen flex flex-col">
	{#if !hideChrome}
		<Header />
	{/if}
	<main class="flex-1">
		{@render children()}
	</main>
	{#if !hideChrome}
		<Footer />
	{/if}
</div>
