import { Injectable } from "@angular/core";

const ORDER_FILTER = 'PATIENT_ORDER_FILTER';
const SECTOR_FILTER = 'PATIENT_SECTOR_FILTER';
const ROLE_FILTER = 'PRACTITIONER_ROLE_FILTER';

export class UserSessionService {

    protected setStringValue(itemName: string, value: string): void {
        if (value == null || value.trim().length === 0) {
            sessionStorage.removeItem(itemName);
        } else {
            sessionStorage.setItem(itemName, value);
        }
    }

    protected getStringValue(itemName) {
        const value = sessionStorage.getItem(itemName);
        return value == null ? undefined : value;
    }

    set selectedOrder(selectedOrderValue: string) {
        this.setStringValue(ORDER_FILTER, selectedOrderValue);
    }

    get selectedOrder(): string {
        return this.getStringValue(ORDER_FILTER);
    }

    set selectedSector(selectedSectorValue: string) {
        this.setStringValue(SECTOR_FILTER, selectedSectorValue);
    }

    get selectedSector(): string {
        return this.getStringValue(SECTOR_FILTER);
    }

    get selectedRole(): string {
        return this.getStringValue(ROLE_FILTER);
    }

    set selectedRole(selectedRole: string) {
        this.setStringValue(ROLE_FILTER, selectedRole);
    }

}