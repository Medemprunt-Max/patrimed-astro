// Gate de capture de lead partagé par les simulateurs Patrimed.
//
// Modèle validé (13/08/2026) : le visiteur répond aux questions du simulateur,
// voit un teaser (jamais le résultat clé), laisse ses coordonnées en dernière
// étape, puis le résultat s'affiche à l'écran ET l'étude part par email côté
// serveur. Le calcul reste 100 % navigateur : le gate est un choix d'expérience,
// pas un secret technique.
//
// Anti-faux (première couche, rejouée côté serveur qui reste l'autorité) :
// mobile français uniquement, rejet des suites et répétitions, email plausible.

import { trackEvent } from './sim-utils.js';
import { postApi } from './lead-api.js';

const CONTACT_KEY = 'patrimed-lead-contact';
const UNLOCK_KEY = 'patrimed-sim-unlocked';

// Domaines d'emails jetables les plus courants (liste complète côté serveur).
const DISPOSABLE = ['yopmail.', 'mailinator.', 'jetable.', 'trashmail.', 'guerrillamail.', 'tempmail.', 'temp-mail.'];

export function validateFrMobile(raw) {
  let d = String(raw || '').replace(/[\s.\-()]/g, '');
  if (d.startsWith('+33')) d = '0' + d.slice(3);
  else if (d.startsWith('0033')) d = '0' + d.slice(4);
  if (!/^0[67]\d{8}$/.test(d)) {
    return { ok: false, message: 'Entrez un numéro de mobile français (06 ou 07).' };
  }
  const rest = d.slice(2).split('').map(Number);
  const unique = new Set(rest).size;
  const ascending = rest.every((n, i) => i === 0 || n === rest[i - 1] + 1);
  const descending = rest.every((n, i) => i === 0 || n === rest[i - 1] - 1);
  if (unique <= 2 || ascending || descending) {
    return { ok: false, message: 'Ce numéro semble invalide — vérifiez votre saisie.' };
  }
  return { ok: true, value: d };
}

export function validateEmail(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) {
    return { ok: false, message: 'Entrez une adresse email valide.' };
  }
  const domain = v.split('@')[1];
  if (DISPOSABLE.some((d) => domain.startsWith(d) || domain.includes('.' + d))) {
    return { ok: false, message: 'Les adresses jetables ne sont pas acceptées — votre étude vous est envoyée à cette adresse.' };
  }
  return { ok: true, value: v };
}

