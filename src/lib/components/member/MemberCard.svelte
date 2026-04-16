<script>
	let { member } = $props();

	const showEmail = $derived(member.privacy?.showEmail ?? member.showEmail);
	const showPhone = $derived(member.privacy?.showPhone ?? member.showPhone);
	const isAdmin = $derived(member.role === 'admin');
</script>

<div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
	<!-- Top accent bar -->
	<div class="h-1 {isAdmin ? 'bg-primary' : 'bg-gray-200'}"></div>

	<div class="p-5">
		<div class="flex items-start gap-4">
			<!-- Avatar -->
			<div class="w-14 h-14 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
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
				<div class="flex items-center gap-2">
					<h3 class="font-semibold text-gray-900 truncate">{member.displayName}</h3>
					{#if isAdmin}
						<span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-primary/10 text-primary uppercase tracking-wider flex-shrink-0">
							Admin
						</span>
					{/if}
				</div>

				{#if member.fonction}
					<p class="text-primary font-medium text-sm mt-0.5">{member.fonction}</p>
				{/if}

				{#if member.structure}
					<p class="text-gray-500 text-sm truncate">{member.structure}</p>
				{/if}
			</div>
		</div>

		<!-- Contact -->
		{#if (showEmail && member.email) || (showPhone && member.phone)}
			<div class="mt-4 pt-3 border-t border-gray-100 space-y-2">
				{#if showEmail && member.email}
					<a
						href="mailto:{member.email}"
						class="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors group"
					>
						<div class="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-primary/5 flex items-center justify-center flex-shrink-0 transition-colors">
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<span class="truncate">{member.email}</span>
					</a>
				{/if}

				{#if showPhone && member.phone}
					<a
						href="tel:{member.phone}"
						class="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors group"
					>
						<div class="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-primary/5 flex items-center justify-center flex-shrink-0 transition-colors">
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
						</div>
						<span>{member.phone}</span>
					</a>
				{/if}
			</div>
		{/if}

		{#if member.description}
			<p class="mt-3 text-sm text-gray-500 line-clamp-2 italic">{member.description}</p>
		{/if}
	</div>
</div>
