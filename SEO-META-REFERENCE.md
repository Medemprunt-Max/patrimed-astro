# SEO — Référence title & meta description par page

Guide des balises `<title>` et `<meta name="description">` du site patrimed.fr.
Le layout suffixe automatiquement « | Patrimed » quand le titre ne contient pas déjà « Patrimed ».

---

## Accueil (`/`)
- **title** : Patrimed — Gestion de patrimoine pour professionnels de santé
- **description** : Conseil patrimonial indépendant dédié aux médecins et professions médicales. Assurance vie, PER, SCPI, fiscalité. RDV gratuit.

## Nos solutions (`/gestion-patrimoine`)
- **title** : Nos solutions patrimoniales — Patrimed
- **description** : Patrimoine, fiscalité, protection, retraite et immobilier. Solutions personnalisées pour les professionnels de santé.

## Qui sommes-nous (`/qui-sommes-nous`)
- **title** : Qui sommes-nous — Patrimed, cabinet indépendant dédié aux soignants
- **description** : Cabinet de gestion de patrimoine indépendant (ORIAS n° 23003677, CIF, COA) fondé pour les médecins, pharmaciens, dentistes et professionnels de santé.

## FAQ (`/faq`)
- **title** : FAQ — Questions fréquentes sur Patrimed et la gestion de patrimoine
- **description** : Premier RDV gratuit, indépendance, rémunération, solutions proposées, horaires : les réponses aux questions les plus fréquentes des professionnels de santé.

## Partenaires (`/partenaires`)
- **title** : Nos partenaires — Patrimed
- **description** : Compagnies d'assurance et sociétés de gestion partenaires de Patrimed.

## Parrainage (`/parrainage`)
- **title** : Parrainage — Patrimed
- **description** : Parrainez un confrère ou une consœur et soyez récompensé.

## PatriActu (`/patriactu`)
- **title** : PatriActu — Blog Patrimed
- **description** : Actualités financières et patrimoniales pour les professionnels de santé.

## Articles (`/patriactu/[slug]`)
- **title** : {titre de l'article} — PatriActu
- **description** : excerpt du frontmatter de l'article
- Schema : BlogPosting (JSON-LD) généré automatiquement.

## Rendez-vous (`/rdv`)
- **title** : Prendre rendez-vous — Patrimed
- **description** : Réservez votre visioconférence gratuite avec un conseiller Patrimed. Disponible 6j/7 jusqu'à 23h.

## Contact (`/contact`)
- **title** : Contact — Patrimed
- **description** : Contactez Patrimed. Disponible 6j/7 jusqu'à 23h en visio. 01 77 62 44 81, contact@patrimed.fr.

## Mentions légales (`/mentions-legales`)
- **title** : Mentions légales — Patrimed
- **description** : Mentions légales du site patrimed.fr — LPMED, conseil en gestion de patrimoine pour professionnels de santé. ORIAS, CIF, COA.

## Données personnelles (`/donnees-personnelles`)
- **title** : Politique de confidentialité — Patrimed
- **description** : Politique de confidentialité et protection des données personnelles de Patrimed — RGPD, droits d'accès, de rectification et de suppression.

---

## Autres surfaces SEO / GEO

- `public/robots.txt` — tous les crawlers autorisés (y compris crawlers IA), pointe vers le sitemap.
- `public/llms.txt` — présentation du site pour les LLM.
- `/rss.xml` — flux RSS de PatriActu (généré par `src/pages/rss.xml.js`).
- `public/.htaccess` — redirections 301 des anciennes URLs WordPress + URLs canoniques sans slash final.
- `public/og-image.jpg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` — régénérables via `node scripts/generate-assets.mjs`.
- JSON-LD : FinancialService (layout global), AboutPage + Person (/qui-sommes-nous), FAQPage (/faq), BlogPosting (articles).
