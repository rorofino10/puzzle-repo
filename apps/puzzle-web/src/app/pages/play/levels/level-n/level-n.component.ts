import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Board, BitBoard } from '@puzzle-repo/puzzle-move-generator';
import { BoardComponent } from '@puzzle-repo/puzzle-ui-components';
import { BoardStringToBitboard } from 'libs/puzzle-move-generator/src/lib/BitBoard/bitboard';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'puzzle-repo-level-n',
  standalone: true,
  imports: [CommonModule, BoardComponent, HlmButtonDirective],
  templateUrl: './level-n.component.html',
  styleUrl: './level-n.component.scss',
})
export class LevelNComponent implements OnInit {
  @Input('normie_pieces') normie_pieces!: string;
  @Input('golden_piece') golden_pieces!: string;
  @Input('golden_square') golden_squares!: string;

  playableBoard!: Board;

  ngOnInit(): void {
    this.playableBoard = Board.FromString(
      this.normie_pieces,
      this.golden_pieces,
      this.golden_squares
    );
  }
}
