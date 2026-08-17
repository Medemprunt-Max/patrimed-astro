# Migration patrimed.fr : O2Switch → Netlify

Préparé le 2026-08-13. Objectif : aligner Patrimed sur l'architecture de medemprunt.fr
(web Netlify + emails Microsoft 365 + DNS OVH).

## État des lieux (vérifié le 2026-08-13)

| Service | Situation actuelle |
|---|---|
| Site web patrimed.fr | O2Switch (A `109.234.167.156`), déployé via `deploy-site.sh` (FTPS) |
| Emails @patrimed.fr | **Microsoft 365** (MX `patrimed-fr.mail.protection.outlook.com`) — indépendants d'O2Switch |
| Zone DNS | **OVH** (`ns10.ovh.net` / `dns10.ovh.net`) |
| Netlify | projet `patrimed-preview` (team medemprunt-max, siteId `4358ae0c-1ee3-432b-a389-1d9d52b5d621`), branche de production = `main`, plan gratuit |
| Précédent interne | medemprunt.fr est déjà servi par Netlify (`75.2.60.5`) — même playbook |

## Déjà préparé dans le repo (cette branche)

- **`netlify.toml`** : toutes les redirections 301 du `.htaccess` portées (articles WordPress
  datés/non datés, pages, archives par années 2018-2026, reliquats de thème) + en-têtes de
  cache (`/_astro/*` immutable 1 an, images 30 j). HTTPS et www→apex seront gérés par Netlify.
- **`astro.config.mjs`** : `build.format: 'file'` — les pages sortent en `page.html`, Netlify
  sert `/page` **sans slash final ni redirection**, en cohérence avec `trailingSlash: 'never'`,
  les balises canonical et les URLs indexées.
- **Images du blog versionnées** : `public/images/blog/*` (récupérées d'O2Switch, optimisées
  de 7,6 Mo à ~2 Mo). L'exclusion correspondante a été retirée de `deploy-site.sh`.
- **`.htaccess` conservé et rendu compatible** avec les deux formats de build : O2Switch reste
  déployable à l'identique tant que la bascule n'a pas eu lieu.

Non porté dans `netlify.toml` (regex impossibles, sans valeur SEO) : `/elementor-<n>` (404),
l'article « livret A » au slug tronqué (capté par la règle `/2023/*` → `/patriactu`).

## Bascule — jour J (~30 min de manipulations + propagation DNS)

0. **(Recommandé) Renommer le site Netlify** `patrimed-preview` → `patrimed`
   (app.netlify.com → Site configuration → Change site name). À faire **avant** l'étape DNS,
   car le CNAME `www` pointera sur ce nom. Conséquence : les URLs de preview changent
   (`…--patrimed.netlify.app`).
1. **Merger la PR** de la branche vers `main` (recommandé : basculer avec le nouveau site,
   tout sort d'un coup). Vérifier que `https://<nom-du-site>.netlify.app` affiche le site attendu.
2. **Netlify → Domain management** : ajouter `patrimed.fr` (domaine **primaire**) puis
   `www.patrimed.fr`. Netlify affichera « Awaiting external DNS » — normal.
3. **Chez OVH** (zone DNS de patrimed.fr) — modifier **uniquement** ces deux lignes :
   - `A @ 109.234.167.156` → **`A @ 75.2.60.5`**
   - `CNAME www patrimed.fr.` → **`CNAME www <nom-du-site>.netlify.app.`**

   > ⛔ **NE PAS TOUCHER** (sinon les emails tombent) :
   > - `MX … patrimed-fr.mail.protection.outlook.com`
   > - `TXT v=spf1 include:spf.protection.outlook.com a:serveur2.lgmed.fr -all`
   > - `TXT v=DMARC1 …`, `TXT google-site-verification=…`
   > - tout enregistrement CNAME/TXT de type `selector1._domainkey` (DKIM), `autodiscover`, etc.

   Astuce : abaisser le TTL des deux lignes à 300 s une heure avant, le remonter après.
4. **Attendre la propagation** (quelques minutes à quelques heures). Netlify provisionne le
   certificat Let's Encrypt automatiquement dès que le DNS pointe.

## Vérifications post-bascule

- [ ] `https://patrimed.fr` répond 200 avec certificat valide
- [ ] `http://` → `https://` et `www.patrimed.fr` → `patrimed.fr` (301)
- [ ] `/qui-sommes-nous` → 200 sans redirection ; `/qui-sommes-nous/` → 301 sans slash
- [ ] 301 héritées : `/simulation` → `/simulateurs`, `/per` → `/simulateurs/economie-impot-per`,
      `/blog` → `/patriactu`, `/2023/05/12/scpi` → `/patriactu/scpi`, `/services` → `/gestion-patrimoine`
- [ ] Images du blog visibles sur `/patriactu` et les articles
- [ ] Page 404 servie sur une URL inexistante
- [ ] **Emails** : s'envoyer un message interne + depuis une adresse externe (rien ne doit changer)
- [ ] Google Search Console : re-soumettre `sitemap-index.xml`, surveiller la couverture 1-2 semaines

**Rollback** (si problème) : remettre chez OVH `A @ 109.234.167.156` et
`CNAME www patrimed.fr.` — O2Switch reste intact tant qu'il n'est pas résilié.

## Après stabilisation (2 à 4 semaines)

- [ ] Inventaire du compte O2Switch avant résiliation : autres sites/sous-domaines hébergés ?
      tâches cron ? redirections ou boîtes mail résiduelles ? fichiers à archiver ?
- [ ] Résilier l'hébergement O2Switch (le domaine reste chez OVH, rien à faire)
- [ ] `deploy-site.sh` et `public/.htaccess` deviennent obsolètes — à supprimer du repo
- [ ] Opportunité : activer **Netlify Forms** pour la capture email des simulateurs
      (remplacerait le `mailto:` actuel, 100 soumissions/mois incluses)
