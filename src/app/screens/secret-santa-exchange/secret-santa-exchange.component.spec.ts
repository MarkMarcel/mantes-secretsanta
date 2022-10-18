import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretSantaExchangeComponent } from './secret-santa-exchange.component';

describe('SecretSantaExchangeComponent', () => {
  let component: SecretSantaExchangeComponent;
  let fixture: ComponentFixture<SecretSantaExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretSantaExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretSantaExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
