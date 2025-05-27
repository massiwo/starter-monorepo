# ✨ Comment commencer la phase de réalisation avec le Starter AdonisJS SAE RER

Ce guide explique comment démarrer concrètement la phase de réalisation de votre application à partir du starter
monorepo fourni. Il est destiné aux développeurs qui souhaitent intégrer leur propre application dans la structure
existante.

## 🧱 Étape 1 – Créer ou importer votre application

Chaque application doit être placée dans le dossier apps/.

🔁 **Option A – Importer votre app comme sous-module Git**

**Recommandé** si votre monorepo possède plusieurs applications ou si vous souhaitez maintenir une séparation claire
entre le code de votre application et celui du starter.

**ATTENTION :** Ceci nécessite que votre application soit déjà un dépôt Git et prêt à être utilisé comme sous-module

```bash
cd apps/
git submodule add <url-de-votre-app.git> <nom-app>
```

🔄 **Option B – Copier votre app existante**

**Recommandé** si vous n'avez qu'une seule application à développer.

```bash
cd apps/
cp -r <chemin-vers-votre-app> <nom-app>
```

## 🐳 **Étape 2 – Ajouter les Dockerfiles spécifiques à votre app**

Créez un dossier dans docker/ portant le nom de votre app, par exemple :

```bash
mkdir docker/<nom-app>
```

Et placez-y deux fichiers :

- `base.Dockerfile`
- `build.Dockerfile`

*Vous pouvez vous baser sur le dossier docker/mon_app_exemple/ comme modèle.*

## 🛠️ **Étape 3 – Ajouter les scripts associés**

Créez un dossier dans scripts/ portant le nom de votre app, par exemple :

```bash
mkdir scripts/<nom-app>
```

mkdir scripts/<nom-app>/

Ajoutez-y les scripts suivants, à adapter selon vos besoins :

* `start.sh`, `stop.sh`, `restart.sh`
* `install.sh`, `uninstall.sh`
* `build.app.sh`, `build.base.sh`
* `dist.sh`, `enter.sh`, etc.

Utilisez le dossier `scripts/mon_app_exemple/` comme base.

## 📦 **Étape 4 – Ajouter votre app au workspace PNPM**

Dans *pnpm-workspace.yaml*, ajoutez le chemin vers votre app :

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 🔧 **Étape 5 – Vérifier la configuration**

Assurez-vous que :

* Vos ports sont correctement exposés dans `docker-compose.*.yml`
* Votre app est bien référencée dans les services du `docker-compose` (à adapter au besoin)
* Les variables d’environnement `.env` sont présentes si nécessaire

## 🚀 **Étape 6 – Lancer votre app**

Pour démarrer votre application, utilisez les commandes suivantes :

```bash
pnpm run dev                   # Démarre toutes les apps
cd apps/<nom-app> && pnpm dev  # Démarre une app spécifique
```

## 📎 **Exemple complet disponible :**

Consultez :

* `apps/mon_app_exemple`
* `docker/mon_app_exemple`
* `scripts/mon_app_exemple`