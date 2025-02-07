import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostInterface } from './types/post.interface';
import { AppStateInterface } from '../types/appState.interface';
import { select, Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectIsLoading, selectError, selectPosts } from './store/reducers';
import * as PostsAction from "../posts/store/actions";

@Component({
  selector: 'posts',
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
  standalone: true
})
export class PostsComponent implements OnInit{
  posts$: Observable<PostInterface[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppStateInterface>) {
    this.posts$ = this.store.pipe(select(selectPosts));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.error$ = this.store.pipe(select(selectError));
  }

  ngOnInit(): void {
    this.store.dispatch(PostsAction.getPosts());
  }
}
