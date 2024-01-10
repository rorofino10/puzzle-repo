import { Pipe, PipeTransform } from '@angular/core';
import { FILE_STRING_MAP } from '@puzzle-repo/puzzle-move-generator';

@Pipe({
  name: 'boardFile',
  standalone: true,
})
export class BoardFilePipe implements PipeTransform {
  transform(value: number): string {
    return FILE_STRING_MAP[value - 1];
  }
}
