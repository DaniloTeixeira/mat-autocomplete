import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { statesOfBrazil } from '../../data/states-of-brazil';
import { State } from '../../models/State';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  getCities(): Observable<State[]> {
    const citiesOrderedByName = this.orderCitiesByName(statesOfBrazil);

    return of(citiesOrderedByName);
  }

  private orderCitiesByName(states: State[]): State[] {
    return states.sort((a, b) => a.name.localeCompare(b.name));
  }
}
