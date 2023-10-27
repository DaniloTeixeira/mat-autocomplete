import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, debounceTime, filter, map, startWith } from 'rxjs';
import { citiesOfBrazil } from './data/cidades-mock';
import { City } from './models/City';
import { CityService } from './services';
import { removeAccents } from './utils/removeAccents';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ],
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ],
  providers: [ CityService ]
})
export class AppComponent {
  private cityService = inject(CityService);

  protected cities = citiesOfBrazil;
  protected myControl = new FormControl('');
  protected filteredCities$!: Observable<City[]>;

  ngOnInit() {
    this.getAllCities();
    this.setfilteredCities();
  }

  displayFn(city: City): string {
    return city?.name || '';
  }

  private filterCities(value: string): City[] {
    const filterValue = removeAccents(value)!.toLowerCase();

    return this.cities.filter(option => removeAccents(option.name).toLowerCase().includes(filterValue));
  }

  private getAllCities(): void {
    this.cityService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  private setfilteredCities(): void {
    this.filteredCities$ = this.myControl.valueChanges.pipe(
      filter((value) => typeof value === 'string'),
      debounceTime(500),
      startWith(''),
      map(value => this.filterCities(value as string)),
    );
  }
}