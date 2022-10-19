import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSecretSantaExchangeComponent } from './create-secret-santa-exchange.component';

describe('CreateSecretSantaExchangeComponent', () => {
  let component: CreateSecretSantaExchangeComponent;
  let fixture: ComponentFixture<CreateSecretSantaExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSecretSantaExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSecretSantaExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
