const fs = require('node:fs');
const path = require('node:path');
const { version } = require('../package.json');

console.log(`Start create sw.js`);

const sourcePath = path.resolve(__dirname, '../src/sw.js');
const buildPath = path.resolve(__dirname, '../build');

const swTpl = fs.readFileSync(sourcePath).toString();
// 

const all = [];
walkSync(buildPath, (file) => {
    all.push(`./${path.relative(buildPath, file).split(path.sep).join('/')}`);
});

const content = swTpl
    .replace(`'$ASSETS_ARR$'`, JSON.stringify(all))
    .replace(`$VERSION$`, version);
// console.log(swTpl, all);
fs.writeFileSync(path.resolve(buildPath, 'sw.js'), content);

console.log(`Create sw.js success!`);


function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function(dirent) {
        const filePath = path.resolve(currentDirPath, dirent.name);
        if (dirent.isFile()) {
            callback(filePath, dirent);
        } else if (dirent.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
