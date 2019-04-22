import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { User } from '../model/user';

export const ANONYMOUS_USER: User = {
  _id: undefined,
  email: ''
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private subject = new BehaviorSubject<User>(ANONYMOUS_USER);
  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user._id));
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map(isLoggedIn => !isLoggedIn));

  constructor(private http: HttpClient) { }

  signUp(firstName: string, lastName: string, email: string, password: string, phoneNumber: string, isSuscribedToNewsletter: boolean) {
    return this.http.post<User>('http://localhost:3000/api/user', {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      isSuscribedToNewsletter
    })
      .pipe(
        shareReplay(),
        tap(user => this.subject.next(user))
      );
  }

}