function readStore(storage, key) {
  try {
    return JSON.parse(storage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function writeStore(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le gate reste fonctionnel.
  }
}

/**
 * Initialise le gate d'un simulateur.
 *
 * Prérequis DOM : #<sim>-gate (carte teaser + formulaire #<sim>-gate-form avec
 * champs prenom/nom/email/tel/consent + honeypot "website") et #<sim>-results
 * (bloc résultats, masqué par la classe `hidden`).
 *
 * @param {object}   opts
 * @param {string}   opts.sim         Identifiant : 'per' | 'scpi' | 'interets-composes'.
 * @param {function} opts.buildRecap  () => string[] — lignes du récap envoyé au backend.
 * @param {function} opts.headline    () => string — le chiffre clé (objet du mail équipe).
 * @param {function} [opts.onUnlock]  (fresh:boolean) => void — après déblocage.
 */
export function initLeadGate({ sim, buildRecap, headline, onUnlock }) {
  const gate = document.getElementById(`${sim}-gate`);
  const results = document.getElementById(`${sim}-results`);
  const form = document.getElementById(`${sim}-gate-form`);
  if (!gate || !results || !form) return;

  const field = (name) => form.querySelector(`[name="${name}"]`);
  const errorBox = form.querySelector('[data-gate-error]');
  const submitBtn = form.querySelector('button[type="submit"]');
  let failures = 0;

  function unlock(fresh) {
    gate.classList.add('hidden');
    results.classList.remove('hidden');
    const unlocked = readStore(sessionStorage, UNLOCK_KEY) || {};
    unlocked[sim] = true;
    writeStore(sessionStorage, UNLOCK_KEY, unlocked);
    trackEvent('sim_result_view', { simulateur: sim });
    if (onUnlock) onUnlock(fresh);
  }

  function fieldError(name, message) {
    const el = field(name);
    if (el) {
      el.classList.add('border-red-400');
      el.addEventListener('input', () => el.classList.remove('border-red-400'), { once: true });
    }
    showError(message);
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.classList.add('hidden');
  }

  // Déjà débloqué dans cette session (lead déjà transmis) : pas de re-gate.
  const unlocked = readStore(sessionStorage, UNLOCK_KEY) || {};
  if (unlocked[sim]) {
    gate.classList.add('hidden');
    results.classList.remove('hidden');
    if (onUnlock) onUnlock(false);
    return;
  }

  // Préremplissage depuis un lead déjà envoyé (autre simulateur, même session).
  const saved = readStore(sessionStorage, CONTACT_KEY);
  if (saved) {
    for (const k of ['prenom', 'nom', 'email', 'tel']) {
      const el = field(k);
      if (el && saved[k]) el.value = saved[k];
    }
  }

  trackEvent('lead_gate_view', { simulateur: sim });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const prenom = (field('prenom')?.value || '').trim();
    const nom = (field('nom')?.value || '').trim();
    if (prenom.length < 2) return fieldError('prenom', 'Entrez votre prénom.');
    if (nom.length < 2) return fieldError('nom', 'Entrez votre nom.');

    const email = validateEmail(field('email')?.value);
    if (!email.ok) return fieldError('email', email.message);

    const tel = validateFrMobile(field('tel')?.value);
    if (!tel.ok) return fieldError('tel', tel.message);

    const consent = field('consent');
    if (consent && !consent.checked) {
      return showError('Cochez la case de consentement pour recevoir votre étude.');
    }

    const contact = { prenom, nom, email: email.value, tel: tel.value };
    const payload = {
      cabinet: 'patrimed',
      source: 'simulateur-site',
      simulateur: sim,
      honeypot: (field('website')?.value || '').trim(),
      page: window.location.pathname,
      contact,
      consent: true,
      headline: headline(),
      recap: buildRecap(),
    };

    submitBtn.disabled = true;
    const btnLabel = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res = await postApi('patrimed-lead', payload);
      if (res.ok) {
        writeStore(sessionStorage, CONTACT_KEY, contact);
        trackEvent('lead_submit', { simulateur: sim });
        unlock(true);
        return;
      }
      let message = 'Une erreur est survenue. Vérifiez vos informations et réessayez.';
      try {
        const data = await res.json();
        if (data && data.message) message = data.message;
        if (data && data.field) return fieldError(data.field, message);
      } catch {
        // Réponse non-JSON (page d'erreur edge) : message générique.
      }
      if (res.status === 429) {
        message = 'Trop de demandes depuis votre connexion — réessayez dans quelques minutes.';
      }
      showError(message);
      trackEvent('lead_submit_error', { simulateur: sim, code: res.status });
    } catch (err) {
      // Panne réseau/serveur : après 2 tentatives, on ne prend pas le visiteur
      // en otage — le résultat s'affiche et on l'invite à nous écrire.
      failures += 1;
      trackEvent('lead_submit_error', { simulateur: sim, code: 'network' });
      if (failures >= 2) {
        const notice = document.createElement('div');
        notice.className = 'bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4 mb-6';
        notice.innerHTML = 'Nous n’avons pas pu enregistrer votre demande (incident technique de notre côté). '
          + 'Votre résultat est affiché ci-dessous — pour recevoir votre étude, écrivez-nous à '
          + '<a href="mailto:contact@patrimed.fr" class="font-semibold underline">contact@patrimed.fr</a>.';
        results.prepend(notice);
        trackEvent('lead_submit_fallback', { simulateur: sim });
        unlock(false);
        return;
      }
      showError('Impossible de joindre nos serveurs. Vérifiez votre connexion et réessayez.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = btnLabel;
    }
  });
}
