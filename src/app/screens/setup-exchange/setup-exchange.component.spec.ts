import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupExchangeComponent } from './setup-exchange.component';

describe('CreateSecretSantaExchangeComponent', () => {
  let component: SetupExchangeComponent;
  let fixture: ComponentFixture<SetupExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
