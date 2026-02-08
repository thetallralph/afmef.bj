<script>
	import MemberCard from '$lib/components/member/MemberCard.svelte';

	let { data } = $props();

	let searchQuery = $state('');

	// Mock data - will be replaced by API
	const allMembers = [
		{
			id: 1,
			displayName: 'Marie Dupont',
			email: 'marie.dupont@email.com',
			phone: '+229 97 12 34 56',
			structure: 'Ministère de l\'Économie et des Finances',
			fonction: 'Directrice des Études',
			showEmail: true,
			showPhone: true,
			avatar: null
		},
		{
			id: 2,
			displayName: 'Aminata Sow',
			email: 'aminata.sow@email.com',
			phone: '+229 96 78 90 12',
			structure: 'Banque Centrale',
			fonction: 'Économiste Senior',
			showEmail: true,
			showPhone: false,
			avatar: null
		},
		{
			id: 3,
			displayName: 'Fatou Diallo',
			email: 'fatou.diallo@email.com',
			phone: '+229 95 45 67 89',
			structure: 'Direction Générale du Trésor',
			fonction: 'Chef de Service',
			showEmail: false,
			showPhone: false,
			avatar: null
		},
		{
			id: 4,
			displayName: 'Léa Ahouandjinou',
			email: 'lea.ahouandjinou@email.com',
			phone: '+229 94 32 10 98',
			structure: 'Cour des Comptes',
			fonction: 'Auditrice',
			showEmail: true,
			showPhone: true,
			bio: 'Passionnée par la gouvernance financière et le développement durable.'
		},
		{
			id: 5,
			displayName: 'Nafissatou Bah',
			email: 'nafissatou.bah@email.com',
			phone: '+229 93 21 43 65',
			structure: 'Direction Générale des Impôts',
			fonction: 'Inspectrice des Impôts',
			showEmail: true,
			showPhone: false,
			avatar: null
		},
		{
			id: 6,
			displayName: 'Christelle Houngbedji',
			email: 'christelle.h@email.com',
			phone: '+229 92 54 76 98',
			structure: 'Direction Générale du Budget',
			fonction: 'Analyste Budgétaire',
			showEmail: true,
			showPhone: true,
			avatar: null
		}
	];

	let filteredMembers = $derived(() => {
		if (!searchQuery) return allMembers;

		const query = searchQuery.toLowerCase();
		return allMembers.filter(member =>
			member.displayName.toLowerCase().includes(query) ||
			member.structure?.toLowerCase().includes(query) ||
			member.fonction?.toLowerCase().includes(query)
		);
	});
</script>

<svelte:head>
	<title>Annuaire des membres - AFMEF</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-900">Annuaire des membres</h1>
	<p class="text-gray-600 mt-1">
		Retrouvez les membres de l'AFMEF
	</p>
</div>

<!-- Search -->
<div class="bg-white rounded-xl p-4 border border-gray-200 mb-6">
	<div class="relative">
		<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
		<input
			type="text"
			placeholder="Rechercher par nom, structure ou fonction..."
			bind:value={searchQuery}
			class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
		/>
	</div>
</div>

<!-- Count -->
<p class="text-sm text-gray-500 mb-4">
	{filteredMembers().length} membre{filteredMembers().length > 1 ? 's' : ''} trouvé{filteredMembers().length > 1 ? 's' : ''}
</p>

<!-- Members grid -->
<div class="grid gap-4 md:grid-cols-2">
	{#each filteredMembers() as member}
		<MemberCard {member} />
	{:else}
		<div class="md:col-span-2 bg-white rounded-xl p-10 border border-gray-200 text-center">
			<svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<p class="text-gray-500">Aucun membre trouvé</p>
		</div>
	{/each}
</div>
