import { Component, inject, computed } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  todoService = inject(TodosService);
  filterSig = this.todoService.filterSig;
  filterEnum = FilterEnum;
  activeCount = computed(() => {
    return this.todoService.todosSig().filter((todo) => !todo.isCompleted).length;
  });
  noTodosClass = computed(() => this.todoService.todosSig().length === 0);
  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  );
  changeFilter(filterName: FilterEnum): void {
    this.todoService.changeFilter(filterName);
  }
}

