import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Board, BitBoard } from '@puzzle-repo/puzzle-move-generator';
import { BoardComponent } from '@puzzle-repo/puzzle-ui-components';
import { BoardStringToBitboard } from 'libs/puzzle-move-generator/src/lib/BitBoard/bitboard';

@Component({
  selector: 'puzzle-repo-level-n',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './level-n.component.html',
  styleUrl: './level-n.component.scss',
})
export class LevelNComponent {
  private activatedRoute = inject(ActivatedRoute);

  normie_pieces_bitboard = BoardStringToBitboard(
    this.activatedRoute.snapshot.params['normie_pieces']
  );
  golden_piece_bitboard = BoardStringToBitboard(
    this.activatedRoute.snapshot.params['golden_piece']
  );
  golden_square_bitboard = BoardStringToBitboard(
    this.activatedRoute.snapshot.params['golden_square']
  );

  board = new Board(
    this.normie_pieces_bitboard,
    this.golden_piece_bitboard,
    this.golden_square_bitboard
  );
}
