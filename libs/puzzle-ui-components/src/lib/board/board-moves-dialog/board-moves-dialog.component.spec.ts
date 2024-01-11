import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardMovesDialogComponent } from './board-moves-dialog.component';

describe('BoardMovesDialogComponent', () => {
  let component: BoardMovesDialogComponent;
  let fixture: ComponentFixture<BoardMovesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardMovesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMovesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
