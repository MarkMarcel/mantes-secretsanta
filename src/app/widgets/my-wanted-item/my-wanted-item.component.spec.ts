import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWantedItemComponent } from './my-wanted-item.component';

describe('MyWantedItemComponent', () => {
  let component: MyWantedItemComponent;
  let fixture: ComponentFixture<MyWantedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWantedItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWantedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
