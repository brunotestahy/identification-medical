import { PatientService, FrontEndConfigProvider } from 'front-end-common';
import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PatientCachedService extends PatientService {

    private searchCachedURL: string;

    private paginationCachedURL: string;

    constructor(protected http: Http, @Inject(FrontEndConfigProvider) config) {
        super(http, config);
        this.searchCachedURL = config.patient.searchCachedURL;
        this.paginationCachedURL = config.patient.paginationCachedURL;
    }

    public searchCached(names?: string, room?: string, admitted?: boolean, count?: number): Observable<any> {
        const options = new RequestOptions();
        options.params = new URLSearchParams();
        options.params.set('names', names);
        options.params.set('room', room);
        options.params.set('system', this.his);
        options.params.set('admitted', String(admitted));
        if (count) {
            options.params.set('count', String(count));
        }
        return super.get(this.searchCachedURL + '/paginated', options);
    }

    public getMorePatients(urlNext: string): Observable<any> {
        const options = new RequestOptions();
        options.params = new URLSearchParams();
        options.params.set('url', urlNext);
        return super.get(this.paginationCachedURL, options);
    }

}
