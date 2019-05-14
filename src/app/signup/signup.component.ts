import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.minLength(1),
        Validators.maxLength(25)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.minLength(1),
        Validators.maxLength(35)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  signUp() {
    const val = this.registerForm.value;

    if (this.registerForm.valid) {
      this.authService.signUp(val.firstName, val.lastName, val.email, val.password)
        .subscribe(
          () => this.router.navigate(['/home']),
          console.error
        );
    }
  }

}
