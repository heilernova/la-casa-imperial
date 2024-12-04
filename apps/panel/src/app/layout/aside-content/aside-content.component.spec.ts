import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideContentComponent } from './aside-content.component';

describe('AsideContentComponent', () => {
  let component: AsideContentComponent;
  let fixture: ComponentFixture<AsideContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
