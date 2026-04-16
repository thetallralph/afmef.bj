<script>
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { formatDate } from '$lib/utils/validators.js';

	let { data } = $props();

	let searchInput = $state(data.search || '');
	let statusFilter = $state(data.status || '');
	let deleteModal = $state(false);
	let memberToDelete = $state(null);
	let deleteLoading = $state(false);
	let error = $state('');

	function handleSearch(e) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/gestion/membres?${params.toString()}`);
	}

	function handleFilterChange() {
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		if (statusFilter) params.set('status', statusFilter);
		goto(`/gestion/membres?${params.toString()}`);
	}

	function confirmDelete(member) {
		memberToDelete = member;
		deleteModal = true;
	}

	async function handleDelete() {
		if (!memberToDelete) return;
		deleteLoading = true;
		error = '';

		const formData = new FormData();
		formData.set('id', memberToDelete.id);

		const response = await fetch('/gestion/membres?/delete', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.type === 'failure') {
			error = result.data?.error || 'Erreur lors de la suppression';
		} else {
			deleteModal = false;
			memberToDelete = null;
			await invalidateAll();
		}
		deleteLoading = false;
	}
</script>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Membres</h1>
		<p class="text-gray-500 mt-1">{data.total} membre{data.total > 1 ? 's' : ''} au total</p>
	</div>
	<Button href="/gestion/membres/nouveau">
		<svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
		Ajouter un membre
	</Button>
</div>

{#if error}
	<div class="mb-4">
		<Alert type="error" dismissible ondismiss={() => error = ''}>{error}</Alert>
	</div>
{/if}

<!-- Filters -->
<div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
	<form onsubmit={handleSearch} class="flex flex-col sm:flex-row gap-3">
		<div class="relative flex-1">
			<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				placeholder="Rechercher par nom, email, structure..."
				bind:value={searchInput}
				class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
			/>
		</div>
		<select
			bind:value={statusFilter}
			onchange={handleFilterChange}
			class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
		>
			<option value="">Tous les statuts</option>
			<option value="active">Actif</option>
			<option value="pending">En attente</option>
			<option value="inactive">Inactif</option>
		</select>
		<Button type="submit" size="sm">Rechercher</Button>
	</form>
</div>

<!-- Table -->
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
	{#if data.members.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 text-left">
					<tr>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Membre</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Structure</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Fonction</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Inscrit le</th>
						<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.members as member}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-4 py-3">
								<a href="/gestion/membres/{member.id}" class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
										{#if member.avatar}
											<img src={member.avatar} alt="" class="w-full h-full object-cover" />
										{:else}
											<span class="text-primary font-bold text-xs">
												{member.displayName?.charAt(0).toUpperCase() || '?'}
											</span>
										{/if}
									</div>
									<div class="min-w-0">
										<div class="flex items-center gap-1.5">
											<p class="text-sm font-medium text-gray-900 truncate">{member.displayName}</p>
											{#if member.role === 'admin'}
												<span class="px-1 py-0.5 text-[9px] font-bold rounded bg-purple-100 text-purple-700 uppercase flex-shrink-0">Admin</span>
											{/if}
										</div>
										<p class="text-xs text-gray-500 truncate">{member.email}</p>
									</div>
								</a>
							</td>
							<td class="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
								{member.structure || '-'}
							</td>
							<td class="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
								{member.fonction || '-'}
							</td>
							<td class="px-4 py-3">
								<span class="px-2 py-0.5 text-xs font-medium rounded-full
									{member.status === 'active' ? 'bg-green-100 text-green-700' : member.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}">
									{member.status === 'active' ? 'Actif' : member.status === 'pending' ? 'En attente' : 'Inactif'}
								</span>
							</td>
							<td class="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
								{formatDate(member.created)}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-1">
									<a
										href="/gestion/membres/{member.id}"
										class="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
										title="Modifier"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</a>
									<button
										onclick={() => confirmDelete(member)}
										class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
										title="Supprimer"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
				<p class="text-sm text-gray-500">
					Page {data.currentPage} sur {data.totalPages}
				</p>
				<div class="flex gap-2">
					{#if data.currentPage > 1}
						<Button
							size="sm"
							variant="outline"
							href="/gestion/membres?page={data.currentPage - 1}{data.search ? `&q=${data.search}` : ''}{data.status ? `&status=${data.status}` : ''}"
						>
							Précédent
						</Button>
					{/if}
					{#if data.currentPage < data.totalPages}
						<Button
							size="sm"
							variant="outline"
							href="/gestion/membres?page={data.currentPage + 1}{data.search ? `&q=${data.search}` : ''}{data.status ? `&status=${data.status}` : ''}"
						>
							Suivant
						</Button>
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<div class="p-12 text-center">
			<svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
			<p class="text-gray-500 mb-4">Aucun membre trouvé</p>
			<Button href="/gestion/membres/nouveau" size="sm">Ajouter un membre</Button>
		</div>
	{/if}
</div>

<!-- Delete confirmation modal -->
<Modal bind:open={deleteModal} title="Confirmer la suppression" size="sm">
	<p class="text-gray-600 mb-6">
		Voulez-vous vraiment supprimer le membre <strong>{memberToDelete?.displayName}</strong> ?
		Cette action est irréversible.
	</p>
	<div class="flex justify-end gap-3">
		<Button variant="outline" onclick={() => deleteModal = false}>Annuler</Button>
		<Button variant="danger" onclick={handleDelete} loading={deleteLoading}>Supprimer</Button>
	</div>
</Modal>
