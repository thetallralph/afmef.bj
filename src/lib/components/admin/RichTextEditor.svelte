<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';

	/**
	 * Éditeur de texte enrichi (TipTap) utilisé par l'espace /gestion.
	 * `onChange` reçoit le HTML à chaque frappe ; le parent décide quand sauvegarder.
	 */
	let { value = '', onChange, placeholder = 'Écrivez ici…', minHeight = '180px' } = $props();

	let element = $state();
	/** @type {Editor|null} */
	let editor = $state(null);
	// Réplique de l'état TipTap : l'objet Editor n'est pas réactif pour Svelte.
	let marks = $state({});

	const ICONS = {
		bold: 'M6 4h5.5a3.5 3.5 0 010 7H6zm0 7h6.5a3.5 3.5 0 010 7H6z',
		italic: 'M14 4h-4m4 0l-4 16m4-16h4M10 20H6m4 0h4',
		strike: 'M5 12h14M8.5 7.5A3.5 3.5 0 0112 5c2 0 3.5 1 4 2.5M16 15c0 2-1.8 4-4 4-2.4 0-4-1.3-4.5-3',
		h2: 'M4 6v12M4 12h8m0-6v12M17 18v-3.5c0-1 .8-1.5 1.7-1.5s1.8.5 1.8 1.6c0 1.9-3.5 2.2-3.5 3.4h3.5',
		h3: 'M4 6v12M4 12h8m0-6v12M17 13.5h3.2l-2 2.2c1.2 0 2.1.6 2.1 1.6s-1 1.7-2.2 1.7c-.9 0-1.7-.3-2.1-.9',
		bullet: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
		ordered: 'M9 6h12M9 12h12M9 18h12M4 5h1v4M4 13h2l-2 3h2M4 9h2',
		quote: 'M7 8h4v4a4 4 0 01-4 4zm8 0h4v4a4 4 0 01-4 4z',
		rule: 'M4 12h16',
		link: 'M13.8 10.2a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.2-1.2m-1.8-6.9a4 4 0 015.7 0 4 4 0 010 5.7l-1.2 1.2',
		undo: 'M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-5',
		redo: 'M15 14l5-5-5-5M20 9H9a5 5 0 000 10h5'
	};

	function syncMarks() {
		if (!editor) return;
		marks = {
			bold: editor.isActive('bold'),
			italic: editor.isActive('italic'),
			strike: editor.isActive('strike'),
			h2: editor.isActive('heading', { level: 2 }),
			h3: editor.isActive('heading', { level: 3 }),
			bullet: editor.isActive('bulletList'),
			ordered: editor.isActive('orderedList'),
			quote: editor.isActive('blockquote'),
			link: editor.isActive('link')
		};
	}

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({ heading: { levels: [2, 3] } }),
				Link.configure({ openOnClick: false, autolink: true }),
				Placeholder.configure({ placeholder })
			],
			content: value || '',
			editorProps: {
				attributes: {
					class: `cms-prose focus:outline-none px-4 py-3 text-gray-800`,
					style: `min-height:${minHeight}`
				}
			},
			onUpdate: ({ editor }) => {
				onChange?.(editor.getHTML());
				syncMarks();
			},
			onSelectionUpdate: syncMarks,
			onTransaction: syncMarks
		});
	});

	onDestroy(() => editor?.destroy());

	// Resynchronise l'éditeur quand la valeur change à l'extérieur (changement de champ, reset…).
	$effect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value || '', { emitUpdate: false });
		}
	});

	function setLink() {
		const previous = editor?.getAttributes('link').href ?? '';
		const url = window.prompt('URL du lien', previous);
		if (url === null) return;
		if (url === '') {
			editor?.chain().focus().unsetLink().run();
			return;
		}
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}
</script>

{#snippet toolButton(icon, label, action, active = false)}
	<button
		type="button"
		onclick={action}
		aria-label={label}
		title={label}
		class="p-1.5 rounded-lg transition-colors {active
			? 'bg-white text-primary shadow-sm'
			: 'text-gray-600 hover:bg-white/70'}"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d={ICONS[icon]} />
		</svg>
	</button>
{/snippet}

<div class="rounded-xl border-2 border-gray-200 bg-white overflow-hidden focus-within:border-primary transition-colors">
	<div class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
		{@render toolButton('bold', 'Gras', () => editor?.chain().focus().toggleBold().run(), marks.bold)}
		{@render toolButton('italic', 'Italique', () => editor?.chain().focus().toggleItalic().run(), marks.italic)}
		{@render toolButton('strike', 'Barré', () => editor?.chain().focus().toggleStrike().run(), marks.strike)}

		<span class="w-px h-5 bg-gray-300 mx-1.5"></span>

		{@render toolButton('h2', 'Titre', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), marks.h2)}
		{@render toolButton('h3', 'Sous-titre', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), marks.h3)}

		<span class="w-px h-5 bg-gray-300 mx-1.5"></span>

		{@render toolButton('bullet', 'Liste à puces', () => editor?.chain().focus().toggleBulletList().run(), marks.bullet)}
		{@render toolButton('ordered', 'Liste numérotée', () => editor?.chain().focus().toggleOrderedList().run(), marks.ordered)}
		{@render toolButton('quote', 'Citation', () => editor?.chain().focus().toggleBlockquote().run(), marks.quote)}
		{@render toolButton('rule', 'Séparateur', () => editor?.chain().focus().setHorizontalRule().run())}

		<span class="w-px h-5 bg-gray-300 mx-1.5"></span>

		{@render toolButton('link', 'Lien', setLink, marks.link)}

		<span class="flex-1"></span>

		{@render toolButton('undo', 'Annuler', () => editor?.chain().focus().undo().run())}
		{@render toolButton('redo', 'Refaire', () => editor?.chain().focus().redo().run())}
	</div>

	<div bind:this={element}></div>
</div>
