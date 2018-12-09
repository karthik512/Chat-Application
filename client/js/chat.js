import {getRTCAdapter} from './rtc/RTCAdapterFactory.js';
import {Logger} from '/client/js/common/log.js';
import {CommonUtil} from '/client/js/common/CommonUtil.js';
import {getUser} from './user/UserFactory.js';

const logger = new Logger();

try {
    let rtcAdapter = getRTCAdapter();
    logger.info(rtcAdapter.getName());

    let signalingServer = new WebSocket("ws://" + window.location.hostname + ":9000");
    logger.info(signalingServer.url);
    
    let user = getUser(rtcAdapter, signalingServer);
    logger.info(user.getName());

    let options = {video: true, audio: true};
    user.initiateChat(options, 'local_video');
} catch(e) {
    logger.error(e);
}