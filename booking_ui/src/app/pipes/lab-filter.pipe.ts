/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Lab } from '../interfaces/lab';
import { Pipe, PipeTransform } from '@angular/core';
import { countries } from 'src/app/store/country-data-store';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Lab[] | null, searchText: string): Lab[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    const typeMap: Record<string, string> = {
      bookable: 'Available for Booking',
      development: 'Under Development',
      demand: 'Available on Demand',
      unavailable: 'Unavailable',
      always: 'Always Available'
    }

    const matchingAvailabilityTypes = Object.entries(typeMap)
      .filter(([_, label]) => label.toLowerCase().includes(searchText))
      .map(([key]) => key);

    const matchingCountries = countries.filter(country =>
      country.name.toLocaleLowerCase().includes(searchText) ||
      country.code.toLocaleLowerCase().includes(searchText)
    );

    return items.filter((lab) => {
      const availabilityMatch = matchingAvailabilityTypes.includes(lab.availability_type?.toLowerCase() || '');

      const countryMatches = matchingCountries.some(country =>
        lab.country && country.code === lab.country.toUpperCase()
      );

      return (
        (lab.name && lab.name.toLocaleLowerCase().includes(searchText)) ||
        (lab.university && lab.university.toLocaleLowerCase().includes(searchText)) ||
        (Array.isArray(lab.instructor)
          ? lab.instructor.join(' ').toLocaleLowerCase().includes(searchText)
          : lab.instructor && lab.instructor.toLocaleLowerCase().includes(searchText)) ||
        (lab.course && lab.course.toLocaleLowerCase().includes(searchText)) ||
        availabilityMatch ||
        countryMatches
      );
    });
  }
}
