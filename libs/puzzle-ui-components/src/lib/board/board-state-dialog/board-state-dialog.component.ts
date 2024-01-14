import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  computed,
  signal,
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
import { BoardState, BoardSuccess } from '@puzzle-repo/puzzle-move-generator';

@Component({
  selector: 'board-state-dialog',
  standalone: true,
  imports: [
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
        <h3 hlmDialogTitle class="text-foreground">Board State</h3>
        <p hlmDialogDescription>
          {{ stateTitle() }}
        </p>
      </hlm-dialog-header>

      <!-- <hlm-dialog-footer>
        <button hlmBtn type="submit">Save changes</button>
      </hlm-dialog-footer> -->
    </hlm-dialog-content>
  </hlm-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardStateDialogComponent implements OnInit {
  @ViewChild('dialog') dialog!: HlmDialogComponent;
  @ViewChild('trigger') trigger!: ElementRef<HTMLButtonElement>;
  @Input({ required: true }) boardStateEvent!: EventEmitter<BoardState>;

  boardState = signal<BoardState>(0);
  stateTitle = computed(() => {
    switch (this.boardState()) {
      case 1:
        return BoardSuccess.WIN;

      case -1:
        return BoardSuccess.LOST;

      // case 1/2:
      //   return BoardSuccess.LOST

      default:
        return BoardSuccess.UNDEFINED;
    }
  });

  ngOnInit(): void {
    this.boardStateEvent.subscribe((boardState) => {
      this.trigger.nativeElement.click();
      this.boardState.set(boardState);
    });
  }
}
