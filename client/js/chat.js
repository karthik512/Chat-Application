import {getRTCAdapter} from './rtc/RTCAdapterFactory.js';
import {Logger} from '/client/js/common/log.js';
import {getUser} from './user/UserFactory.js';
import { CommonUtil } from '/client/js/common/CommonUtil.js';

const logger = new Logger();

try {
    let rtcAdapter = getRTCAdapter();
    logger.info(rtcAdapter.getName());

    let signalingServer = new WebSocket(`ws://${window.location.hostname}:9000`);

    let user = getUser(rtcAdapter, signalingServer);
    logger.info(user.getName());

    let options = {video: true, audio: true};
    logger.info(` Chat Type :: ${chatType}`);
    if(chatType == 1) {
        user.initiateChat(options, 'local_video');
    } else if(chatType == 2) {
        options.video = false;
        user.initiateChat(options,'');
    }

    CommonUtil.docid('message_input').onkeydown = (event) => {
        if(event.keyCode == 13) {
            let messageElement = CommonUtil.docid('message_input');
            let message = messageElement.value;
            user.sendMessage(message);
            messageElement.value = '';
            messageElement.focus();
        }
    }
} catch(e) {
    logger.error(e);
}