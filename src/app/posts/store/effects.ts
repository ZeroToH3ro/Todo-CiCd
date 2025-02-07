import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PostsService } from '../services/posts.service';
import * as PostsActions from './actions';

@Injectable()
export class PostsEffects {
  private readonly postsService = inject(PostsService);
  private readonly actions$ = inject(Actions);

  // Log actions (if needed)
  constructor() {
    this.actions$.subscribe(action => {
      console.log('New action:', action);
    });
  }

  getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getPosts),
      mergeMap(() => {
        return this.postsService.getPosts().pipe(
          map((posts) => PostsActions.getPostsSuccess({ posts })),
          catchError((error) =>
            of(PostsActions.getPostsFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
