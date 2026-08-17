// Envoi des leads simulateurs vers le service interne (VPS, port 8101).
//
// L'appel passe par un proxy *same-origin* (`/api/...`, câblé dans netlify.toml)
// et non directement vers api.patrimed.fr : un appel vers un domaine tiers est
// coupé avant même de partir chez une partie des visiteurs — réseaux d'hôpitaux
// filtrés (notre cœur de cible), DNS filtrants, bloqueurs de contenu.
// Modèle éprouvé sur medemprunt.fr (src/lib/api.ts).
//
// Repli sur l'URL directe quand le proxy lui-même est hors jeu (erreur réseau,
// ou 404/502/503/504 renvoyés par l'edge — dont le 404 de l'hébergement Apache
// tant que le site est servi par O2Switch, sans proxy). Dans ces cas précis la
// requête n'a pas été traitée par l'API : rejouer ne crée pas de doublon. Toute
// autre réponse (y compris 400 ou 429) est rendue telle quelle à l'appelant.

const DIRECT_BASE = 'https://api.patrimed.fr/rdv/api/';
const PROXY_BASE = '/api/';

// Codes qui signalent un proxy défaillant, jamais un traitement métier.
const PROXY_FAILURE = [404, 502, 503, 504];

/**
 * @param endpoint  Nom de l'endpoint, sans slash : 'patrimed-lead'.
 * @param payload   Corps JSON à envoyer.
 * @returns {Promise<Response>}
 */
export async function postApi(endpoint, payload) {
  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(PROXY_BASE + endpoint, init);
    if (!PROXY_FAILURE.includes(res.status)) return res;
  } catch (e) {
    // Erreur réseau : rien n'a été traité, le repli est sans risque.
  }
  return fetch(DIRECT_BASE + endpoint, init);
}
