#!/usr/bin/env node

const fs = require('fs');
const {spawnSync} = require('child_process'); 

function enforceArgs(dirName, rest){
    if (typeof dirName !== "string"){
        process.stdout.write('Error: Invalid Directory Name\n');
        process.exit(); 
    }
}

function updatePackageJson(){
    const json = fs.readFileSync('package.json');
    const jsonObj = JSON.parse(json);
    jsonObj.source = "src/index.html";
    jsonObj.scripts = {
        "start": "parcel",
        "build": "parcel build"
    }
    fs.writeFileSync('package.json', JSON.stringify(jsonObj)); 
}

function createSrc(){
    fs.mkdirSync('src');
    fs.writeFileSync('src/index.html',
`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>My Oxidizer App</title>
      </head>
      <body>
      </body>
      <script src="index.ts" type="module"></script>
</html>`);
    fs.writeFileSync('src/app.ts', 
`import {DIV} from "oxidizer";

export const App = () => {
    return (
        DIV({id:'app'}, [
            'Hello World!'
        ])
    )
}
`);
    fs.writeFileSync('src/index.ts', 
`import {App} from "./app";

const app = App();

document.body.append(app);
`);

}

function createDir(dirName){
    fs.mkdirSync(dirName);
    process.chdir(dirName);
    spawnSync('npm',['init','-y']);
    spawnSync('npm',['install', '--save-dev', 'parcel']);
    spawnSync('npm',['install', 'oxidizer']);
    updatePackageJson(); 
    createSrc();
    fs.writeFileSync('.gitignore','node_modules')
}

(() => {
    const [dirName, ...rest] = process.argv.slice(2);
    enforceArgs(dirName, rest);
    console.log('Creating Oxidizer App...');
    createDir(dirName);
    console.log('Oxidizer App Created @', dirName);
})();