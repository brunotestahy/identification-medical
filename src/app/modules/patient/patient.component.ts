import { Component, OnInit } from '@angular/core';
import { Patient, PatientService } from 'front-end-common';
import { RoomService, ConceptmapService } from 'front-end-common';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  patients: Array<Patient> = [];
  filteredPatients: Array<Patient> = [];
  urlNext: string;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  timer;

  roomMapping: Object;
  allRooms: Array<any>;
  allSectors: Array<any>;

  roomsBySector: Object;
  sectors: Array<any>;

  selectedOrder: string;
  selectedSector: string;

  ORDER_NAME = 'fullName';
  ROOM = 'room';

  private typeTimeout = 1000;

  constructor(private pService: PatientService,
              private cmService: ConceptmapService,
              private rService: RoomService) { }

  ngOnInit() {
    this.selectedOrder = this.ORDER_NAME;
    this.search('');

    Observable.zip(
      this.cmService.get(environment.roomMapping),
      this.rService.get(),
      this.rService.getSectors()
    )
    .subscribe(([roomMappingRes, allRoomsRes, allSectorsRes]) => {
      this.roomMapping = roomMappingRes.map;
      this.allRooms = allRoomsRes.values;
      this.allSectors = allSectorsRes.values;

      this.buildRoomsBySector();
      this.buildSectorsArray();
    });
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
    let nameFilter = null;
    let roomFilter = null;
    const nameMatch = filter.match(/[a-zA-Z]+/g);
    const roomMatch = filter.match(/[0-9]+/g);
    if (nameMatch != null) {
      nameFilter = nameMatch.join(',');
    }
    if (roomMatch != null) {
      roomFilter = roomMatch.join(',');
    }
    this.pService.search(nameFilter, roomFilter, null, true, true)
      .subscribe(response => {
        this.patients = response['dtoList'];
        this.urlNext = response['urlNext'];
        this.loading = false;
        this.filterBySector();
        this.orderBy();
      }, () => {
        this.loading = false;
        this.error = true;
      });
  }

  getMorePatients() {
    this.loadingMore = true;
    this.error = false;
    this.pService.getMorePatients(this.urlNext)
      .subscribe(response => {
        this.patients = this.patients.concat(response['dtoList']);
        this.urlNext = response['urlNext'];
        this.loadingMore = false;
      }, () => {
        this.loadingMore = false;
        this.error = true;
      });
  }

  buildRoomsBySector() {
    this.roomsBySector = new Object();
    Object.keys(this.roomMapping).map((room) => {
      const sector = this.roomMapping[room];
      let rooms: Array<string> = this.roomsBySector[sector];

      if (!rooms) {
        rooms = new Array<string>();
      }
      rooms.push(this.getRoomNumberByCode(room));
      this.roomsBySector[sector] = rooms;
    });
  }

  buildSectorsArray() {
    this.sectors = new Array<any>();
    this.allSectors.map((sector) => {
      this.sectors.push({value: sector['code'], display: sector['display']});
    });
  }

  getRoomNumberByCode(code: string): any {
    let result: string;
    let i = 0;
    while (!result && i < this.allRooms.length ) {
      const room = this.allRooms[i];
      if (room['code'] === code) {
        result = room['display'];
      }
      i++;
    }
    return result;
  }

  filterBySector() {
    if (this.selectedSector) {
      const roomsInSector: Array<string> = this.roomsBySector[this.selectedSector];
      this.filteredPatients = this.patients.filter((patient) => {
        if (roomsInSector.indexOf(patient.room) > -1) {
          return true;
        }
        return false;
      });
    } else {
      this.filteredPatients = this.patients;
    }
  }

  orderBy() {
    if (this.selectedOrder === this.ROOM) {
      const strs: Array<Patient> = [];
      const nums: Array<Patient> = [];
      this.filteredPatients.map((patient) => {
        const room = Number(patient[this.selectedOrder]);
        if (isNaN(room)) {
          strs.push(patient);
        } else {
          nums.push(patient);
        }
      });

      strs.sort((a, b) => {
        return this.compare(a[this.selectedOrder], b[this.selectedOrder]);
      });

      nums.sort((a, b) => {
        const numA = Number(a[this.selectedOrder]);
        const numB = Number(b[this.selectedOrder]);
        return this.compare(numA, numB);
      });

      this.filteredPatients = nums.concat(strs);
    } else {
      this.filteredPatients.sort((a, b) => {
        return this.compare(a[this.selectedOrder], b[this.selectedOrder]);
      });
    }
  }

  compare(a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }
}
