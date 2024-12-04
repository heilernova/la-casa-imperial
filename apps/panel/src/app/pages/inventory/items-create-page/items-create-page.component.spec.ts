import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCreatePageComponent } from './items-create-page.component';

describe('ItemsCreatePageComponent', () => {
  let component: ItemsCreatePageComponent;
  let fixture: ComponentFixture<ItemsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
