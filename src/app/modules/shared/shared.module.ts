import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

import { FrontEndConfigProvider, FrontEndHttpFactory } from 'front-end-common';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: [
    { provide: FrontEndConfigProvider, useValue: environment },
    {
      provide: Http,
      useFactory: FrontEndHttpFactory,
      deps: [XHRBackend, RequestOptions, FrontEndConfigProvider, Router]
    }
  ]
})
export class SharedModule { }
