import { Component, Injectable, Input, ElementRef } from '@angular/core';
import {RcGlobals} from '../rc.globals';
import { LoginService } from '../service/login.service';
import * as RingCentral from 'RingCentral';
import * as RcWebPhone from 'ringcentral-web-phone';
import { AcceptedComponent } from '../accepted/accepted.component';


@Component({
    selector: 'app-rc-incoming',
    templateUrl: './incoming.component.html',
    styleUrls: ['./incoming.component.css']
})

// ElementRef nativeElement not working
export class IncomingComponent {

    static sessionObj = null;
    @Input() assetPath = 'app/ringcentral/assets/';
    showIncoming = false;

    audioIncoming = this.assetPath + 'audio/incoming.ogg';
    audioOutgoing = this.assetPath + 'audio/outgoing.ogg';
    acceptOptions: object;


    constructor(private loginService: LoginService,
                private rcGlobals: RcGlobals,
                private accComp: AcceptedComponent) {
        const self = this;

        self.loginService.login()
          .then(function (res) {
              console.log( res );
              self.rcGlobals.sdk = res['sdk'];
              self.rcGlobals.platform = res['platform'];
              return self.loginService.registerSip(res['platform']);
          }).then(function (res) {
              console.log( res );
              self._register(res);
          }).catch(function (e) {
              console.error(e.stack || e);
          });
    }

    static getHTMLElement(selector) {
        return document.querySelector(selector) as HTMLElement;
    }

    _register(sipData) {
        const self = this;
        const webPhone = new RcWebPhone(sipData, {
            appKey: self.rcGlobals.rcCredentials['appKey'],
            audioHelper: {
                enabled: true
            },
            logLevel: parseInt( self.rcGlobals.rcCredentials['logLevel'], 10)
        });

        webPhone.userAgent.audioHelper.loadAudio({
            incoming: self.audioIncoming,
            outgoing: self.audioOutgoing
        });

        webPhone.userAgent.audioHelper.setVolume(.3);

        webPhone.userAgent.on('invite', this._onInvite);
        webPhone.userAgent.on('connecting', function() { console.log('UA connecting'); });
        webPhone.userAgent.on('connected', function() { console.log('UA Connected'); });
        webPhone.userAgent.on('disconnected', function() { console.log('UA Disconnected'); });
        webPhone.userAgent.on('registered', function() { console.log('UA Registered'); });
        webPhone.userAgent.on('unregistered', function() { console.log('UA Unregistered'); });
        webPhone.userAgent.on('registrationFailed', function() { console.log('UA RegistrationFailed', arguments); });
        webPhone.userAgent.on('message', function() { console.log('UA Message', arguments); });
    }

    _onInvite(session) {
        IncomingComponent.getHTMLElement('.rcIncomeCont').style.display = 'block';
        IncomingComponent.sessionObj = session;

        console.log('EVENT: Invite', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        this.acceptOptions = {
            media: {
                render: {
                    remote: IncomingComponent.getHTMLElement('#remoteVideo'),
                    local: IncomingComponent.getHTMLElement('#localVideo')
                }
            }
        };

        session.on('rejected', function() {
            IncomingComponent.getHTMLElement('.rcIncomeCont').style.display = 'none';
        });
    }

    answer() {
        const self = this;

        IncomingComponent.getHTMLElement('.before-answer').style.display = 'none';
        IncomingComponent.getHTMLElement('.answered').style.display = '';
        IncomingComponent.sessionObj.accept( this.acceptOptions )
          .then(function() {
              IncomingComponent.getHTMLElement('.rcIncomeCont').style.display = 'none';
              self.onAccepted( IncomingComponent.sessionObj );
          })
          .catch(function(e) { console.error('Accept failed', e.stack || e); });
    }

    decline() {
        console.log(IncomingComponent.sessionObj);
        IncomingComponent.sessionObj.reject();
    }

    toVoicemail() {
        IncomingComponent.sessionObj.toVoicemail();
    }

    onAccepted(session) {
        console.log('EVENT: Accepted', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        this.accComp.onAccepted(session);
    }


}
