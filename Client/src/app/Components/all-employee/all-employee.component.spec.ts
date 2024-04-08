import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeComponent } from './all-employee.component';

describe('AllEmployeeComponent', () => {
  let component: AllEmployeeComponent;
  let fixture: ComponentFixture<AllEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
