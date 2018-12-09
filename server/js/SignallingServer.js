const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const mime = require('mime');
const websocket = require('websocket').server;

const logger = require(process.cwd() + '/server/js/common/log');

var app = express();
let port = 9000;
let rtcClients = [];
var rtcDiscussions = {};

const VIDEO = 1;
const AUDIO = 2;

hbs.registerPartials(process.cwd() + '/client/views/partials');
app.set('view-engine', 'hbs');

var httpServer = app.listen(port, () => {
    logger.info(`Server started successfully at port ${port}`);
});

hbs.registerHelper('equals', (a, b) => {
    logger.info(` Equals helper - a :: ${a} - b : ${b}`);
    if(a == b) {
        return true;
    }
    return false;
});

app.get('/', (req, res) => {
    return res.redirect('/video');
});

app.get('/video', (req, res) => {
    res.render(process.cwd() + '/client/views/main.hbs', {type: VIDEO});
});

app.get('/audio', (req, res) => {
    res.render(process.cwd() + '/client/views/main.hbs', {type: AUDIO});
})

app.get('*.(js|css)', (req, res) => {
    let pathName = req.path;
    logger.info('PathName :: ' + pathName);
    let script = fs.readFileSync(process.cwd() + '/' + pathName, 'utf-8');
    res.setHeader("Content-Type", mime.getType(process.cwd() + '/' + pathName));
    res.send(script);
});

let webSocketServer = new websocket({ httpServer });

webSocketServer.on('request', (request) => {
    logger.info(` New Request :: ${request.origin}`);

    var connection = request.accept(null, request.origin);
    logger.info(` New Connection :: ${connection.remoteAddress}`);
    rtcClients.push(connection);
    connection.id = rtcClients.length - 1;

    connection.on('message', (message) => {
        if(message.type === 'utf8') {
            logger.info(` Message Received :: ${message.utf8Data}`);

            let signal = undefined;
            try {
                signal = JSON.parse(message.utf8Data);
            } catch(e) { logger.error(` Excep while parsing message :: ${e}`); }
            
            if(signal && signal.token != undefined) {
                try {
                    if(signal.type == 'join') {
                        if(rtcDiscussions[signal.token] === undefined) {
                            rtcDiscussions[signal.token] = {};
                        }
                        rtcDiscussions[signal.token][connection.id] = true;
                    } else {
                        logger.info(' Going to Iterate peers...');
                        Object.keys(rtcDiscussions[signal.token]).forEach((connectionID) => {
                            if(connectionID != connection.id) {
                                rtcClients[connectionID].send(message.utf8Data, logger.error);
                            }
                        });
                    }
                } catch(e) { logger.error(` Exception :: ${e}`); }
            } else { logger.info(' Omitting signal '); }
        }
    });

    connection.on('close', (code, description) => {
        logger.info(` Connection closed Remote Address :: ${this.remoteAddress} - Code :: ${code} - Description :: ${description}`);
        Object.keys(rtcDiscussions).forEach((token) => {
            Object.keys(rtcDiscussions[token]).forEach((connectionID) => {
                if(connectionID === connection.id) {
                    delete rtcDiscussions[token][id];
                }
            });
        });
    });
});