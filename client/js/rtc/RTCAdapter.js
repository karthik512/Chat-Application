export class RTCAdapter
{
    constructor()
    {
        this.rtcPeerConnection = RTCPeerConnection;
        this.rtcIceCandidate = RTCIceCandidate;
        this.rtcSessionDescription = RTCSessionDescription;
        this.userMedia = navigator.getUserMedia.bind(navigator);
        this.stunServer = 'stun.l.google.com:19302';
    }

    connectStream(mediaStream, mediaElement)
    {
        mediaElement.srcObject = mediaStream;
        mediaElement.play();
    }

    getName()
    {
        return 'RTCAdapter';
    }
}