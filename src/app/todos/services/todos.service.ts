import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  httpClient = inject(HttpClient);
  todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);
  apiBaseUrl = 'http://localhost:3004/todos';

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  getTodos(): void {
    this.httpClient.get<TodoInterface[]>(this.apiBaseUrl).subscribe((todo) => {
      this.todosSig.set(todo);
      console.log("todo in todoService", todo)
    })
  };

  addTodo(text: string): void {
    const newTodo = {
      text,
      isCompleted: false
    };

    this.httpClient
      .post<TodoInterface>(this.apiBaseUrl, newTodo)
      .subscribe((createdTodo) => {
        this.todosSig.update((todos) => [...todos, createdTodo]);
      });
  };

  changeTodo(id: string, text: string): void {
    this.httpClient
      .patch<TodoInterface>(`${this.apiBaseUrl}/${id}`, { text })
      .subscribe((updatedTodo) => {
        this.todosSig.update((todos) =>
          todos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      }
    )
  };

  removeTodo(id: string): void {
    this.httpClient.delete(`${this.apiBaseUrl}/${id}`).subscribe(() => {
      this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
    });
  }

  toggleTodo(id: string): void {
    const todoUpdate = this.todosSig().find((todo) => todo.id === id);

    if (!todoUpdate) {
      throw new Error("Didn't find todo to update");
    }

    this.httpClient
      .patch<TodoInterface>(`${this.apiBaseUrl}/${id}`, {
        isCompleted: !todoUpdate.isCompleted
      })
      .subscribe((updatedTodo) => {
        this.todosSig.update((todos) =>
          todos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      });
  }

  toggleAll(isCompleted: boolean): void {
    const request$ = this.todosSig().map((todo) => {
      return this.httpClient.patch<TodoInterface>(`${this.apiBaseUrl}/${todo.id}`, {
        isCompleted
      });
    });
    forkJoin(request$).subscribe(() => {
      this.todosSig.update((todos) =>
        todos.map((todo) => ({...todo, isCompleted}))
      );
    });
  }
}
