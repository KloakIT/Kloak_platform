"use strict";
/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DEBUG = false;
const port = 3000;
const path_1 = require("path");
const url_1 = require("url");
const { app, BrowserWindow, Tray, Menu, dialog, autoUpdater, desktopCapturer, shell } = require('electron');
app.allowRendererProcessReuse = true;
app.commandLine.appendArgument("--enable-features=Metal");
// squirrel event handled and app will exit in 1000ms, so don't do anything else
let localServer1 = null;
let tray = null;
let doReady = false;
const _doUpdate = (tag_name, _port) => {
    let url = null;
    if (process.platform === 'darwin') {
        url = `http://localhost:${_port}/update/mac?ver=${tag_name}`;
    }
    else if (process.platform === 'win32') {
        url = `http://localhost:${_port}/latest/${tag_name}/`;
    }
    else {
        console.log(`process.platform === linux`);
        return;
    }
    autoUpdater.on('update-availabe', () => {
        console.log('update available');
    });
    autoUpdater.on('error', err => {
        console.log('systemError autoUpdater.on error ' + err.message);
    });
    autoUpdater.on('checking-for-update', () => {
        console.log(`checking-for-update [${url}]`);
    });
    autoUpdater.on('update-not-available', () => {
        console.log('update-not-available');
    });
    autoUpdater.on('update-downloaded', e => {
        console.log("Install?");
        autoUpdater.quitAndInstall();
    });
    autoUpdater.setFeedURL(url);
    autoUpdater.checkForUpdates();
};
const createWindow = () => {
    /*
    if ( process.platform === 'win32' ) {
        return createLocalBrowser ()
    }
    */
    shell.openExternal(`http://localhost:${port}`);
};
const data11 = [
    {
        tray: [
            {
                label: '打开',
                click: createWindow
            },
            {
                role: 'quit',
                label: '退出',
                accelerator: 'Command+Q'
            }
        ]
    }, {
        tray: [
            {
                label: 'オープン',
                click: createWindow
            },
            {
                role: 'quit',
                label: '退出',
                accelerator: 'Command+Q'
            }
        ]
    }, {
        tray: [
            {
                label: 'open',
                click: createWindow
            },
            {
                role: 'quit',
                accelerator: 'Command+Q'
            }
        ]
    }, {
        tray: [
            {
                label: '打開',
                click: createWindow
            }, {
                role: 'quit',
                label: '退出',
                accelerator: 'Command+Q'
            }
        ]
    }
];
const getLocalLanguage = (lang) => {
    if (/^zh-TW|^zh-HK|^zh-SG/i.test(lang))
        return 3;
    if (/^zh/i.test(lang))
        return 0;
    if (/^ja/i.test(lang))
        return 1;
    return 2;
};
let localLanguage = getLocalLanguage(app.getLocale());
const isMacOS = process.platform === 'darwin';
const appReady = () => {
    //const menu = Menu.buildFromTemplate( template )
    //Menu.setApplicationMenu ( menu)
    if (!localServer1) {
        localServer1 = new BrowserWindow({
            show: DEBUG,
            webPreferences: {
                nodeIntegration: true
            }
        });
        localServer1._doUpdate = _doUpdate;
        DEBUG ? localServer1.webContents.openDevTools() : null;
        //localServer1.maximize ()
        localServer1.loadURL(url_1.format({
            pathname: path_1.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
        setTimeout(() => {
            createWindow();
        }, 1000);
        /*
        setTimeout (() => {
            const checkUpload = new BrowserWindow ({ show: DEBUG })
            checkUpload.rendererSidePort = port
            DEBUG ? checkUpload.webContents.openDevTools() : null
            checkUpload.loadURL ( format ({
                pathname: join ( __dirname, 'app/update.html'),
                protocol: 'file:',
                slashes: true
            }))
        }, 500 )
        */
    }
    else {
        createWindow();
    }
    if (!tray) {
        tray = new Tray(path_1.join(__dirname, '16.png'));
        tray.on('click', () => {
            return createWindow();
        });
        const contextMenu = Menu.buildFromTemplate(data11[localLanguage].tray);
        tray.setContextMenu(contextMenu);
    }
};
const initialize = () => {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        return app.quit();
    }
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        createWindow();
    });
    app.once('ready', () => {
        if (doReady) {
            return;
        }
        doReady = true;
        return appReady();
    });
    app.once('window-all-closed', () => {
        app.quit();
    });
};
initialize();
