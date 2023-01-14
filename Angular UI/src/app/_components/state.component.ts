import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import { CountryService, StateService } from '@app/_services';
import { State } from '../_models/state';

@Component({ selector: 'state', templateUrl: 'state.component.html' })
export class StateComponent implements OnInit, OnDestroy {
    statesSubscription!: Subscription;
    udpateStatesInputShow: {stateId:number, show: boolean}[] = []; 
    statesName: string | undefined;
    addStateName: string | undefined;
    states!: import("../_models/state").State[];
    countrySubscription!: Subscription;
    countries!: import("../_models/country").Country[];
    countryId: number | undefined;

    constructor( private stateService: StateService, private countryService: CountryService) { }

    ngOnInit() {
        this.getStates();
    }
        
    getStates() {
        this.getCountries();
        this.statesSubscription = this.stateService.getAll()
        .subscribe({
            next: (response: any) => {
                this.states = response;
            },
            error: (err: any) => {
                console.log(JSON.stringify(err));
            },
            complete: () => {
                if (this.states.length > 0) {
                    let ind: number= 0;
                    this.states.forEach(element => {
                        this.udpateStatesInputShow.push({stateId:element.stateId, show: false});
                        let currentStatesCountryName: string | undefined = this.countries.filter(x => x.countryId == this.states[ind].countryId)[0].countryName;
                        this.states[ind].country = { countryId: element.countryId, countryName: currentStatesCountryName}
                        ind += 1;
                    });
                }
            }
        });
    }

    getCountries() {
        this.countrySubscription = this.countryService.getAll()
        .subscribe({
            next: (response: any) => {
                this.countries = response;
            }, 
            error: (err: any) => {
                console.log(JSON.stringify(err));
            },
            complete: () => {}
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.statesSubscription.unsubscribe();
    }

    toggleUdpateStatesInputShowByStatesId(statesId: number, val: boolean) {
        this.udpateStatesInputShow[this.udpateStatesInputShow.findIndex(x => x.stateId == statesId)].show = val;
    }

    udpateStatesEdit(state: any) {
        this.statesName = state.stateName;
        this.toggleUdpateStatesInputShowByStatesId(state.stateId, true);
    }

    cancelStatesEdit(state: any) {
        this.toggleUdpateStatesInputShowByStatesId(state.stateId, false);
    }

    updateStatesSaveEdit(states: any) {
        states.statesName = this.statesName;
        this.udpateStatesPut(states.stateId, states);
    }

    udpateStatesPut(id: string | undefined, state: any) {
        let stateObj = { stateId: id, stateName: this.statesName, countryId: state.countryId};
        this.statesSubscription = this.stateService.update(id, stateObj)
        .subscribe({
            next: (response: any) => {
                let res = response;
                this.toggleUdpateStatesInputShowByStatesId(state.stateId, false);
                this.getStates();
            },
            error: (err: any) => {
                console.log(err.error);
            }
        });
    }

    AddStates(addStatesName: string | undefined) {
        let state = { stateId: 0, stateName: addStatesName, countryId: this.countryId};
        addStatesName = undefined;
        this.countryId = undefined;
        this.statesSubscription = this.stateService.create(state)
        .subscribe({
            next: (response: any) => {
                let res = response;
                this.getStates();
            },
            error: (err: any) => {
                console.log(err.error);
            },
            complete: () => {
                this.addStateName = undefined;
                this.countryId = undefined;
            }
        });
    }

    removeStates(id: number) {
        this.statesSubscription = this.stateService.delete(id)
        .subscribe({
            next: (response: any) => {
                let res = response;
                this.getStates();
            },
            error: (err: any) => {
                console.log(err.error);
            }
        });
    }
}