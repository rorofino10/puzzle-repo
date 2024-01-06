import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelDailyComponent } from './level-daily.component';

describe('LevelDailyComponent', () => {
  let component: LevelDailyComponent;
  let fixture: ComponentFixture<LevelDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelDailyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
