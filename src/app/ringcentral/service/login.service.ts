import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import {RcGlobals} from '../rc.globals';
import * as RingCentral from 'RingCentral';
import * as SIP from 'sip.js';
import * as pubnub from 'pubnub';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

@Injectable()

export class LoginService {

    rcCredentials: object;

    constructor(
        private http: Http,
        private rcGlobals: RcGlobals
    ) {
      this.rcCredentials = rcGlobals.rcCredentials;
    }

    login() {
        const self = this;
        if (this.rcGlobals.sdk === null) {
            const sdk = new RingCentral({
                appKey: self.rcCredentials['appKey'],
                appSecret: self.rcCredentials['appSecret'],
                server: self.rcCredentials['server']
            });

            this.rcGlobals.sdk = sdk;
            const platform = sdk.platform();

            return new Promise(function(resolve, reject) {
                platform
                  .login({
                    username: self.rcCredentials['login'],
                    extension: self.rcCredentials['ext'] || null,
                    password: self.rcCredentials['password']
                  })
                  .then(function () {
                      resolve({
                          sdk: sdk,
                          platform: platform
                      });
                  }).catch(function (e) {
                      console.error(e.stack || e);
                      reject(e);
                  });
            });
        }
    }

    registerSip(platform) {
        return new Promise(function(resolve, reject) {
            platform.get('/restapi/v1.0/account/~/extension/~')
              .then(function(res) {
                  const extension = res.json();
                  console.log('Extension info', extension);
                  return platform.post('/client-info/sip-provision', {
                      sipInfo: [{
                          transport: 'WSS'
                      }]
                  });
              })
              .then(function(res) {
                  resolve( res.json() );
              })
              .catch(function(e) {
                  console.error('Error in main promise chain');
                  console.error(e.stack || e);
                  reject(e);
              });
        });
    }

}
