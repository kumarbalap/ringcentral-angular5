import { Injectable } from '@angular/core';

@Injectable()

export class RcGlobals {

    // set this from RC module
    rcCredentials: object = {
        appKey: '',
        appSecret: '',
        server: '',
        login: '',
        ext: '',
        password: '',
        logLevel: 0
    };

    sdk: object = null;
    platform: object = null;
    rcSession: any = null;

}
