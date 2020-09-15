const path = require('path');
const { readdir } = require('fs').promises;

async function tree(startPath) {
    startPath = startPath || process.env.npm_config_path || require('minimist')(process.argv.slice(2))['path'];
    if (!startPath) {
        console.log("Wrong input arguments: you should specify folder with --path");
        return;
    }
    console.log(`Start scanning folder: ${startPath}`);
    return await scanPath(startPath);
}

async function scanPath(startPath, results = {dirs: [], files: [], errors: []}) {
    const items = await readdir(startPath, { withFileTypes: true }).catch(err => results.errors.push(err));
    if (items.length) {
        await Promise.all(items.map((item) => {
            const itemPath = path.join(startPath, item.name);
            if (item.isDirectory()) {
                results.dirs.push(itemPath);
                return scanPath(itemPath, results);
            } else {
                return results.files.push(itemPath);
            }
        }));
    }
    return results;
}

tree().then(data => console.log(data));