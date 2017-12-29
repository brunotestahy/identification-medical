import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingsComponent } from './ratings.component';
import { RatingModule } from 'front-end-common';
import { Routes, RouterModule } from '@angular/router';
import { LoginModule, LoadingModule} from 'front-end-common';

const routes: Routes = [
  { path: '', component: RatingsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RatingModule,
    LoginModule,
    LoadingModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RatingsComponent]
})
export class RatingsModule { }
