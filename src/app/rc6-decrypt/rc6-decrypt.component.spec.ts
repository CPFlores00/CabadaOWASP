import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rc6DecryptComponent } from './rc6-decrypt.component';

describe('Rc6DecryptComponent', () => {
  let component: Rc6DecryptComponent;
  let fixture: ComponentFixture<Rc6DecryptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rc6DecryptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rc6DecryptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
