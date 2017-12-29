import { Component, OnInit } from '@angular/core';
import { RatingService, Rating, LoginService } from 'front-end-common';
import { error } from 'util';
import * as momentLib from 'moment';
import { PatientChecker } from '../patient-checker';
import { Router } from '@angular/router';
import { orderBy } from 'lodash';

const moment = (momentLib as any).default
  ? (momentLib as any).default
  : momentLib;

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent extends PatientChecker implements OnInit {

  ratings: Array<Rating>;
  loading: boolean;

  constructor(private ratingService: RatingService, protected loginService: LoginService, protected router: Router) {
    super(loginService, router);
  }

  ngOnInit() {
    this.loading = true;
    super.ngOnInit();
    this.ratingService.search(null, null, null, null, null, null, null, true).subscribe(
      (response) => {
        this.ratings = response;
        this.ratings.forEach(rt => {
          rt.date = this.getDate(rt)
        });
        this.ratings = orderBy(this.ratings, ['date'], ['desc']);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false; 
      }
    );
  }

  getDate(rating: Rating) {
    if (rating.date != null) {
      return moment(rating.date.dateTime, 'YYYY-MM-DDTHH:mm:ssZ').format('DD/MM/YYYY - HH:mm:ss');
    }
  }

}
