import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentLanguage = 'pt';
  browserLanguage = null;

  constructor(
    private translate: TranslateService,
    protected router: Router,
    private titleService: Title
  ) {
    this.translate.addLangs(['en', 'pt']);
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(this.currentLanguage);

    this.browserLanguage = translate.getBrowserLang();
    this.translate.use(this.browserLanguage);

    this.translate.get('APP_TITLE').subscribe(title => {
      this.titleService.setTitle(title);
    });

  }
}
