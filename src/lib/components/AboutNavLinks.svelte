<script>
	let { currentPage = '' } = $props();

	const links = [
		{
			href: '/a-propos/genese',
			label: 'Genèse',
			description: 'L\'histoire de notre création',
			id: 'genese',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />`
		},
		{
			href: '/a-propos/vision-objectifs',
			label: 'Vision et Objectifs',
			description: 'Notre cap et nos ambitions',
			id: 'vision-objectifs',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`
		},
		{
			href: '/a-propos/gouvernance',
			label: 'Gouvernance',
			description: 'Notre structure organisationnelle',
			id: 'gouvernance',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />`
		},
		{
			href: '/a-propos/equipe-dirigeante',
			label: 'Équipe dirigeante',
			description: 'Les femmes qui nous guident',
			id: 'equipe-dirigeante',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />`
		},
		{
			href: '/a-propos/logo',
			label: 'Notre Logo',
			description: 'Symboles et identité visuelle',
			id: 'logo',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />`
		}
	];

	const filteredLinks = $derived(links.filter(link => link.id !== currentPage));
</script>

<section class="bg-[#066830] py-16 md:py-20">
	<div class="container mx-auto px-4 max-w-[1300px]">
		<!-- Header with contextual transition -->
		<div class="text-center mb-10">
			<p class="text-white/70 text-sm md:text-base mb-2">Vous venez de découvrir une facette de l'AFMEF</p>
			<h2 class="text-2xl md:text-3xl font-bold text-white">
				Poursuivez l'exploration
			</h2>
		</div>

		<!-- Navigation links grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
			{#each filteredLinks as link}
				<a
					href={link.href}
					class="group p-5 md:p-6 bg-white rounded-xl shadow-sm hover:bg-secondary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
				>
					<div class="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
						<svg class="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							{@html link.icon}
						</svg>
					</div>
					<span class="font-semibold text-gray-900 group-hover:text-primary-dark transition-colors duration-300">
						{link.label}
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
