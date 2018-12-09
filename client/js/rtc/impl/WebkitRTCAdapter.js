import {RTCAdapter} from '/client/js/rtc/RTCAdapter.js'

export class WebkitRTCAdapter extends RTCAdapter
{
    constructor()
    {
        super();
        this.rtcPeerConnection = webkitRTCPeerConnection;
        this.userMedia = navigator.webkitGetUserMedia.bind(navigator);
    }

    connectStream(mediaStream, mediaElement)
    {
        mediaElement.src = Object.createObjectURL(mediaStream)
        mediaElement.play();
    }

    getName()
    {
        return 'WebkitRTCAdapter';
    }
}