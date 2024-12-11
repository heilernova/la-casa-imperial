import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultProductsComponent } from './result-products.component';

describe('ResultProductsComponent', () => {
  let component: ResultProductsComponent;
  let fixture: ComponentFixture<ResultProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
