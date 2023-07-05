import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Search
        </button>
      </form>
      <div>
        <p *ngIf="filterFeedback">{{ filterFeedback }}</p>
        <button *ngIf="filterFeedback" (click)="filterResults('')">
          All Listings
        </button>
      </div>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      >
      </app-housing-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];
  filterFeedback: string = '';

  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
    });
  }

  // filterResults(text: string) {
  //   if (!text) {
  //     this.filteredLocationList = this.housingLocationList;
  //   }

  //   this.filteredLocationList = this.housingLocationList.filter(
  //     (housingLocation) =>
  //       housingLocation?.city.toLowerCase().includes(text.toLowerCase())
  //   );

  // }

  //alternative for more comprehensive filtering including city, name, and state

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      this.filterFeedback = ''; // Clear the filter feedback
      return; // Exit the method early if no filter text is provided
    }

    const searchText = text.toLowerCase(); // Convert the filter text to lowercase for case-insensitive matching

    this.filteredLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        housingLocation?.city.toLowerCase().includes(searchText) ||
        housingLocation?.name.toLowerCase().includes(searchText) ||
        housingLocation?.state.toLowerCase().includes(searchText)
    );

    this.filterFeedback =
      this.filteredLocationList.length > 0
        ? ''
        : 'No matching locations found.';
  }
}
