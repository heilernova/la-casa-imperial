import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDrawerMenuComponent } from './user-drawer-menu.component';

describe('UserDrawerMenuComponent', () => {
  let component: UserDrawerMenuComponent;
  let fixture: ComponentFixture<UserDrawerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDrawerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDrawerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
