export class State {
    stateId: number = 0;
    stateName: string ="";
    countryId: number = 0;
    country?: {
        countryId?: number,
        countryName?: string
    }
}