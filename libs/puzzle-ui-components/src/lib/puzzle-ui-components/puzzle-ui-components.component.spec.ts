import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuzzleUiComponentsComponent } from './puzzle-ui-components.component';

describe('PuzzleUiComponentsComponent', () => {
  let component: PuzzleUiComponentsComponent;
  let fixture: ComponentFixture<PuzzleUiComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleUiComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PuzzleUiComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
