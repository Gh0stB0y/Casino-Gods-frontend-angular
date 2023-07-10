import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacarratComponent } from './bacarrat.component';

describe('BacarratComponent', () => {
  let component: BacarratComponent;
  let fixture: ComponentFixture<BacarratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacarratComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacarratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
