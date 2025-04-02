/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Lab } from '../interfaces/lab';

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
      return (
        (lab.name && lab.name.toLocaleLowerCase().includes(searchText)) ||
        (lab.university && lab.university.toLocaleLowerCase().includes(searchText)) ||
        (lab.instructor && lab.instructor.toLocaleLowerCase().includes(searchText)) ||
        (lab.course && lab.course.toLocaleLowerCase().includes(searchText))
      );
    });
  }
}
