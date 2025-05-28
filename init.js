import prompts from 'prompts';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import yaml from 'yaml';

const ROOT = process.cwd();

const appsDir = path.join(ROOT, 'apps');
const dockerTemplate = path.join(ROOT, 'docker/mon_app_exemple');
const scriptsTemplate = path.join(ROOT, 'scripts/mon_app_exemple');

const appChoices = [
    {title: 'Ajouter une application (sous-module Git)', value: 'add-submodule-app'},
    {title: 'Dupliquer depuis une application existante', value: 'duplicate-app'},
    {title: 'Copie manuelle (application déjà ajoutée)', value: 'manual-copy'},
    {title: 'Renommer une application existante', value: 'rename-app'},
    {title: 'Supprimer une application existante', value: 'delete-app'},
    {title: 'Ajouter un package (sous-module Git)', value: 'add-submodule-package'},
];

const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'Que souhaitez-vous faire ?',
    choices: appChoices
});

const {action} = response;

// Gère Ctrl+C proprement
process.on('SIGINT', () => {
    console.log('\n❌ Opération annulée par l’utilisateur.');
    process.exit(0);
});


const askAppName = async (label = 'Nom de l’application') => {
    const {name} = await prompts({
        type: 'text',
        name: 'name',
        message: label,
        validate: n => n.length < 2 ? 'Nom trop court' : true
    });
    return name;
};

const copyTemplateDir = (source, dest) => {
    fs.mkdirSync(dest, {recursive: true});
    fs.readdirSync(source).forEach(file => {
        const src = path.join(source, file);
        const dst = path.join(dest, file);
        fs.copyFileSync(src, dst);
    });
};

const replaceInFiles = (dir, search, replace) => {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sh'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replaceAll(search, replace);
        fs.writeFileSync(filePath, content, 'utf8');
    });
};

const replaceInAllFiles = (dir, search, replace, exts = ['.sh', '.yml', '.Dockerfile', '.conf', '.json', '.ts', '.js']) => {
    const entries = fs.readdirSync(dir, {withFileTypes: true});

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            replaceInAllFiles(fullPath, search, replace, exts);
        } else if (exts.includes(path.extname(entry.name))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const replaced = content.replaceAll(search, replace);
            if (replaced !== content) {
                fs.writeFileSync(fullPath, replaced, 'utf8');
            }
        }
    }
};

const replaceInObject = (obj, search, replace) => {
    if (typeof obj === 'string') {
        return obj.replaceAll(search, replace);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => replaceInObject(item, search, replace));
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = replaceInObject(obj[key], search, replace);
        }
        return newObj;
    }

    return obj;
};

const updateDockerComposeAddService = (composePath, serviceName, baseServiceName) => {
    const raw = fs.readFileSync(composePath, 'utf8');
    const doc = yaml.parseDocument(raw);

    if (!doc.has('services')) doc.set('services', {});
    const base = doc.getIn(['services', baseServiceName]);

    if (!base) {
        console.warn(`⚠️ Base service "${baseServiceName}" introuvable dans ${composePath}`);
        return;
    }

    const baseJs = base.toJSON();
    const customized = replaceInObject(baseJs, baseServiceName, serviceName);
    doc.setIn(['services', serviceName], customized);

    fs.writeFileSync(composePath, doc.toString(), 'utf8');
};

const updateDockerComposeRenameService = (composePath, oldName, newName) => {
    const raw = fs.readFileSync(composePath, 'utf8');
    const doc = yaml.parseDocument(raw);

    const service = doc.getIn(['services', oldName]);
    if (!service) {
        console.warn(`⚠️ Service "${oldName}" introuvable dans ${composePath}`);
        return;
    }

    const oldConfig = service.toJSON();
    const renamedConfig = replaceInObject(oldConfig, oldName, newName);

    doc.setIn(['services', newName], renamedConfig);
    doc.deleteIn(['services', oldName]);

    fs.writeFileSync(composePath, doc.toString(), 'utf8');
};

const updateDockerComposeRemoveService = (composePath, serviceName) => {
    const raw = fs.readFileSync(composePath, 'utf8');
    const doc = yaml.parseDocument(raw);

    if (doc.hasIn(['services', serviceName])) {
        doc.deleteIn(['services', serviceName]);
        fs.writeFileSync(composePath, doc.toString(), 'utf8');
    }
};

