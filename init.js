// init.js – Script CLI pour gérer les applications d’un monorepo AdonisJS conforme aux conventions SAE RER

import prompts from 'prompts'
import fs from 'fs'
import path from 'path'
import {execSync} from 'child_process'

const TEMPLATE = 'mon_app_exemple.app'
const createdPaths = []
let submodulePath = null

// === Sécurité : rollback en cas d’interruption ===
process.on('SIGINT', () => {
    console.log('\n❌ Interruption détectée (Ctrl+C)')
    rollback()
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('❌ Erreur inattendue :', err)
    rollback()
    process.exit(1)
})

function rollback() {
    console.log('\n🧹 Annulation des opérations...')
    if (submodulePath) {
        try {
            execSync(`git submodule deinit -f ${submodulePath}`)
            execSync(`git rm -f ${submodulePath}`)
            fs.rmSync(`.git/modules/${submodulePath}`, {recursive: true, force: true})
        } catch (e) {
            console.log(`⚠️ Échec rollback sous-module : ${e.message}`)
        }
    }
    createdPaths.reverse().forEach((dir) => {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, {recursive: true, force: true})
            console.log(`🗑️ Supprimé : ${dir}`)
        }
    })
}

// === Fonctions utilitaires ===
function isValidAppName(name) {
    return /^[a-z0-9_]+\.app$/.test(name)
}

function stripAppSuffix(name) {
    return name.replace(/\.app$/, '')
}

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return
    fs.mkdirSync(dest, {recursive: true})
    fs.readdirSync(src).forEach((file) => {
        const srcPath = path.join(src, file)
        const destPath = path.join(dest, file)
        const stat = fs.statSync(srcPath)
        if (stat.isDirectory()) {
            copyDir(srcPath, destPath)
        } else {
            fs.copyFileSync(srcPath, destPath)
            fs.chmodSync(destPath, stat.mode)
        }
    })
}


function replaceInFile(filePath, from, to) {
    if (!fs.existsSync(filePath)) return
    const content = fs.readFileSync(filePath, 'utf-8')
    fs.writeFileSync(filePath, content.replaceAll(from, to))
}

function replaceInAllFiles(dir, from, to) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            replaceInFile(filePath, from, to);
        } else if (stat.isDirectory()) {
            replaceInAllFiles(filePath, from, to); // 🔁 récursif
        }
    });
}

function replaceInDir(dir, from, to) {
    if (!fs.existsSync(dir)) return
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isFile()) {
            replaceInFile(filePath, from, to)
        }
    })
}

function addToDockerCompose(filePath, serviceName) {
    if (!fs.existsSync(filePath)) return
    const content = fs.readFileSync(filePath, 'utf-8')
    if (content.includes(`  ${serviceName}:`)) return

    const newService = `  ${serviceName}:
    image: ${serviceName}:latest
    container_name: ${serviceName}
    build:
      context: ..
      dockerfile: docker/${serviceName}/build.Dockerfile
    ports:
      - "auto_configurer:3333"
`

    const updated = content.replace(/services:\n/, (match) => match + newService)
    fs.writeFileSync(filePath, updated)
}

const renameServiceInDockerCompose = (composePath, oldAppName, newAppName) => {
    if (!fs.existsSync(composePath)) return;

    const oldService = oldAppName.replace(/\.app$/, '');
    const newService = newAppName.replace(/\.app$/, '');

    let content = fs.readFileSync(composePath, 'utf8');

    content = content
        .replaceAll(`${oldService}:`, `${newService}:`)
        .replaceAll(`image: ${oldService}:`, `image: ${newService}:`)
        .replaceAll(`container_name: ${oldService}`, `container_name: ${newService}`)
        .replaceAll(`docker/${oldService}/`, `docker/${newService}/`);

    fs.writeFileSync(composePath, content, 'utf8');
    console.log(`✏️  Service renommé dans ${composePath} (${oldService} → ${newService})`);
};

