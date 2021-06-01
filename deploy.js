/**
 * Change constants.ts and .env files according to environtment
 * 
 * to configure deploy script you should change env and isSSL constants
 * const env : 'stage' || 'dev' || 'prod' || 'local'
 * const isSSL : true || false ;
 * 
 * Make it automatically by running script below:
 * $ IS_SSL=false CLIENT_ENV=dev node deploy.js
 * 
 */

const fs = require('fs');

const env = process.env.CLIENT_ENV || 'local';
const isSSL = process.env.IS_SSL === ('true' || true) ? true : false;

let http = 'http'
let ws = 'ws'
if (isSSL) {
    http = 'https'
    ws = 'wss'
}
let address = 'REACT_APP_SERVER_ADDRESS=127.0.0.1:3000';
const clients = [
    {
        client: 'admin',
        otherVariables: '\nPUBLIC_URL=/admin\n'
    },
    {
        client: 'client',
        otherVariables: ''
    },
    {
        client: 'dealer',
        otherVariables: '\nPUBLIC_URL=/dealer\nSKIP_PREFLIGHT_CHECK=true'
    },
]

switch (env) {
    case 'local':
        address = 'REACT_APP_SERVER_ADDRESS=127.0.0.1:3000';
        break
    case 'stage':
        address = 'REACT_APP_SERVER_ADDRESS=app.fusion-tech.pro';
        break
    case 'dev':
        address = 'REACT_APP_SERVER_ADDRESS=dev-app.fusion-tech.pro';
        break
    case 'prod':
        address = 'REACT_APP_SERVER_ADDRESS=app.com';
        break
    default:
}

const readAllFiles = (clients) => {
    for (let client of clients) {
            const newEnv = ('').concat(address, client.otherVariables);
            fs.writeFileSync(`./${client.client}-app/.env`, newEnv);

            const constants = fs.readFileSync(`./${client.client}-app/src/utils/api/constants.ts`, 'utf-8');
            if (!constants) {
                console.log(`Constants for '${client.client} wasn't found`);
                break;
            } 

            let newConstants = constants.split(/https?:\/\//).join(`${http}://`);
            newConstants = newConstants.split(/wss?:\/\//).join(`${ws}://`);

            fs.writeFileSync(`${client.client}-app/src/utils/api/constants.ts`, newConstants);
    }
}

readAllFiles(clients)
