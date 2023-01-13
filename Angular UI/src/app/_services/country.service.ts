import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Country} from '@app/_models';

const baseUrl = `${environment.apiUrl}/api/Countries`;

@Injectable({ providedIn: 'root' })
export class CountryService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Country>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string | undefined, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}