import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTreeNodeComponent } from './categories-tree-node.component';

describe('CategoriesTreeNodeComponent', () => {
  let component: CategoriesTreeNodeComponent;
  let fixture: ComponentFixture<CategoriesTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesTreeNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
