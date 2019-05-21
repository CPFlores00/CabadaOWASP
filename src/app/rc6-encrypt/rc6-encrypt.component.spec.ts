import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rc6EncryptComponent } from './rc6-encrypt.component';

describe('Rc6EncryptComponent', () => {
  let component: Rc6EncryptComponent;
  let fixture: ComponentFixture<Rc6EncryptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rc6EncryptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rc6EncryptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
