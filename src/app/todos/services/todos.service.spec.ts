import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterEnum } from '../types/filter.enum';

describe('TodosService', () => {
  let service: TodosService;
  let httpTestingController: HttpTestingController;
  const apiBaseUrl = 'http://localhost:3004/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService]
    });
    service = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be initial data', () => {
    expect(service.todosSig()).toEqual([]);
    expect(service.filterSig()).toEqual(FilterEnum.all);
    expect(service.apiBaseUrl).toEqual(apiBaseUrl);
  });

  describe('changeFilter', () => {
    it('should change filter', () => {
      service.changeFilter(FilterEnum.completed);
      expect(service.filterSig()).toEqual(FilterEnum.completed);
    });
  });

  describe('getTodos', () => {
    it('get correct todo', () => {
      const todos = [
        { id: 1, text: 'Todo 1', isCompleted: false },
        { id: 2, text: 'Todo 2', isCompleted: true }
      ];
      service.getTodos();
      const req = httpTestingController.expectOne(apiBaseUrl);
      req.flush(todos);
      expect(service.todosSig()).toEqual(todos);
    })
  });

  describe('addTodo', () => {
    it('createa a todo', () => {
      service.addTodo('Todo 1');
      const req = httpTestingController.expectOne(apiBaseUrl);
      req.flush({ id: 1, text: 'Todo 1', isCompleted: false });
      expect(service.todosSig()).toEqual([{ id: 1, text: 'Todo 1', isCompleted: false }]);
    });
  });

  describe('changeTodo', () => {
    it('updates a todo', () => {
      service.todosSig.set([{ text: 'foo', isCompleted: true, id: '1' }]);
      service.changeTodo('1', 'bar');
      const req = httpTestingController.expectOne(`${apiBaseUrl}/1`);
      req.flush({ text: 'bar', isCompleted: true, id: '1' });
      expect(service.todosSig()).toEqual([
        { text: 'bar', isCompleted: true, id: '1' },
      ]);
    });
  });

  describe('removeTodo', () => {
    it('toggles a todo', () => {
        service.todosSig.set([{ text: 'foo', isCompleted: true, id: '1' }]);
        service.removeTodo('1');

        const req = httpTestingController.expectOne(`${apiBaseUrl}/1`);
        req.flush({});
        expect(service.todosSig()).toEqual([]);
    })
  });

  describe('toggleTodo', () => {
    it('toggles a todo', () => {
      service.todosSig.set([{ text: 'foo', isCompleted: false, id: '1' }]);
      service.toggleTodo('1');

      const req = httpTestingController.expectOne(`${apiBaseUrl}/1`);
      req.flush({ text: 'foo', isCompleted: true, id: '1' });
      expect(service.todosSig()).toEqual([{ text: 'foo', isCompleted: true, id: '1' }]);
    });
  });

  describe('toggleAll', () => {
    it('toggles all todos', () => {
      service.todosSig.set([
        { text: 'foo', isCompleted: false, id: '1' },
        { text: 'bar', isCompleted: false, id: '2' },
      ]);
      service.toggleAll(true);

      const req = httpTestingController.match((request) =>
        request.url.includes(apiBaseUrl)
      );

      req[0].flush({ text: 'foo', isCompleted: true, id: '1' });
      req[1].flush({ text: 'bar', isCompleted: true, id: '2' });
      expect(service.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
        { text: 'bar', isCompleted: true, id: '2' },
      ]);
    });
  });
});
