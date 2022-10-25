import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsWantedComponent } from './items-wanted.component';

describe('ItemsWantedComponent', () => {
  let component: ItemsWantedComponent;
  let fixture: ComponentFixture<ItemsWantedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsWantedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsWantedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
