import {User} from '/client/js/user/User.js';
import { Logger } from '/client/js/common/log.js';

const logger = new Logger();

export class Callee extends User
{
    constructor(connectionToken, rtcAdapter, signalingServer)
    {
        super(connectionToken, rtcAdapter, signalingServer);

        this.signalingServer.onopen = this.onSignalingOpen.bind(this);
        this.signalingServer.onmessage = this.onCalleMessage.bind(this);
    }

    onSignalingOpen() {
        this.send({
            token : this.connectionToken,
            type : 'join'
        });

        this.send({
            token : this.connectionToken,
            type : 'calleeArrived'
        });
    }

    onCalleMessage(event) {
        var signal = JSON.parse(event.data);
        logger.info(` Message Received - Type :: ${signal.type}`);

        switch(signal.type)
        {
            case 'newIceCandidate':
            {
                this.peerConnection.addIceCandidate(
                    new this.rtcAdapter.rtcIceCandidate(signal.candidate)
                )
                break;
            }
            case 'newDescription':
            {
                this.peerConnection.setRemoteDescription(
                    new this.rtcAdapter.rtcSessionDescription(signal.sdp), () => {
                        if(this.peerConnection.remoteDescription.type == 'offer') {
                            this.createAnswer();
                        }
                    }, logger.error
                );
                break;
            }
        }
    }

    createAnswer() {
        if(this.isLocalStreamAdded) {
            logger.info(' Creating Answer...');
            this.peerConnection.createAnswer(this.onDescriptionCreated.bind(this), logger.error);
        } else {
            logger.info(' Local stream not added...');
            setTimeout(() => {
                this.createAnswer();
            }, 1500);
        }
    }

    getName() {
        return 'Callee';
    }
}