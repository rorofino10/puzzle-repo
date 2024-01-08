import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Board, BitBoard } from '@puzzle-repo/puzzle-move-generator';
import { BoardComponent } from '@puzzle-repo/puzzle-ui-components';

@Component({
  selector: 'puzzle-repo-level-n',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './level-n.component.html',
  styleUrl: './level-n.component.scss',
})
export class LevelNComponent {
  private activatedRoute = inject(ActivatedRoute);

  normie_pieces_bitboard = new BitBoard(
    BigInt(this.activatedRoute.snapshot.params['normie_pieces'])
  );
  golden_piece_bitboard = BitBoard.empty().setBit(
    Number(this.activatedRoute.snapshot.params['golden_piece'])
  );
  golden_square_bitboard = BitBoard.empty().setBit(
    Number(this.activatedRoute.snapshot.params['golden_square'])
  );

  board = new Board(
    this.normie_pieces_bitboard,
    this.golden_piece_bitboard,
    this.golden_square_bitboard
  );
}
