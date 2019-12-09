import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DatePickerTranslationService extends NgbDatepickerI18n {
    weekdays = {
        short: []
    };
    months = {
        short: [],
        long: []
    };
    constructor(private translateService: TranslateService) {
        super();
        this.translateService.onLangChange.subscribe(() => {
            this._translate();
        });
        this._translate();
    }

    public getWeekdayShortName(weekday: number): string {
        if (weekday > 0 && weekday < 8) {
            return this.weekdays.short[weekday - 1];
        }
        return '';
    }
    public getMonthShortName(month: number): string {
        if (month > 0 && month < 13) {
            return this.months.short[month - 1];
        }
        return '';
    }
    public getMonthFullName(month: number): string {
        if (month > 0 && month < 13) {
            return this.months.long[month - 1];
        }
        return '';
    }
    public getDayAriaLabel(date: NgbDateStruct): string {
        return '';
    }

    private _translate() {
        this.translateService.get(['weekdays', 'months']).subscribe((translations => {
            this.weekdays.short = [];
            this.months.short = [];
            this.months.long = [];
            Object.keys(translations['weekdays'].short).forEach((day) => {
                this.weekdays.short.push(translations['weekdays'].short[day]);
            });
            Object.keys(translations['months'].short).forEach((month) => {
                this.months.short.push(translations['months'].short[month]);
            });
            Object.keys(translations['months'].long).forEach((month) => {
                this.months.long.push(translations['months'].long[month]);
            });
        }));
    }
}
