import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckResultsComponent } from './check-results.component';

describe('CheckResultsComponent', () => {
  let component: CheckResultsComponent;
  let fixture: ComponentFixture<CheckResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
