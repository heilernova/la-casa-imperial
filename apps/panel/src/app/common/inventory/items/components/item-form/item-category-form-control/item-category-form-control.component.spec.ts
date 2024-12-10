import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoryFormControlComponent } from './item-category-form-control.component';

describe('ItemCategoryFormControlComponent', () => {
  let component: ItemCategoryFormControlComponent;
  let fixture: ComponentFixture<ItemCategoryFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCategoryFormControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCategoryFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
