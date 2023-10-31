import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable, debounceTime, filter, map, startWith, tap } from 'rxjs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { statesOfBrazil } from './data/states-of-brazil';
import { State } from './models/State';
import { StateService } from './services/state';
import { removeAccents } from './utils/removeAccents';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [StateService]
})
export class AppComponent {
  private stateService = inject(StateService);

  protected states = statesOfBrazil;
  protected searchingStates = false;
  protected myControl = new FormControl('');
  protected filteredStates$!: Observable<State[]>;

  ngOnInit() {
    this.getAllStates();
    this.setFilteredStates();
  }

  displayFn(state: State): string {
    return state?.name || '';
  }

  private filterCities(value: string): State[] {
    const filterValue = removeAccents(value)!.toLowerCase();

    return this.states.filter(option => removeAccents(option.name).toLowerCase().includes(filterValue));
  }

  private getAllStates(): void {
    this.stateService.getCities().subscribe(states => {
      this.states = states;
    });
  }

  private setFilteredStates(): void {
    this.filteredStates$ = this.myControl.valueChanges.pipe(
      filter((value) => typeof value === 'string'),
      tap(() => this.searchingStates = true),
      debounceTime(500),
      startWith(''),
      map(value => this.filterCities(value as string)),
      tap(() => this.searchingStates = false)
    );
  }
}