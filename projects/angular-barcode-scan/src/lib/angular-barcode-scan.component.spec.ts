import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularBarcodeScanComponent } from './angular-barcode-scan.component';

describe('AngularBarcodeScanComponent', () => {
  let component: AngularBarcodeScanComponent;
  let fixture: ComponentFixture<AngularBarcodeScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularBarcodeScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularBarcodeScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
