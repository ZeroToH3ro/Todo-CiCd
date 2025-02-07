import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { FilterEnum } from '../../types/filter.enum';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let todoService: TodosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    todoService = TestBed.inject(TodosService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Screnarior: visibility
  describe('component visibility', () => {
    it('should be hidden when no todos', () => {
      const footer = fixture.debugElement.query(
        By.css('[data-testid="footer"]')
      );
      expect(footer.classes['hidden']).toEqual(true);
    });

    it('should be visible with todos', () => {
      const todo = {
        id: '1',
        text: 'foo',
        isCompleted: false
      };
      todoService.todosSig.set([todo])
      fixture.detectChanges();
      const footer = fixture.debugElement.query(
        By.css('[data-testid="footer"]')
      )
      expect(footer.classes['hidden']).not.toBeDefined();
    })

  })
  // Screnarior: counter
  describe('counters', () => {
      it('should be visible with one todo', () => {
        const todo = {
          id: '1',
          text: 'foo',
          isCompleted: false
        };
        todoService.todosSig.set([todo]);
        fixture.detectChanges();
        const todoCount = fixture.debugElement.query(
          By.css('[data-testid="todoCount"')
        );
        expect(todoCount.nativeElement.textContent).toContain('1 item left');
      });

      it('should be visible with 2 todos', () => {
        const todo = [
          {
            id: '1',
            text: 'foo',
            isCompleted: false
          },
          {
            id: '2',
            text: 'fizz',
            isCompleted: false
          }
        ];
        todoService.todosSig.set(todo);
        fixture.detectChanges();

        const todoCount = fixture.debugElement.query(
          By.css('[data-testid="todoCount"')
        );
        expect(todoCount.nativeElement.textContent).toContain('2 items left');
    })
  })
  // Screnarior: filter
  describe('filters', () => {
    it('highlights default filter', () => {
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"')
      );
      expect(filterLinks[0].classes['selected']).toBe(true);
    });

    it('highlights change filter', () => {
      todoService.filterSig.set(FilterEnum.active);
      fixture.detectChanges();
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"')
      );
      expect(filterLinks[1].classes['selected']).toBe(true);
    });

    it('changes a filter', () => {
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );
      filterLinks[1].triggerEventHandler('click');
      expect(todoService.filterSig()).toBe(FilterEnum.active);
    });
  })
});
