// init.js - Script d'initialisation CLI pour une nouvelle app dans le monorepo

import prompts from 'prompts';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

const TEMPLATE_APP = 'mon_app_exemple';
const createdPaths = [];
let submodulePath = null;

process.on('SIGINT', () => {
    console.log('\n❌ Interruption détectée (Ctrl+C).');
    rollback();
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Erreur inattendue :', err);
    rollback();
    process.exit(1);
});

const rollback = () => {
    console.log('\n🧹 Annulation en cours...');
    if (submodulePath) {
        try {
            console.log(`🔄 Suppression du sous-module Git : ${submodulePath}`);
            execSync(`git submodule deinit -f ${submodulePath}`);
            execSync(`git rm -f ${submodulePath}`);
            fs.rmSync('.git/modules/' + submodulePath, {recursive: true, force: true});
        } catch (err) {
            console.log(`⚠️  Échec lors de la suppression du sous-module : ${err.message}`);
        }
    }
    createdPaths.reverse().forEach(p => {
        if (fs.existsSync(p)) {
            fs.rmSync(p, {recursive: true, force: true});
            console.log(`🗑️  Supprimé : ${p}`);
        }
    });
};

const copyDir = (src, dest) => {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, {recursive: true});
    fs.readdirSync(src).forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stat = fs.statSync(srcPath);

        if (stat.isFile()) {
            const content = fs.readFileSync(srcPath, 'utf8');
            fs.writeFileSync(destPath, content);
            fs.chmodSync(destPath, stat.mode);
        } else if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
        }
    });
};

const replaceInFile = (filePath, from, to) => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, content.replaceAll(from, to));
};

const replaceInAllFiles = (dir, from, to) => {
    if (!fs.existsSync(dir)) return;
    console.log(`🔍 Remplacement de '${from}' dans tous les fichiers de ${dir}`);
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            replaceInFile(filePath, from, to);
        }
    });
};

const addServiceToDockerCompose = (composePath, appName) => {
    if (!fs.existsSync(composePath)) return;
    console.log(`➕ Ajout du service '${appName}' dans ${composePath}`);
    const content = fs.readFileSync(composePath, 'utf8');
    const newService = `  ${appName}:
    build:
      image: $\{IMAGE:-mon_app_exemple\}:latest
      container_name: mon_app_exemple
      build:
        args:
          - IMAGE=$\{IMAGE:-mon_app_exemple\}
        context: ..
        dockerfile: docker/${appName}/build.Dockerfile
    ports:
      - "${appName === 'mon_app_exemple' ? '3333' : 'auto_à_adapter'}:3333"
`;
    if (!content.includes(`  ${appName}:`)) {
        const updated = content.replace(/services:\n/, match => match + newService);
        fs.writeFileSync(composePath, updated);
    }
};

const deleteDirectory = dir => {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {recursive: true, force: true});
        console.log(`🗑️  Supprimé : ${dir}`);
    }
};

const removeServiceFromDockerCompose = (composePath, appName) => {
    if (!fs.existsSync(composePath)) return;
    const content = fs.readFileSync(composePath, 'utf8');
    const lines = content.split('\n');

    const startIndex = lines.findIndex(line => line.match(new RegExp(`^\\s*${appName}:\\s*$`)));
    if (startIndex === -1) return;

    // Suppression du bloc de service (jusqu'à la prochaine ligne de même niveau ou fin du fichier)
    const indentLevel = lines[startIndex].match(/^(\s*)/)[1].length;
    let endIndex = startIndex + 1;

    while (
        endIndex < lines.length &&
        (lines[endIndex].startsWith(' '.repeat(indentLevel + 1)) || lines[endIndex].trim() === '')
        ) {
        endIndex++;
    }

    lines.splice(startIndex, endIndex - startIndex);
    fs.writeFileSync(composePath, lines.join('\n'));
    console.log(`➖ Service '${appName}' supprimé de ${composePath}`);
};

const validatePackageJson = (appPath, appName) => {
    const pkgPath = path.join(appPath, 'package.json');
    if (!fs.existsSync(appPath) || !fs.existsSync(pkgPath)) {
        console.log('❌ Application non trouvée ou package.json manquant.');
        process.exit(1);
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.name !== appName) {
        console.log(`⚠️  Le nom de package (${pkg.name}) ne correspond pas à ${appName}. Mise à jour...`);
        pkg.name = appName;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Nom du package mis à jour.');
    }
};

