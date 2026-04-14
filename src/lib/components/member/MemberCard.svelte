<script>
	let { member } = $props();

	const showEmail = $derived(member.privacy?.showEmail ?? member.showEmail);
	const showPhone = $derived(member.privacy?.showPhone ?? member.showPhone);
</script>

<div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
	<div class="flex items-start gap-4">
		<!-- Avatar -->
		<div class="w-14 h-14 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
			{#if member.avatar}
				<img
					src={member.avatar}
					alt={member.displayName}
					class="w-full h-full object-cover"
				/>
			{:else}
				<span class="text-primary font-bold text-xl">
					{member.displayName?.charAt(0).toUpperCase() || 'M'}
				</span>
			{/if}
		</div>

		<!-- Info -->
		<div class="flex-1 min-w-0">
			<h3 class="font-semibold text-gray-900 truncate">{member.displayName}</h3>

			{#if member.fonction}
				<p class="text-primary font-medium text-sm">{member.fonction}</p>
			{/if}

			{#if member.structure}
				<p class="text-gray-500 text-sm truncate">{member.structure}</p>
			{/if}
		</div>
	</div>

	<!-- Contact -->
	{#if (showEmail && member.email) || (showPhone && member.phone)}
		<div class="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
			{#if showEmail && member.email}
				<a
					href="mailto:{member.email}"
					class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					<span class="truncate">{member.email}</span>
				</a>
			{/if}

			{#if showPhone && member.phone}
				<a
					href="tel:{member.phone}"
					class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
				>
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
					</svg>
					<span>{member.phone}</span>
				</a>
			{/if}
		</div>
	{/if}

	{#if member.description}
		<p class="mt-3 text-sm text-gray-600 line-clamp-2">{member.description}</p>
	{/if}
</div>
