import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let todoService: TodosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo', () => {
    jest.spyOn(todoService, 'addTodo').mockImplementation(() => {});
    const input = fixture.debugElement.query(
      By.css('[data-testid="newTodoInput"]')
    );
    const component = fixture.componentInstance;

    component.text = 'New Todo';
    fixture.detectChanges();

    input.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', {key: 'Enter'})
    );
    fixture.detectChanges();

    expect(todoService.addTodo).toHaveBeenCalledWith('New Todo');
    expect(input.nativeElement.value).toEqual('');
  })
});
