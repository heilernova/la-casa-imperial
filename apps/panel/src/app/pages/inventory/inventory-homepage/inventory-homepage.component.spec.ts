import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryHomepageComponent } from './inventory-homepage.component';

describe('InventoryHomepageComponent', () => {
  let component: InventoryHomepageComponent;
  let fixture: ComponentFixture<InventoryHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
