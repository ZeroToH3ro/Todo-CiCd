import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserInteface } from '../types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$ = new BehaviorSubject<UserInteface[]>([]);

  addUser(user: UserInteface): void {
    this.users$.next([...this.users$.getValue(), user]);
  }

  removeUser(userId: string): void {
    // filter user don't have this id
    const updateUser = this.users$.getValue().filter((user) => user.id !== userId);
    this.users$.next(updateUser);
  }
}
