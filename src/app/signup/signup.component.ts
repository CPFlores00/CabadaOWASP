import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: [''],
      newsletter: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  signUp() {
    const val = this.registerForm.value;
    console.log(val);

    if (this.registerForm.valid)
      this.authService.signUp(val.email, val.password)
        .subscribe(
          () => console.log("User created successfully"),
          console.error
        );
  }

}
