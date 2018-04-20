import { Component, Injectable } from '@angular/core';

@Component({
    selector: 'app-rc-accepted',
    templateUrl: './accepted.component.html',
    styleUrls: ['./accepted.component.css']
})

@Injectable()

export class AcceptedComponent {

    static sessionObj = null;
    interval: any;
    showAccepted = true;
    showMute = true;
    showHold = true;
    acceptInfo = '';

    constructor() {}

    static getHTMLElement(selector) {
        return document.querySelector(selector) as HTMLElement;
    }

    onAccepted(session) {
        const self = this;
        this.showAccepted = true;
        AcceptedComponent.sessionObj = session;
        console.log('IncomingComponent: Accepted', session.request);

        this.interval = setInterval(function() {
            const time = session.startTime ? (Math.round((Date.now() - session.startTime) / 1000) + 's') : 'Ringing';
            /*AcceptedComponent.getHTMLElement('.info').innerText = 'time: ' + time + '\n' +
                'startTime: ' + JSON.stringify(session.startTime, null, 2) + '\n';*/
            self.acceptInfo = 'time: ' + time + '\n' +
              'startTime: ' + JSON.stringify(session.startTime, null, 2) + '\n';
        }, 1000);

        session.on('accepted', function() { console.log('Event: Accepted'); });
        session.on('progress', function() { console.log('Event: Progress'); });
        session.on('rejected', function() {
            console.log('Event: Rejected');
            self.dlgClose();
        });
        session.on('failed', function() {
            console.log('Event: Failed');
            self.dlgClose();
        });
        session.on('terminated', function() {
            console.log('Event: Terminated');
            self.dlgClose();
        });
        session.on('cancel', function() {
            console.log('Event: Cancel');
            self.dlgClose();
        });
        session.on('refer', function() {
            console.log('Event: Refer');
            self.dlgClose();
        });
        session.on('replaced', function(newSession) {
            console.log('Event: Replaced: old session', session, 'has been replaced with', newSession);
            self.dlgClose();
            self.onAccepted(newSession);
        });
        session.on('dtmf', function() { console.log('Event: DTMF'); });
        session.on('muted', function() { console.log('Event: Muted'); });
        session.on('unmuted', function() { console.log('Event: Unmuted'); });
        session.on('connecting', function() { console.log('Event: Connecting'); });
        session.on('bye', function() {
            console.log('Event: Bye');
            self.dlgClose();
        });

        session.mediaHandler.on('iceConnection', function() { console.log('Event: ICE: iceConnection'); });
        session.mediaHandler.on('iceConnectionChecking', function() { console.log('Event: ICE: iceConnectionChecking'); });
        session.mediaHandler.on('iceConnectionConnected', function() { console.log('Event: ICE: iceConnectionConnected'); });
        session.mediaHandler.on('iceConnectionCompleted', function() { console.log('Event: ICE: iceConnectionCompleted'); });
        session.mediaHandler.on('iceConnectionFailed', function() { console.log('Event: ICE: iceConnectionFailed'); });
        session.mediaHandler.on('iceConnectionDisconnected', function() { console.log('Event: ICE: iceConnectionDisconnected'); });
        session.mediaHandler.on('iceConnectionClosed', function() { console.log('Event: ICE: iceConnectionClosed'); });
        session.mediaHandler.on('iceGatheringComplete', function() { console.log('Event: ICE: iceGatheringComplete'); });
        session.mediaHandler.on('iceGathering', function() { console.log('Event: ICE: iceGathering'); });
        session.mediaHandler.on('iceCandidate', function() { console.log('Event: ICE: iceCandidate'); });
        session.mediaHandler.on('userMedia', function() { console.log('Event: ICE: userMedia'); });
        session.mediaHandler.on('userMediaRequest', function() { console.log('Event: ICE: userMediaRequest'); });
        session.mediaHandler.on('userMediaFailed', function() { console.log('Event: ICE: userMediaFailed'); });
    }

    dlgClose() {
        clearInterval(this.interval);
        // AcceptedComponent.getHTMLElement('.rcAcceptCont').style.display = 'none';
        this.showAccepted = false;
    }

    volumeUp() {
        AcceptedComponent.sessionObj.ua.audioHelper.setVolume(
          (AcceptedComponent.sessionObj.ua.audioHelper.volume != null ? AcceptedComponent.sessionObj.ua.audioHelper.volume : .5) + .1
        );
    }

    volumeDown() {
        AcceptedComponent.sessionObj.ua.audioHelper.setVolume(
          (AcceptedComponent.sessionObj.ua.audioHelper.volume != null ? AcceptedComponent.sessionObj.ua.audioHelper.volume : .5) - .1
        );
    }

    mute() {
        this.showMute = false;
        AcceptedComponent.sessionObj.mute();
    }

    unmute() {
        this.showMute = true;
        AcceptedComponent.sessionObj.unmute();
    }

    hold() {
        this.showHold = false;
        AcceptedComponent.sessionObj.hold().then(function() {
            console.log('Holding');
        }).catch(function(e) {
            console.error('Holding failed', e.stack || e);
        });
    }

    unhold() {
        this.showHold = true;
        AcceptedComponent.sessionObj.unhold().then(function() {
            console.log('UnHolding');
        }).catch(function(e) {
            console.error('UnHolding failed', e.stack || e);
        });
    }

    park() {
        AcceptedComponent.sessionObj.park().then(function() {
            console.log('Parked');
        }).catch(function(e) {
            console.error('Park failed', e.stack || e);
        });
    }

    hangup() {
        AcceptedComponent.sessionObj.terminate();
    }
}
