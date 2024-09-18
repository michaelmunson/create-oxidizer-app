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
    jsonObj['@parcel/resolver-default'] = {
        "packageExports": true
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
    fs.writeFileSync('src/App.ts', 
`import {createEffect, createProps, DIV, P, BUTTON} from "oxidizer"


const Counter = () => {
    const props = createProps({count: 0}, [
        // keep count greater than or equal to 0
        createEffect(['count'], $ => {
            if ($.count < 0){
                $.count = 0;
            }
        })
    ]);

    return (
        DIV(props, $ => [
            {id: 'counter-app'},
            P('Count: ' + $.count),
            DIV({style: {display: 'flex'}}, 
                BUTTON({onclick: () => $.count -= 1}, "Decrement"),
                BUTTON({onclick: () => $.count += 1}, "Increment")
            )
        ])
    )
}

export default function App(){
    return (
        DIV({id: 'app'},
            Counter()
        )
    )
}
`);
    fs.writeFileSync('src/index.ts', 
`import App from "./App";

const app = App();

document.body.append(app);
`);

}

function createDir(dirName){
    fs.mkdirSync(dirName);
    process.chdir(dirName);
    console.log('\nInstalling Dependencies..\n')
    spawnSync('npm',['init','-y']);
    spawnSync('npm',['install', '--save-dev', 'parcel']);
    spawnSync('npm',['install', 'oxidizer']);
    updatePackageJson(); 
    createSrc();
    fs.writeFileSync('.gitignore','node_modules')
}

(() => {
    console.log('='.repeat(20))
    const [dirName, ...rest] = process.argv.slice(2);
    enforceArgs(dirName, rest);
    console.log('Creating Oxidizer App...');
    createDir(dirName);
    console.log('Oxidizer App Created @', dirName);
    console.log('run `npm start` to start your app')
})();