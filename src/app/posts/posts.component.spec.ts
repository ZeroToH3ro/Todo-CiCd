import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let store: MockStore;
  const initialState = {
    posts: {
      isLoading: false,
      error: null,
      posts: [{ id: '1', title: 'foo' }],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('renders posts', () => {
    const posts = fixture.debugElement.queryAll(
      By.css('[data-testid="posts"]')
    );
    expect(posts.length).toEqual(1);
    expect(posts[0].nativeElement.textContent).toContain('foo');
  });

  it('renders loading', () => {
    store.setState({
      ...initialState,
      posts: { ...initialState.posts, isLoading: true },
    });
    fixture.detectChanges();
    const loading = fixture.debugElement.query(
      By.css('[data-testid="loading"]')
    );
    expect(loading).toBeTruthy();
  });

  it('renders error', () => {
    store.setState({
      ...initialState,
      posts: { ...initialState.posts, error: 'Server error' },
    });
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('[data-testid="error"]'));
    expect(error.nativeElement.textContent).toContain('Server error');
  });
});
