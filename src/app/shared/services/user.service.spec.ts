import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { UserInteface } from '../types/user.interface';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // Screnarior: addUser
  describe('addUser', () => {
    it('should be add a user', () => {
      // Arrange
      const user: UserInteface = {
        id: '1',
        name: 'foo'
      };
      // Act
      service.addUser(user);
      // Assert
      expect(service.users$.getValue()).toEqual([{
        id: '1',
        name: 'foo'
      }]);
    });
  });

  describe('removeUser', () => {
    it('should be remove a user', () => {
      // Arrange
      service.users$.next([{
        id: '1',
        name: 'foo'
      }]);
      // Act
      service.removeUser('1');
      // Assert
      expect(service.users$.getValue()).toEqual([]);
    })
  })


});