try {
    switch (action) {
        case 'add-submodule-app': {
            const name = await askAppName();
            const {url} = await prompts({
                type: 'text',
                name: 'url',
                message: 'URL du sous-module Git :'
            });

            const appPath = `apps/${name}.app`;
            execSync(`git submodule add ${url} ${appPath}`);

            copyTemplateDir(dockerTemplate, `docker/${name}`);
            copyTemplateDir(scriptsTemplate, `scripts/${name}`);

            updateDockerComposeAddService('docker/docker-compose.yml', name, 'mon_app_exemple');
            updateDockerComposeAddService('docker/docker-compose.dev.yml', name, 'mon_app_exemple');

            console.log(`✅ Application "${name}" ajoutée avec sous-module.`);
            break;
        }

        case 'duplicate-app': {
            const apps = fs.readdirSync(appsDir).filter(f => f.endsWith('.app'));
            const {from} = await prompts({
                type: 'select',
                name: 'from',
                message: 'Choisir l’application à dupliquer :',
                choices: apps.map(name => ({title: name, value: name}))
            });

            const newName = await askAppName();
            fs.cpSync(`apps/${from}`, `apps/${newName}.app`, {recursive: true});

            copyTemplateDir(dockerTemplate, `docker/${newName}`);
            copyTemplateDir(scriptsTemplate, `scripts/${newName}`);

            updateDockerComposeAddService('docker/docker-compose.yml', newName, 'mon_app_exemple');
            updateDockerComposeAddService('docker/docker-compose.dev.yml', newName, 'mon_app_exemple');

            replaceInAllFiles(`docker/${newName}`, from.replace('.app', ''), newName);
            replaceInAllFiles(`scripts/${newName}`, from.replace('.app', ''), newName);

            console.log(`✅ Application "${newName}" dupliquée depuis "${from}".`);
            break;
        }

        case 'manual-copy': {
            const name = await askAppName();
            const manualPath = `apps/${name}.app`;

            const {confirm} = await prompts({
                type: 'confirm',
                name: 'confirm',
                message: `Le dossier ${manualPath} existe-t-il déjà ?`,
                initial: true
            });

            if (!confirm || !fs.existsSync(manualPath)) {
                console.error(`⛔️ Dossier "${manualPath}" introuvable.`);
                process.exit(1);
            }

            copyTemplateDir(dockerTemplate, `docker/${name}`);
            copyTemplateDir(scriptsTemplate, `scripts/${name}`);

            console.log(`✅ Configuration Docker et scripts ajoutés à "${name}".`);
            break;
        }

        case 'rename-app': {
            const apps = fs.readdirSync(appsDir).filter(f => f.endsWith('.app') && !fs.existsSync(path.join('apps', f, '.git')));

            const {from} = await prompts({
                type: 'select',
                name: 'from',
                message: 'Choisir l’application à renommer :',
                choices: apps.map(name => ({title: name, value: name}))
            });

            const newName = await askAppName('Nouveau nom de l’application');
            fs.renameSync(`apps/${from}`, `apps/${newName}.app`);
            fs.renameSync(`docker/${from.replace('.app', '')}`, `docker/${newName}`);
            fs.renameSync(`scripts/${from.replace('.app', '')}`, `scripts/${newName}`);

            updateDockerComposeRenameService('docker/docker-compose.yml', from.replace('.app', ''), newName);
            updateDockerComposeRenameService('docker/docker-compose.dev.yml', from.replace('.app', ''), newName);

            replaceInFiles(`docker/${newName}`, from.replace('.app', ''), newName);
            replaceInFiles(`scripts/${newName}`, from.replace('.app', ''), newName);

            replaceInAllFiles(`docker/${newName}`, from.replace('.app', ''), newName);
            replaceInAllFiles(`scripts/${newName}`, from.replace('.app', ''), newName);

            console.log(`✅ Application "${from}" renommée en "${newName}".`);
            break;
        }

        case 'delete-app': {
            const apps = fs.readdirSync(appsDir).filter(f => f.endsWith('.app') && !fs.existsSync(path.join('apps', f, '.git')));

            if (apps.length === 0) {
                console.log('❌ Aucune application locale à supprimer.');
                break;
            }

            const {name} = await prompts({
                type: 'select',
                name: 'name',
                message: 'Sélectionnez l’application à supprimer :',
                choices: apps.map(name => ({title: name, value: name}))
            });

            const appBase = name.replace('.app', '');

            const {confirm} = await prompts({
                type: 'confirm',
                name: 'confirm',
                message: `Confirmez-vous la suppression définitive de "${name}" ?`,
                initial: false
            });

            if (!confirm) {
                console.log('❌ Suppression annulée.');
                break;
            }

            fs.rmSync(`apps/${name}`, {recursive: true, force: true});
            fs.rmSync(`docker/${appBase}`, {recursive: true, force: true});
            fs.rmSync(`scripts/${appBase}`, {recursive: true, force: true});

            updateDockerComposeRemoveService('docker/docker-compose.yml', appBase);
            updateDockerComposeRemoveService('docker/docker-compose.dev.yml', appBase);

            console.log(`✅ Application "${name}" supprimée.`);
            break;
        }


        case 'add-submodule-package': {
            const {name} = await prompts({
                type: 'text',
                name: 'name',
                message: 'Nom du package :'
            });

            const {url} = await prompts({
                type: 'text',
                name: 'url',
                message: 'URL du sous-module Git du package :'
            });

            execSync(`git submodule add ${url} packages/${name}`);
            console.log(`✅ Package "${name}" ajouté comme sous-module.`);
            break;
        }

        default:
            console.log('❌ Action inconnue ou annulée.');
            break;
    }
} catch (err) {
    console.error(`💥 Erreur inattendue : ${err.message}`);
    process.exit(1);
}
