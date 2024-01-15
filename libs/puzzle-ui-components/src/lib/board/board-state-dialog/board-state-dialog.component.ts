import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Signal,
  ViewChild,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnDialogTriggerDirective,
  BrnDialogContentDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '@spartan-ng/ui-dialog-helm';
import {
  BoardState,
  BoardSuccess,
  Move,
} from '@puzzle-repo/puzzle-move-generator';
import { BoardMovePipe } from '../../shared/board_move.pipe';

@Component({
  selector: 'board-state-dialog',
  standalone: true,
  imports: [
    BoardMovePipe,
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
  template: ` <hlm-dialog #dialog>
    <button
      #trigger
      class="hidden"
      id="edit-profile"
      brnDialogTrigger
      hlmBtn
    ></button>
    <hlm-dialog-content
      #content
      class="sm:max-w-[425px]"
      *brnDialogContent="let ctx"
    >
      <hlm-dialog-header>
        <h3 hlmDialogTitle class="text-foreground">{{ stateInfo().title }}</h3>
        <p hlmDialogDescription>
          {{ stateInfo().description }}
        </p>
      </hlm-dialog-header>

      <div
        class="justify-center inline-flex flex-row flex-wrap max-w-[250px] rounded-md border border-border"
      >
        @for (move of _moves(); track $index) {
        <button hlmBtn variant="outline" class="text-secondary-foreground">
          {{ $index + 1 }}
          {{ move | boardMove }}
        </button>

        }
      </div>
      <!-- <hlm-dialog-footer>
        <button hlmBtn type="submit">Save changes</button>
      </hlm-dialog-footer> -->
    </hlm-dialog-content>
  </hlm-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardStateDialogComponent {
  @ViewChild('dialog') dialog!: HlmDialogComponent;
  @ViewChild('trigger') trigger!: ElementRef<HTMLButtonElement>;

  protected readonly _boardState = signal<BoardState>(0);
  @Input()
  set boardState(state: BoardState) {
    this._boardState.set(state);
    if (this.trigger && state !== BoardState.UNDEFINED) {
      this.trigger.nativeElement.click();
    }
  }

  protected readonly _moves = signal<Move[]>([]);
  @Input()
  set moves(moves_val: Move[]) {
    this._moves.set(moves_val);
  }

  stateInfo = computed(() => {
    switch (this._boardState()) {
      case 1:
        return { title: BoardSuccess.WIN, description: 'Good job!' };

      case -1:
        return { title: BoardSuccess.LOST, description: 'Wow, you suck...' };

      // case 1/2:
      //   return BoardSuccess.LOST

      default:
        return {
          title: BoardSuccess.UNDEFINED,
          description: 'Keep going, you are almost there.',
        };
    }
  });
}
