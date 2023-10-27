import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { citiesOfBrazil } from '../data/cidades-mock';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root',
})
export class CityService {

  getCities(): Observable<City[]> {
    const citiesOrderedByName = this.orderCitiesByName(citiesOfBrazil);

    return of(citiesOrderedByName);
  }

  private orderCitiesByName(cities: City[]): City[] {
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  }
}
