import {User} from './User.js';
import {Caller} from './impl/Caller.js';
import {Callee} from './impl/Callee.js';
import {Logger} from '/client/js/common/log.js';
import {CommonUtil} from '/client/js/common/CommonUtil.js';

const logger = new Logger();

export function getUser(rtcAdapter, signalingServer)
{
    if(document.location.hash === '' || document.location.hash === undefined) {
        logger.info(' =================== Caller ==================== ');
        let connectionToken = CommonUtil.getUniqueToken();
        document.location.hash = connectionToken;
        return new Caller(connectionToken, rtcAdapter, signalingServer);
    } else {
        logger.info(' =================== Callee ==================== ');
        let connectionToken = document.location.hash;
        return new Callee(connectionToken, rtcAdapter, signalingServer);
    }
}