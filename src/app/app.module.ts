import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginModule, UiLogModule } from 'front-end-common';

import { AppComponent } from './app.component';

import { SharedModule } from './modules/shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UiLogModule,
    RouterModule.forRoot([
      {path: 'app', loadChildren: './modules/app-content/app-content.module#AppContentModule'},
      {path: 'evaluation', loadChildren: './modules/evaluation/evaluation.module#EvaluationModule'},
      {path: 'login', loadChildren: './modules/login/login.module#LoginModule'},
      {path: 'ratings', loadChildren: './modules/ratings/ratings.module#RatingsModule'},
      {path: '**', redirectTo: '/app/patient'}
    ]),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    BrowserAnimationsModule,
    NgbModule.forRoot()
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
