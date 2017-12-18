import { Component, OnInit } from '@angular/core';
import { RatingService, Rating } from 'front-end-common';
import { error } from 'util';
import * as momentLib from 'moment';

const moment = (momentLib as any).default
  ? (momentLib as any).default
  : momentLib;

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  ratings: Array<Rating>;

  constructor(private ratingService: RatingService) { }

  ngOnInit() {
    this.ratingService.search(null, null, null, null, null, null, null, true).subscribe(
      (response) => {
        this.ratings = response;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getDate(rating: Rating) {
    if (rating.date != null) {
      console.log(rating.date);
      return moment(rating.date.dateTime, 'YYYY-MM-DDTHH:mm:ssZ').format('DD/MM/YYYY - HH:mm:ss');
    }
  }

}