(async () => {
    console.log('🛠️  Initialisation d’une nouvelle application dans le monorepo');

    const appsList = fs.readdirSync('apps')
        .filter(entry => fs.statSync(`apps/${entry}`).isDirectory());

    const {method} = await prompts({
        type: 'select',
        name: 'method',
        message: 'Méthode à effectuer :',
        choices: [
            {title: 'Ajouter une application comme sous-module à partir d’un dépôt', value: 'submodule'},
            {title: 'Copier manuellement une application dans ./apps', value: 'manual'},
            {title: 'Dupliquer une application existante depuis ./apps', value: 'duplicate'},
            {title: 'Supprimer une application existante', value: 'delete'}
        ]
    });

    let appName;
    let appPath;

    if (method === 'delete') {

        if (appsList.length === 0) {
            console.log('❌ Aucune application trouvée dans ./apps.');
            process.exit(1);
        }

        const {selectedApp} = await prompts({
            type: 'select',
            name: 'selectedApp',
            message: 'Sélectionnez l’application à supprimer :',
            choices: appsList.map(app => ({title: app, value: app}))
        });

        appName = selectedApp;
        appPath = `apps/${appName}`;

        const {confirm} = await prompts({
            type: 'confirm',
            name: 'confirm',
            message: `Êtes-vous sûr de vouloir supprimer l'application "${appName}" (ainsi que ses dossiers docker/ et scripts/) ?`,
            initial: false
        });

        if (confirm) {
            removeServiceFromDockerCompose('docker/docker-compose.yml', appName);
            removeServiceFromDockerCompose('docker/docker-compose.dev.yml', appName);
            deleteDirectory(appPath);
            deleteDirectory(`docker/${appName}`);
            deleteDirectory(`scripts/${appName}`);
        } else {
            console.log('❌ Suppression annulée.');
        }
        return;
    }

    const {name} = await prompts({
        type: 'text',
        name: 'name',
        message: 'Nom de la nouvelle application :',
        validate: name => /^[a-z0-9_-]+$/.test(name) ? true : 'Nom invalide (a-z, 0-9, _ et - uniquement)'
    });

    appName = name
    appPath = `apps/${appName}`;

    if (!appName) {
        console.log('❌ Aucune application n’a été créée.');
        process.exit(1);
    }

    if (method === 'submodule') {
        const {repo} = await prompts({
            type: 'text',
            name: 'repo',
            message: 'URL du dépôt Git à utiliser comme sous-module :'
        });

        if (!repo) {
            console.log('❌ Aucune URL fournie.');
            process.exit(1);
        }

        console.log(`🔗 Ajout du sous-module ${repo} dans ${appPath}`);
        execSync(`git submodule add ${repo} ${appPath}`, {stdio: 'inherit'});
        validatePackageJson(appPath, appName);
        return;
    }

    if (method === 'duplicate') {

        if (appsList.length === 0) {
            console.log('❌ Aucune application trouvée dans ./apps.');
            process.exit(1);
        }

        const {selectedApp} = await prompts({
            type: 'select',
            name: 'selectedApp',
            message: 'Sélectionnez l’application à duppliquer :',
            choices: appsList.map(app => ({title: app, value: app}))
        });

        const appSrc = `apps/${selectedApp}`;
        copyDir(appSrc, appPath);
        validatePackageJson(appPath, appName);
    } else if (method === 'manual') {
        console.log(`📂 Veuillez copier manuellement votre application dans ${appPath}`);

        const {confirmManual} = await prompts({
            type: 'confirm',
            name: 'confirmManual',
            message: `Avez-vous bien copié votre application dans ${appPath} ?`,
            initial: true
        });

        if (!confirmManual) {
            console.log('❌ Copie manuelle non confirmée.');
            process.exit(1);
        }

        validatePackageJson(appPath, appName);
    }

    console.log(`🚀 Création de l'application : ${appName}\n`);

    const dockerSrc = `docker/${TEMPLATE_APP}`;
    const dockerDest = `docker/${appName}`;
    copyDir(dockerSrc, dockerDest);
    createdPaths.push(dockerDest);

    const scriptsSrc = `scripts/${TEMPLATE_APP}`;
    const scriptsDest = `scripts/${appName}`;
    copyDir(scriptsSrc, scriptsDest);
    createdPaths.push(scriptsDest);

    replaceInFile(`${dockerDest}/build.Dockerfile`, TEMPLATE_APP, appName);
    replaceInAllFiles(scriptsDest, TEMPLATE_APP, appName);

    addServiceToDockerCompose('docker/docker-compose.yml', appName);
    addServiceToDockerCompose('docker/docker-compose.dev.yml', appName);

    console.log(`\n✅ Application "${appName}" initialisée avec succès.`);

    console.log(`\n╭────────────────────────────────────────────╮`);
    console.log(`│ 📦 Prochaine étape                          │`);
    console.log(`├────────────────────────────────────────────┤`);
    console.log(`│ › pnpm install                             │`);
    console.log(`│ › pnpm --filter=${appName} run dev       │`);
    console.log(`│ › Documentation interne : ./README.md     │`);
    console.log(`╰────────────────────────────────────────────╯`);
})();
