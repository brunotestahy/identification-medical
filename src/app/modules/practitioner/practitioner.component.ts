import { Component, OnInit } from '@angular/core';
import { Practitioner, PractitionerService } from 'front-end-common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class PractitionerComponent implements OnInit {

  practitioners: Array<Practitioner> = [];
  urlNext: string;
  photoDialogOpened: boolean;
  selectedPractitioner: Practitioner;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  timer;

  private typeTimeout = 1000;

  constructor(private pService: PractitionerService) { }

  ngOnInit() {
    this.search('');
    this.error = false;
  }

  debouncedSearch(filter: string) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search(filter);
    }, this.typeTimeout);
  }

  search(filter: string) {
    this.loading = true;
    this.error = false;
    this.urlNext = null;
    this.pService.searchPractitioners(filter.replace(' ', ','), environment.his, true, 20)
      .subscribe(response => {
        this.practitioners = response['dtoList'];
        this.urlNext = response['urlNext'];
        this.loading = false;
      }, () => {
        this.loading = false;
        this.error = true;
      });
  }

  getMorePractitioners() {
    this.loadingMore = true;
    this.error = false;
    this.pService.getMorePractitioners(this.urlNext)
      .subscribe(response => {
        this.practitioners = this.practitioners.concat(response['dtoList']);
        this.urlNext = response['urlNext'];
        this.loadingMore = false;
      }, () => {
        this.loadingMore = false;
        this.error = true;
      });
  }

  openPractitionerPhotoDialog(practitioner: Practitioner) {
    this.selectedPractitioner = practitioner;
    this.photoDialogOpened = true;
  }

  onOverlayClick() {
    this.photoDialogOpened = false;
  }

  onPractitionerSaved(practitionerSaved: Practitioner) {
    this.selectedPractitioner.photo = practitionerSaved.photo;
    this.photoDialogOpened = false;
  }

}
