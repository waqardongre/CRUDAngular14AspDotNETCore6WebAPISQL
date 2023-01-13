import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountryService } from '@app/_services';

@Component({ selector: 'country', templateUrl: 'country.component.html' })
export class CountryComponent implements OnInit, OnDestroy {
    countriesSubscription!: Subscription;
    udpateCountryInputShow: {countryId:number, show: boolean}[] = []; 
    countryName: string | undefined;
    addCountryName: string | undefined;
    countries!: import("../_models/country").Country[];

    constructor(private countryService: CountryService) { }

    ngOnInit() {
        this.getCountries();
    }
        
    getCountries() {
        this.countriesSubscription = this.countryService.getAll()
        .subscribe({
            next: (response) => {
                this.countries = response;
            }, 
            error: (err) => {
                console.log(JSON.stringify(err));
            },
            complete: () => {
                if (this.countries.length > 0) {
                    this.countries.forEach(element => {
                        this.udpateCountryInputShow.push({countryId:element.countryId, show: false});    
                    });
                }
            }
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.countriesSubscription.unsubscribe();
    }

    toggleUdpateCountryInputShowByCountryId(countryId: number, val: boolean) {
        this.udpateCountryInputShow[this.udpateCountryInputShow.findIndex(x => x.countryId == countryId)].show = val;
    }

    udpateCountryEdit(country: any) {
        this.countryName = country.countryName;
        this.toggleUdpateCountryInputShowByCountryId(country.countryId, true);
    }

    cancelCountryEdit(country: any) {
        this.toggleUdpateCountryInputShowByCountryId(country.countryId, false);
    }

    updateCountrySaveEdit(country: any) {
        country.countryName = this.countryName;
        this.udpateCountryPut(country.countryId, country);
    }

    udpateCountryPut(id: string | undefined, country: any) {
        this.countriesSubscription = this.countryService.update(id, country)
        .subscribe({
            next: response => {
                let res = response;
                this.toggleUdpateCountryInputShowByCountryId(country.countryId, false);
                this.getCountries();
            },
            error: err => {
                console.log(err.error);
            }
        });
    }
    
    AddCountry(addCountryName: string | undefined) {
        if (addCountryName != undefined && addCountryName != "") {
            let country = { countryId: 0, countryName: addCountryName};
            this.countriesSubscription = this.countryService.create(country)
            .subscribe({
                next: response => {
                    let res = response;
                    this.getCountries();
                },
                error: err => {
                    console.log(err.error);
                },
                complete: () => {
                    this.addCountryName = undefined;
                }
            });    
        }
    }

    removeCountry(id: number) {
        this.countriesSubscription = this.countryService.delete(id)
        .subscribe({
            next: response => {
                let res = response;
                this.getCountries();
            },
            error: err => {
                if (err.error == "countryid_foreignkey_for_some_state") {
                    alert("This CountryId is a foreign key for some state");
                }
                console.log(err.error);
            }
        });
    }
}