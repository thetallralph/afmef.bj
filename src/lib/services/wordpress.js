/**
 * Service pour l'API REST WordPress - afmef.bj
 */

const WP_API_BASE = "https://afmef.bj/wp-json/wp/v2";

/**
 * Fetch avec retry et timeout
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000), // 10 secondes timeout
            });
            return response;
        } catch (error) {
            console.error(
                `Fetch attempt ${i + 1} failed for ${url}:`,
                error.message,
            );
            if (i === retries - 1) throw error;
            // Attendre avant de réessayer
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

/**
 * Récupère les activités depuis WordPress
 * @param {Object} options - Options de requête
 * @param {number} [options.perPage=10] - Nombre d'éléments par page
 * @param {number} [options.page=1] - Numéro de page
 * @param {number} [options.typeActivite] - ID du type d'activité pour filtrer
 * @returns {Promise<{activites: Array, total: number, totalPages: number}>}
 */
export async function getActivites({
    perPage = 10,
    page = 1,
    typeActivite,
} = {}) {
    const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
        _embed: "true",
    });

    if (typeActivite) {
        params.append("type_dactivite", typeActivite.toString());
    }

    try {
        const response = await fetchWithRetry(
            `${WP_API_BASE}/activite?${params}`,
        );

        if (!response.ok) {
            throw new Error(`Erreur API WordPress: ${response.status}`);
        }

        const data = await response.json();
        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(
            response.headers.get("X-WP-TotalPages") || "0",
        );

        const activites = data.map(formatActivite);

        return { activites, total, totalPages };
    } catch (error) {
        console.error("Erreur getActivites:", error);
        // Retourner un résultat vide en cas d'erreur
        return { activites: [], total: 0, totalPages: 0 };
    }
}

/**
 * Récupère une activité par son slug
 * @param {string} slug - Le slug de l'activité
 * @returns {Promise<Object|null>}
 */
export async function getActiviteBySlug(slug) {
    const params = new URLSearchParams({
        slug,
        _embed: "true",
    });

    try {
        const response = await fetchWithRetry(
            `${WP_API_BASE}/activite?${params}`,
        );

        if (!response.ok) {
            throw new Error(`Erreur API WordPress: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        return formatActivite(data[0]);
    } catch (error) {
        console.error("Erreur getActiviteBySlug:", error);
        return null;
    }
}

/**
 * Récupère les types d'activités (taxonomie)
 * @returns {Promise<Array>}
 */
export async function getTypesActivites() {
    try {
        const response = await fetchWithRetry(`${WP_API_BASE}/type_dactivite`);

        if (!response.ok) {
            throw new Error(`Erreur API WordPress: ${response.status}`);
        }

        const data = await response.json();

        return data.map((type) => ({
            id: type.id,
            name: decodeHtmlEntities(type.name),
            slug: type.slug,
            count: type.count,
        }));
    } catch (error) {
        console.error("Erreur getTypesActivites:", error);
        return [];
    }
}

/**
 * Formate une activité brute de l'API en objet utilisable
 * @param {Object} raw - Données brutes de l'API
 * @returns {Object}
 */
function formatActivite(raw) {
    // Récupérer l'image à la une depuis _embedded
    let image = null;
    if (raw._embedded?.["wp:featuredmedia"]?.[0]) {
        const media = raw._embedded["wp:featuredmedia"][0];
        image = {
            url: media.source_url,
            alt: media.alt_text || "",
            sizes: media.media_details?.sizes || {},
        };
    }

    // Récupérer les types d'activité depuis _embedded
    let types = [];
    if (raw._embedded?.["wp:term"]?.[0]) {
        types = raw._embedded["wp:term"][0].map((term) => ({
            id: term.id,
            name: decodeHtmlEntities(term.name),
            slug: term.slug,
        }));
    }

    // Extraire un extrait propre du contenu
    const excerpt = extractExcerpt(raw.content.rendered, 180);

    return {
        id: raw.id,
        slug: raw.slug,
        title: decodeHtmlEntities(raw.title.rendered),
        content: raw.content.rendered,
        excerpt,
        date: raw.date,
        image,
        types,
        link: raw.link,
    };
}

/**
 * Décode les entités HTML
 * @param {string} text
 * @returns {string}
 */
function decodeHtmlEntities(text) {
    if (!text) return "";
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/&hellip;/g, "…")
        .replace(/&nbsp;/g, " ");
}

/**
 * Extrait un texte propre du contenu HTML pour l'aperçu
 * @param {string} html - Contenu HTML
 * @param {number} maxLength - Longueur maximale de l'extrait
 * @returns {string}
 */
function extractExcerpt(html, maxLength = 160) {
    if (!html) return "";

    // Supprimer les balises HTML
    let text = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    // Décoder les entités HTML
    text = decodeHtmlEntities(text);

    // Tronquer si nécessaire
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        // Couper au dernier espace pour ne pas couper un mot
        const lastSpace = text.lastIndexOf(" ");
        if (lastSpace > maxLength * 0.8) {
            text = text.substring(0, lastSpace);
        }
        text += "…";
    }

    return text;
}

/**
 * Récupère les ressources depuis WordPress
 * @param {Object} options - Options de requête
 * @param {number} [options.perPage=20] - Nombre d'éléments par page
 * @param {number} [options.page=1] - Numéro de page
 * @returns {Promise<{ressources: Array, total: number, totalPages: number}>}
 */
export async function getRessources({ perPage = 20, page = 1 } = {}) {
    const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
        _embed: "true",
    });

    try {
        const response = await fetchWithRetry(
            `${WP_API_BASE}/ressource?${params}`,
        );

        if (!response.ok) {
            throw new Error(`Erreur API WordPress: ${response.status}`);
        }

        const data = await response.json();
        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(
            response.headers.get("X-WP-TotalPages") || "0",
        );

        const ressources = data.map(formatRessource);

        return { ressources, total, totalPages };
    } catch (error) {
        console.error("Erreur getRessources:", error);
        return { ressources: [], total: 0, totalPages: 0 };
    }
}

/**
 * Formate une ressource brute de l'API en objet utilisable
 * @param {Object} raw - Données brutes de l'API
 * @returns {Object}
 */
function formatRessource(raw) {
    // Récupérer le fichier attaché
    let fichier = null;

    // Vérifier si le champ 'fichier' existe (format WordPress natif)
    if (raw.fichier) {
        fichier = {
            url: raw.fichier.guid || raw.fichier.url,
            filename: raw.fichier.post_title || raw.fichier.filename,
            filesize: raw.fichier.filesize || null,
            type: raw.fichier.post_mime_type?.split("/")[1] || "pdf",
        };
    }
    // Fallback: vérifier le format ACF
    else if (raw.acf?.fichier) {
        fichier = {
            url: raw.acf.fichier.url || raw.acf.fichier.guid,
            filename: raw.acf.fichier.filename || raw.acf.fichier.post_title,
            filesize: raw.acf.fichier.filesize || null,
            type: raw.acf.fichier.subtype || "pdf",
        };
    }

    // Extraire la description depuis le contenu ou l'extrait
    const description = extractExcerpt(
        raw.content?.rendered || raw.excerpt?.rendered || "",
        200,
    );

    return {
        id: raw.id,
        slug: raw.slug,
        title: decodeHtmlEntities(raw.title.rendered),
        description,
        date: raw.date,
        fichier,
        link: raw.link,
    };
}
