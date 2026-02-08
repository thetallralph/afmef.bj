<script>
	let {
		type = 'text',
		name,
		label,
		placeholder = '',
		value = $bindable(''),
		error = '',
		disabled = false,
		required = false,
		autocomplete = '',
		class: className = ''
	} = $props();

	let focused = $state(false);
</script>

<div class="w-full {className}">
	{#if label}
		<label for={name} class="block text-sm font-medium text-gray-700 mb-2">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">
		<input
			{type}
			{name}
			id={name}
			{placeholder}
			{disabled}
			{required}
			{autocomplete}
			bind:value
			onfocus={() => focused = true}
			onblur={() => focused = false}
			class="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none
				{error
					? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
					: 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}
				{disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
			"
		/>

		{#if type === 'password' && value}
			<span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
			</span>
		{/if}
	</div>

	{#if error}
		<p class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
			</svg>
			{error}
		</p>
	{/if}
</div>
