import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { Board, Move, MoveToString } from '@puzzle-repo/puzzle-move-generator';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'board-moves-dialog-button',
  standalone: true,
  imports: [
    CommonModule,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,

    HlmButtonDirective,
  ],
  templateUrl: './board-moves-dialog.component.html',
  styleUrl: './board-moves-dialog.component.scss',
})
export class BoardMovesDialogComponent {
  @Input({ required: true }) board!: Board;
  MoveToString(move: Move): string {
    return MoveToString(move);
  }
}
