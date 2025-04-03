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

    return items.filter((lab) => {
      // Get matching countries based on search text
      const matchingCountries = countries.filter(country =>
        country.name.toLocaleLowerCase().includes(searchText) ||
        country.code.toLocaleLowerCase().includes(searchText)
      );

      // Check if lab's country matches any of the found countries
      const countryMatches = matchingCountries.some(country =>
        lab.country && country.code === lab.country.toUpperCase()
      );

      return (
        (lab.name && lab.name.toLocaleLowerCase().includes(searchText)) ||
        (lab.university && lab.university.toLocaleLowerCase().includes(searchText)) ||
        (lab.instructor && lab.instructor.toLocaleLowerCase().includes(searchText)) ||
        (lab.course && lab.course.toLocaleLowerCase().includes(searchText)) ||
        countryMatches
      );
    });
  }
}
