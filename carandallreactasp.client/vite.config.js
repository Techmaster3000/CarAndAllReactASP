import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "carandallreactasp.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

let target;
if (env.ASPNETCORE_HTTPS_PORT) {
    target = `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`;
} else if (env.ASPNETCORE_URLS) {
    target = env.ASPNETCORE_URLS.split(';')[0];
} else {
    target = 'https://localhost:7048';
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        exclude: ['react-datepicker']
    },
    server: {
        proxy: {
            '^/api/Users': {
                target: target,
                secure: false
            },
            '^/login': {
                target: target,
                secure: false
            },
            '^/confirmEmail': {
                target: target,
                secure: false
            },
            '^/api/createbusinessuser': {
                target: target,
                secure: false
            },
            '^/api/business-subscription' : {
                target: target,
                secure: false
            },
            '^/api/ParticuliereVerhuur': {
                target: target,
                secure: false
            },
            '^/api/Vehicles': {
                target: target,
                secure: false
            },
            '^/api/Schades': {
                target: target,
                secure: false
            }

        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
