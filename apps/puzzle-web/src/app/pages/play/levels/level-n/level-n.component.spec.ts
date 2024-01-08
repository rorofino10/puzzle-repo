import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelNComponent } from './level-n.component';

describe('LevelNComponent', () => {
  let component: LevelNComponent;
  let fixture: ComponentFixture<LevelNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelNComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
