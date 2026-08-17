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
- **title** : Qui sommes-nous — Patrimed, le patrimoine des médecins par Medemprunt
- **description** : Patrimed est né du constat de Medemprunt : après avoir financé les projets de milliers de médecins, nous les voyions mal conseillés sur leur patrimoine. Cabinet indépendant, ORIAS n° 23003677.
- Angle éditorial voulu : Patrimed = prolongement de Medemprunt côté patrimoine, pour éviter que les mêmes médecins soient mal conseillés. Page calquée sur le « Qui sommes-nous » de Medemprunt (histoire, valeurs, rémunération en clair).

## FAQ (`/faq`)
- **title** : FAQ — Questions fréquentes sur Patrimed et la gestion de patrimoine
- **description** : Premier RDV gratuit, indépendance, rémunération, solutions proposées, horaires : les réponses aux questions les plus fréquentes des professionnels de santé.

## Partenaires (`/partenaires`)
- **title** : Nos partenaires — Patrimed
- **description** : Compagnies d'assurance et sociétés de gestion partenaires de Patrimed.

## Parrainage (`/parrainage`)
- **title** : Parrainage — Patrimed
- **description** : Parrainez un confrère ou une consœur et soyez récompensé.

## Simulateurs (`/simulateurs`)
- **title** : Simulateurs patrimoniaux gratuits pour professionnels de santé
- **description** : PER, SCPI, intérêts composés : chiffrez votre projet en 2 minutes avec les paramètres fiscaux 2026, et recevez votre étude détaillée. Pensé pour les médecins et soignants.
- Schema : CollectionPage + ItemList.
- Funnel (validé 13/08/2026) : 3 entrées par OBJECTIF (impôts/PER, loyers/SCPI, épargne/intérêts
  composés) gated — coordonnées avant le résultat, teaser sans le chiffre clé, lead envoyé au
  service VPS 8101 via `/api/patrimed-lead` (proxy netlify.toml + repli direct, `src/scripts/lead-api.js`).
  ETF vs fonds actifs reste en libre accès (vitrine transparence). Gate partagé :
  `src/components/LeadGate.astro` + `src/scripts/lead-gate.js` (anti-faux mobile/email, GA4 funnel :
  lead_gate_view, lead_submit, lead_submit_error, sim_result_view, hero_sim_click).

## Simulateur PER (`/simulateurs/economie-impot-per`)
- **title** : Simulateur PER 2026 — Calculez votre économie d'impôt
- **description** : Combien d'impôt un versement PER vous fait-il économiser en 2026 ? Simulateur gratuit pour professionnels de santé : barème en vigueur, plafonds TNS (BNC, SELARL) et salarié.
- Schema : WebApplication + FAQPage + BreadcrumbList.
- Chiffres embarqués (à réviser à chaque loi de finances) : barème IR 2026, plafonnement QF 1 807 €, décote 897/1 483 €, PASS 2026 48 060 €, PASS 2025 47 100 €.

## Simulateur ETF vs fonds actifs (`/simulateurs/etf-vs-fonds-actifs`)
- **title** : ETF ou fonds actifs : l'impact réel des frais de vos fonds
- **description** : Un fonds classique prélève 1,5 à 2 % de frais invisibles par an, un ETF moins de 0,4 %. Simulateur gratuit : mesurez l'écart de capital sur 10, 20 ou 30 ans.
- Schema : WebApplication + FAQPage + BreadcrumbList.
- Angle éditorial voulu : diriger l'attention vers les frais courants des fonds (pas les frais du contrat) et le choix ETF/indiciel.

## Calculatrice intérêts composés (`/simulateurs/interets-composes`)
- **title** : Calculatrice d'intérêts composés — Projetez votre épargne
- **description** : Calculatrice d'intérêts composés gratuite : capital initial, versements mensuels, taux et durée. Visualisez la croissance de votre épargne et la part des intérêts, année par année.
- Schema : WebApplication + BreadcrumbList.

## Simulateur SCPI (`/simulateurs/investissement-scpi`)
- **title** : Simulateur SCPI — Vos revenus réels, au comptant ou à crédit
- **description** : Combien rapporte vraiment un investissement en SCPI ? Simulateur gratuit : revenus nets de fiscalité (TMI + 17,2 %), frais de souscription intégrés, mode à crédit avec effort d'épargne réel.
- Schema : WebApplication + FAQPage + BreadcrumbList.
- Chiffres embarqués (à réviser) : prélèvements sociaux 17,2 %, TD moyen marché 2025 ≈ 4,7 %
  (mention éditoriale), frais de souscription par défaut 9 %.
- Angle éditorial validé par Maximilien (13/08/2026) : frais de souscription AFFICHÉS et intégrés
  au calcul, fiscalité revenus fonciers assumée, mode à crédit = pont vers Medemprunt.
- Hypothèses : pas de revalorisation part/loyers, régime réel, intérêts déductibles à crédit ;
  non pris en compte : délai de jouissance, SCPI européennes, IFI. Disclaimer à valider (CIF).

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
