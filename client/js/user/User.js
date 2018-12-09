import { Logger } from "/client/js/common/log.js";
import { CommonUtil } from '/client/js/common/CommonUtil.js';

const logger = new Logger();

export class User
{
    constructor(connectionToken, rtcAdapter, signalingServer)
    {
        this.connectionToken = connectionToken;
        this.rtcAdapter = rtcAdapter;
        this.signalingServer = signalingServer;
        
        this.isLocalStreamAdded = false;

        this.peerConnection = new this.rtcAdapter.rtcPeerConnection({
            "iceServers" : [
                { "url":"stun:" + this.rtcAdapter.stunServer }
            ]
        });
        this.peerConnection.onicecandidate = this.onIceCandidate.bind(this);
        // this.peerConnection.onremovestream = onRemoveStream;
        // this.peerConnection.oniceconnectionstatechange = onIceConnectionStateChange;
        // this.peerConnection.onicegatheringstatechange = onIceGatheringStateChange;
        // this.peerConnection.onsignalingstatechange = onSignalingStateChange;
        // this.peerConnection.onnegotiationneeded = onNegotiationNeeded;
        // if(this.peerConnection.addTrack !== undefined) {
        //     this.peerConnection.ontrack = onTrack;
        // } else {
            this.peerConnection.onaddstream = this.onAddStream.bind(this);
        // }
    }

    addChatMessage(userName, message) {
        let messages = CommonUtil.docid('messages');
        messages.innerHTML = userName + ': ' + message + '<br>\n' + messages.innerHTML;
    }

    onMessageReceived(event) {
        logger.info(' onMessageReceived Called...');
        let message = event.data;
        this.addChatMessage('User', message);
    }

    send(messageObj) {
        logger.info(` Messsage :: ${JSON.stringify(messageObj)}`);
        this.signalingServer.send(JSON.stringify(messageObj));
    }

    onIceCandidate(event) {
        if(event.candidate) {
            this.send({
                token : this.connectionToken,
                type : 'newIceCandidate',
                candidate : event.candidate
            });
        }
    }

    onDescriptionCreated(description) {
        this.peerConnection.setLocalDescription(
            description, () => {
                this.send({
                    token : this.connectionToken,
                    type : 'newDescription',
                    sdp : description
                });
            }, logger.error
        );
    }

    initiateChat(options, elementID) {
        this.chatOptions = options;
        this.rtcAdapter.userMedia(options, (localStream) => {
            logger.info('New Local Stream added');
            if(elementID) {
                this.rtcAdapter.connectStream(localStream, CommonUtil.docid(elementID));
                CommonUtil.docid(elementID).muted = true;
            }

            this.peerConnection.addStream(localStream);

            this.isLocalStreamAdded = true;
        }, logger.error);
    }

    onAddStream(event) {
        logger.info(' New Remote stream added');
        let remoteID = 'remote_audio';
        if(this.chatOptions.video == true) {
            remoteID = 'remote_video';
        }
        this.rtcAdapter.connectStream(event.stream, CommonUtil.docid(remoteID));
    }

    getName() {
        return 'User';
    }

    // get connectionToken() {
    //     return this._connectionToken;
    // }

    // set connectionToken(connectionToken) {
    //     this._connectionToken = connectionToken;
    // }
}