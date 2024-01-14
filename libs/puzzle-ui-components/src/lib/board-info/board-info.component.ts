import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, Move, MoveToString } from '@puzzle-repo/puzzle-move-generator';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '@spartan-ng/ui-dialog-helm';
import {
  BrnDialogTriggerDirective,
  BrnDialogContentDirective,
} from '@spartan-ng/ui-dialog-brain';
import { BoardMovesDialogComponent } from '../board/board-moves-dialog/board-moves-dialog.component';
@Component({
  selector: 'board-info',
  standalone: true,
  templateUrl: './board-info.component.html',
  styleUrl: './board-info.component.css',
  imports: [
    CommonModule,
    HlmCardContentDirective,
    HlmCardHeaderDirective,
    HlmCardFooterDirective,
    HlmCardDirective,
    HlmCardTitleDirective,
    HlmButtonDirective,
    HlmScrollAreaComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    BoardMovesDialogComponent,
  ],
})
export class BoardInfoComponent {
  @ViewChild('scroll') scroll: any;
  @Input({ required: true }) board!: Board;

  @Output() goToEvent = new EventEmitter<number>();
  @Output() undoEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();

  scrollToBottom() {
    if (this.scroll) {
      this.scroll.scrollToBottom();
    }
  }

  sendGoTo(turn: number) {
    this.goToEvent.emit(turn);
  }
  sendUndo() {
    this.undoEvent.emit();
  }
  sendRedo() {
    this.redoEvent.emit();
  }
  sendReset() {
    this.resetEvent.emit();
  }
  MoveToString(move: Move): string {
    return MoveToString(move);
  }
}
