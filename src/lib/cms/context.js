import { getContext, setContext } from 'svelte';

/**
 * @typedef {{ text: Record<string,string>, image: Record<string,string>, gallery: Record<string,string[]> }} CmsData
 */

const KEY = Symbol('cms-overrides');

/** @type {CmsData} */
const empty = { text: {}, image: {}, gallery: {} };

/**
 * Expose les surcharges CMS aux composants descendants.
 * On passe un getter pour que le contexte reste synchronisé lors des navigations.
 * @param {() => CmsData} get
 */
export function provideCms(get) {
	setContext(KEY, {
		get text() {
			return get()?.text ?? empty.text;
		},
		get image() {
			return get()?.image ?? empty.image;
		},
		get gallery() {
			return get()?.gallery ?? empty.gallery;
		}
	});
}

/** @returns {CmsData} */
export function useCms() {
	return getContext(KEY) ?? empty;
}
