import {User} from '/client/js/user/User.js';
import {Logger} from '/client/js/common/log.js';

const logger = new Logger();

export class Caller extends User
{
    constructor(connectionToken, rtcAdapter, signalingServer)
    {
        super('#' + connectionToken, rtcAdapter, signalingServer);

        this.signalingServer.onopen = this.onSignalingServerOpen.bind(this);
        this.signalingServer.onmessage = this.onCallerMessage.bind(this);
    }

    onSignalingServerOpen() {
        logger.info(' Caller onSignalingServerOpen ');
        this.send({
            token : this.connectionToken,
            type : 'join'
        });
    }

    onCallerMessage(event) {
        let signal = JSON.parse(event.data);
        logger.info(` Received Message - Type :: ${signal.type}`);
        
        switch(signal.type)
        {
            case 'calleeArrived':
            {
                this.createOffer();
                break;        
            }
            case 'newIceCandidate':
            {
                this.peerConnection.addIceCandidate(
                    new this.rtcAdapter.rtcIceCandidate(signal.candidate)
                );
                break;
            }
            case 'newDescription':
            {
                this.peerConnection.setRemoteDescription(
                    new this.rtcAdapter.rtcSessionDescription(signal.sdp)
                );
            }
        }
    }

    createOffer() {
        if(this.isLocalStreamAdded) {
            logger.info(' Creating Offer...');
            this.peerConnection.createOffer(this.onDescriptionCreated.bind(this), logger.error);
        } else {
            logger.info(' Local stream not added yet...');
            setTimeout(() => {
                this.createOffer();
            }, 1500);
        }
    }

    getName() {
        return 'Caller';
    }
}