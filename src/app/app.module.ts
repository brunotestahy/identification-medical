import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginModule, UiLogModule } from 'front-end-common';

import { AppComponent } from './app.component';

import { SharedModule } from './modules/shared/shared.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LoginModule,
    UiLogModule,
    RouterModule.forRoot([
      { path: 'app', loadChildren: './modules/app-content/app-content.module#AppContentModule' },
      { path: 'login', loadChildren: './modules/login/login.module#LoginModule'},
      { path: '**', redirectTo: '/app/practitioner' }
    ]),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