function removeFromDockerCompose(filePath, serviceName) {
    if (!fs.existsSync(filePath)) return
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
    const index = lines.findIndex((line) => line.trim() === `${serviceName}:`)
    if (index === -1) return

    let end = index + 1
    const indent = lines[index].search(/\S/)
    while (end < lines.length && (lines[end].startsWith(' '.repeat(indent + 1)) || lines[end].trim() === '')) {
        end++
    }

    lines.splice(index, end - index)
    fs.writeFileSync(filePath, lines.join('\n'))
}

function validatePackageJson(appPath, appName) {
    const pkgPath = path.join(appPath, 'package.json')
    if (!fs.existsSync(pkgPath)) return
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const expected = appName
    if (pkg.name !== expected) {
        pkg.name = expected
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
        console.log(`✅ package.json corrigé avec name: "${expected}"`)
    }
}

function deleteIfExists(pathToDelete) {
    if (fs.existsSync(pathToDelete)) {
        fs.rmSync(pathToDelete, {recursive: true, force: true})
        console.log(`🗑️ Supprimé : ${pathToDelete}`)
    }
}

// === Script principal ===
;(async () => {
    console.log('🛠️  Initialisation d’une application dans le monorepo SAE RER')

    const appsList = fs.readdirSync('apps').filter((dir) => fs.statSync(`apps/${dir}`).isDirectory())

    const {method} = await prompts({
        type: 'select',
        name: 'method',
        message: 'Quelle action souhaitez-vous effectuer ?',
        choices: [
            {title: 'Ajouter une application (sous-module Git)', value: 'submodule'},
            {title: 'Dupliquer une application existante', value: 'duplicate'},
            {title: 'Copier manuellement une application', value: 'manual'},
            {title: 'Renommer une application', value: 'rename'},
            {title: 'Supprimer une application', value: 'delete'}
        ]
    })

    let appName = ''
    let appPath = ''

    if (method === 'delete') {
        if (appsList.length === 0) {
            console.log('❌ Aucune application trouvée.')
            return
        }

        const {selectedApp} = await prompts({
            type: 'select',
            name: 'selectedApp',
            message: 'Sélectionnez l’application à supprimer',
            choices: appsList.map((app) => ({title: app, value: app}))
        })

        appName = selectedApp
        const serviceName = stripAppSuffix(appName)

        const {confirm} = await prompts({
            type: 'confirm',
            name: 'confirm',
            message: `Confirmer la suppression de "${appName}" (apps/, docker/, scripts/, docker-compose) ?`,
            initial: false
        })

        if (!confirm) return

        removeFromDockerCompose('docker/docker-compose.yml', serviceName)
        removeFromDockerCompose('docker/docker-compose.dev.yml', serviceName)
        deleteIfExists(`apps/${appName}`)
        deleteIfExists(`scripts/${serviceName}`)
        deleteIfExists(`docker/${serviceName}`)
        return
    }

    if (method === 'rename') {
        if (appsList.length === 0) {
            console.log('❌ Aucune application trouvée dans ./apps.');
            process.exit(1);
        }

        const {selectedApp} = await prompts({
            type: 'select',
            name: 'selectedApp',
            message: 'Sélectionnez l’application à renommer :',
            choices: appsList.map(app => ({title: app, value: app}))
        });


        const oldName = selectedApp.replace(/\.app$/, '');
        const oldAppPath = `apps/${oldName}.app`;
        const oldDockerPath = `docker/${oldName}`;
        const oldScriptsPath = `scripts/${oldName}`;

        console.log(`🔄 Renommage de l'application "${oldName}"...`);
        console.log(`Chemins actuels :\n- Application : ${oldAppPath}\n- Docker : ${oldDockerPath}\n- Scripts : ${oldScriptsPath}`);


        const {newRawName} = await prompts({
            type: 'text',
            name: 'newRawName',
            message: 'Nouveau nom de l’application (ex: login ou login.app)',
            validate: (val) =>
                /^[a-z0-9_]+(\.app)?$/.test(val) ? true : 'Nom invalide (caractères autorisés : a-z, 0-9, _)'
        });

        const newName = newRawName.replace(/\.app$/, '');

        if (appsList.includes(newName)) {
            console.log(`❌ Une application nommée "${newName}" existe déjà.`);
            process.exit(1);
        }

        const newAppPath = `apps/${newName.endsWith('.app') ? newName : `${newName}.app`}`;
        const newDockerPath = `docker/${newName}`;
        const newScriptsPath = `scripts/${newName}`;

        fs.renameSync(oldAppPath, newAppPath);
        if (fs.existsSync(oldDockerPath)) fs.renameSync(oldDockerPath, newDockerPath);
        if (fs.existsSync(oldScriptsPath)) fs.renameSync(oldScriptsPath, newScriptsPath);

        replaceInAllFiles(newDockerPath, oldName, newName);
        replaceInAllFiles(newScriptsPath, oldName, newName);

        renameServiceInDockerCompose('docker/docker-compose.yml', oldName, newName);
        renameServiceInDockerCompose('docker/docker-compose.dev.yml', oldName, newName);

        console.log(`✅ Application renommée de "${oldName}" vers "${newName}"`);
        return;
    }

    const {name: rawName} = await prompts({
        type: 'text',
        name: 'name',
        message: 'Nom de l’application (ex: guda ou guda.app)',
        validate: (val) =>
            /^[a-z0-9_]+(\.app)?$/.test(val) ? true : 'Nom invalide (caractères autorisés : a-z, 0-9, _)'
    })

    appName = rawName.endsWith('.app') ? rawName : `${rawName}.app`

    appPath = `apps/${appName}`
    const serviceName = stripAppSuffix(appName)

    if (method === 'submodule') {
        const {repo} = await prompts({
            type: 'text',
            name: 'repo',
            message: 'URL du dépôt Git distant'
        })

        submodulePath = appPath
        execSync(`git submodule add ${repo} ${appPath}`, {stdio: 'inherit'})
        validatePackageJson(appPath, appName)
        return
    }

    if (method === 'duplicate') {
        if (appsList.length === 0) return
        const {selectedApp} = await prompts({
            type: 'select',
            name: 'selectedApp',
            message: 'App source à dupliquer',
            choices: appsList.map((app) => ({title: app, value: app}))
        })

        copyDir(`apps/${selectedApp}`, appPath)
        createdPaths.push(appPath)
        validatePackageJson(appPath, appName)
    }

    if (method === 'manual') {
        console.log(`📂 Copiez manuellement votre application dans : ${appPath}`)

        const {confirm} = await prompts({
            type: 'confirm',
            name: 'confirm',
            message: 'Validez après avoir copié et renommé correctement la structure ?',
            initial: true
        })

        if (!confirm) return
        validatePackageJson(appPath, appName)
    }

    console.log(`🚀 Génération des dossiers Docker & scripts pour : ${appName}`)

    const dockerPath = `docker/${serviceName}`
    const scriptsPath = `scripts/${serviceName}`

    copyDir(`docker/${stripAppSuffix(TEMPLATE)}`, dockerPath)
    createdPaths.push(dockerPath)

    copyDir(`scripts/${stripAppSuffix(TEMPLATE)}`, scriptsPath)
    createdPaths.push(scriptsPath)

    replaceInFile(`${dockerPath}/build.Dockerfile`, stripAppSuffix(TEMPLATE), serviceName)
    replaceInDir(scriptsPath, stripAppSuffix(TEMPLATE), serviceName)

    addToDockerCompose('docker/docker-compose.yml', serviceName)
    addToDockerCompose('docker/docker-compose.dev.yml', serviceName)

    console.log(`\n✅ Application "${appName}" initialisée avec succès.`)
    console.log(`\n🧭 Étapes suivantes :`)
    console.log(`pnpm install`)
    console.log(`pnpm --filter=${appName} run dev`)
})()
