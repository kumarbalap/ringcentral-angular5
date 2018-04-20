import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { LoginService } from './service/login.service';
import { DialupComponent } from './dialup/dialup.component';
import { IncomingComponent } from './incoming/incoming.component';
import { AcceptedComponent } from './accepted/accepted.component';
import { RcGlobals } from './rc.globals';


@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    declarations: [
        DialupComponent,
        IncomingComponent,
        AcceptedComponent
    ],
    exports: [
        DialupComponent,
        IncomingComponent,
        AcceptedComponent
    ],
    providers: [LoginService, RcGlobals, AcceptedComponent]
})

export class RingcentralModule {

    /*constructor(private loginService: LoginService) {
        this.loginService.login()
          .then(function () {
              console.log('inside');
          }).catch(function (e) {
              console.error(e.stack || e);
          });
    }*/

}
