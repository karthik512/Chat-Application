import {RTCAdapter} from '/client/js/rtc/RTCAdapter.js'

export class MozRTCAdapter extends RTCAdapter
{
    constructor()
    {
        super();
        this.rtcPeerConnection = mozRTCPeerConnection;
        this.rtcIceCandidate = mozRTCIceCandidate;
        this.rtcSessionDescription = mozRTCSessionDescription;
        this.userMedia = navigator.mozGetUserMedia.bind(navigator);
        this.stunServer = '23.21.150.121';
    }

    connectStream(mediaStream, mediaElement)
    {
        mediaElement.mozSrcObject = mediaStream;
        mediaElement.play();
    }

    getName()
    {
        return 'MozRTCAdapter';
    }
}