import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWantedComponent } from './item-wanted.component';

describe('ItemWantedComponent', () => {
  let component: ItemWantedComponent;
  let fixture: ComponentFixture<ItemWantedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemWantedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWantedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
