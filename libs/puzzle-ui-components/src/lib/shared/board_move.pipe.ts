import { Pipe, PipeTransform } from '@angular/core';
import { Move, MoveToString } from '@puzzle-repo/puzzle-move-generator';

@Pipe({
  name: 'boardMove',
  standalone: true,
})
export class BoardMovePipe implements PipeTransform {
  transform(value: Move): string {
    return MoveToString(value);
  }
}
