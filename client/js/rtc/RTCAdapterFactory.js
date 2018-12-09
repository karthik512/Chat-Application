import {RTCAdapter} from './RTCAdapter.js';
import {MozRTCAdapter} from './impl/MozRTCAdapter.js';
import {WebkitRTCAdapter} from './impl/WebkitRTCAdapter.js';

export function getRTCAdapter()
{
    if(navigator.getUserMedia) {
        return new RTCAdapter();
    } else if(navigator.mozGetUserMedia) {
        return new MozRTCAdapter();
    } else if(navigator.webkitGetUserMedia) {
        return new WebkitRTCAdapter();
    }
    throw new Error('WebRTC not supported by Browser');
}