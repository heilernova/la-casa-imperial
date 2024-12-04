import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsEditPageComponent } from './items-edit-page.component';

describe('ItemsEditPageComponent', () => {
  let component: ItemsEditPageComponent;
  let fixture: ComponentFixture<ItemsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
