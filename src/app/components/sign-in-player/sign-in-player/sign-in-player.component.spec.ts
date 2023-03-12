import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPlayerComponent } from './sign-in-player.component';

describe('SignInPlayerComponent', () => {
  let component: SignInPlayerComponent;
  let fixture: ComponentFixture<SignInPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
