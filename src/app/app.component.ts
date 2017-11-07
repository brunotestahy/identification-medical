import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserLoader, LoginService } from 'front-end-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends UserLoader {
  title = 'app';
  currentLanguage = 'pt';
  browserLanguage = null;

  constructor(private translate: TranslateService, protected loginService: LoginService, protected router: Router) {
    super(loginService, router);
    this.translate.addLangs(['en', 'pt']);
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(this.currentLanguage);

    this.browserLanguage = translate.getBrowserLang();
    this.translate.use(this.browserLanguage);
    console.log(this.browserLanguage);
  }

  protected handleAccess() {
    if ('patient' === this.type) {
      console.log('Patient login detected, redirecting to login page');
      this.router.navigate(['/login']);
    }
  }
}
