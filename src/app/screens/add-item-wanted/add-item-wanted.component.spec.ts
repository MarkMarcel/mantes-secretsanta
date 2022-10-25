import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemWantedComponent } from './add-item-wanted.component';

describe('AddItemWantedComponent', () => {
  let component: AddItemWantedComponent;
  let fixture: ComponentFixture<AddItemWantedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemWantedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemWantedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
