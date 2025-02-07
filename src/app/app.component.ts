import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';

@Component({
  selector: 'app-root',
  imports: [TodosComponent, CommonModule, PostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'todo-app';
}
