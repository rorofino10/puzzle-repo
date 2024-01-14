import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardStateDialogComponent } from './board-state-dialog.component';

describe('BoardStateDialogComponent', () => {
  let component: BoardStateDialogComponent;
  let fixture: ComponentFixture<BoardStateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardStateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
