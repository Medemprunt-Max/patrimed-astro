# patrimed-astro : le site public patrimed.fr

Site vitrine du cabinet de gestion de patrimoine **Patrimed** (LPMED). Astro en
rendu statique, hébergé chez O2Switch et déployé par FTPS.

> **Attention au nommage** : le dossier local s'appelle `Site Patrimed`, le dépôt
> GitHub s'appelle **`patrimed-astro`**. Ce sont bien le même projet.
>
> Le site est né comme une copie du site frère
> [medemprunt-astro](https://github.com/Medemprunt-Max/medemprunt-astro) : c'est
> pourquoi `package.json` porte encore le nom `medemprunt-astro`. Sans
> conséquence (paquet privé, jamais publié), mais cela surprend.

## 1. Où ça tourne

| | |
|---|---|
| Domaine | `https://patrimed.fr` (déclaré dans `astro.config.mjs`) |
| Hébergeur | **O2Switch**, mise en ligne par FTPS avec `deploy-site.sh` |
| Dépôt | `github.com/Medemprunt-Max/patrimed-astro` |
| Service appelé | VPS Patrimed, `api.patrimed.fr`, widget de prise de rendez-vous |

⚠️ Le dépôt contient aussi un `netlify.toml`, **antérieur** au passage chez
O2Switch (mars 2026 contre mai 2026). Il n'est plus le chemin de mise en ligne
de référence. Le garder ou le supprimer est un arbitrage à trancher : tant qu'il
est là, il laisse croire à un déploiement automatique qui n'existe pas.

## 2. Développer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview
```

Astro 5, Tailwind 3 (plus le plugin `typography` pour les articles),
`@astrojs/sitemap`. La page `/avis` est exclue du sitemap : c'est une
redirection `noindex` vers le formulaire d'avis Google.

## 3. Déployer

**Il n'y a pas de déploiement automatique.** La mise en ligne est un geste
manuel, à faire depuis un poste :

```bash
./deploy-site.sh                # build puis envoi
DRY_RUN=1 ./deploy-site.sh      # simulation, n'écrit rien sur le serveur
SKIP_BUILD=1 ./deploy-site.sh   # réutilise le dist/ existant
```

Prérequis : `lftp` (`brew install lftp`) et un fichier `.env.deploy` à la racine,
**non versionné**, contenant `FTP_HOST`, `FTP_USER`, `FTP_PASS` et
`FTP_REMOTE_DIR`. Sans lui, le script s'arrête avec un message explicite.

Le script est volontairement conservateur, et il faut le savoir :

- **Pas de `--delete`** : rien n'est supprimé sur le serveur. Les anciens fichiers
  générés (hachages CSS et JS obsolètes) s'accumulent sans être référencés.
- **Trois exclusions** : `.DS_Store`, `.well-known/` (les défis Let's Encrypt, à
  ne **jamais** écraser sous peine de casser le certificat) et `images/blog/`
  (images non versionnées, envoyées hors de ce script).
- Toujours faire un `DRY_RUN=1` avant une mise en ligne inhabituelle.

## 4. Structure

```
src/
├─ pages/          accueil, gestion-patrimoine, partenaires, rdv, contact,
│                  parrainage, avis, mentions légales, données personnelles
│  └─ patriactu/   le blog (index + page d'article)
├─ content/        articles en Markdown (SCPI, loi Girardin, livret A,
│                  taux d'usure, diversification…)
├─ components/     Header, Footer, sections
└─ layouts/        Layout.astro
```

## 5. Risque connu : les appels à `api.patrimed.fr` sont directs

Les pages `contact` et `rdv` chargent le widget de prise de rendez-vous et
l'appellent **directement** sur `api.patrimed.fr`, sans proxy same-origin.

Le site frère medemprunt.fr a dû abandonner ce montage : chez une partie des
visiteurs (réseaux d'entreprise filtrés, DNS filtrants, bloqueurs de contenu),
l'appel vers un domaine tiers est **coupé côté navigateur, avant de partir**. Le
formulaire affiche alors une erreur d'envoi alors qu'**aucune ligne n'apparaît
dans les journaux nginx du VPS** : c'est la signature du problème.

Là-bas, le remède a été un proxy dans `netlify.toml`. Ici, l'hébergement O2Switch
ne l'offre pas de la même manière. Le risque est donc ouvert. Si un prospect
signale un formulaire qui ne part pas, **vérifier d'abord l'absence de ligne
côté nginx** avant de chercher un bug dans le code.

## 6. Accès nécessaires

O2Switch (FTPS, plus le panneau d'hébergement pour le domaine et le certificat),
GitHub, et le VPS pour les journaux du service de rendez-vous.
