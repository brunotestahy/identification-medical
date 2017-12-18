import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PractitionerRoleService {

    private roleMapSubject = new BehaviorSubject<Map<string, string>>(null);

    constructor( @Inject(TranslateService) private translate) {
        Observable.zip(
            this.translate.get('PRACTITIONERS.ROLE.DOCTOR'),
            this.translate.get('PRACTITIONERS.ROLE.NURSE'),
            this.translate.get('PRACTITIONERS.ROLE.NURSE_TECH')
        ).subscribe(([medicLabel, nurseLabel, nursingTechLabel]) => {
            const roleMap = new Map<string, string>();
            roleMap['DOCTOR'] = medicLabel;
            roleMap['NURSE'] = nurseLabel;
            roleMap['NURSE_TECH'] = nursingTechLabel;
            this.roleMapSubject.next(roleMap);
        });
    }

    public getRoleMapSubject(): BehaviorSubject<Map<string, string>> {
        return this.roleMapSubject;
    }

}
