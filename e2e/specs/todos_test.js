Feature('Todos');

// Mock data
const mockTodos = [
  {
    text: 'first todo',
    isCompleted: true,
    id: 1,
  },
  {
    text: 'second todo',
    isCompleted: false,
    id: 2,
  },
  {
    text: 'third todo',
    isCompleted: false,
    id: 3,
  },
];

// Store mock configurations
BeforeSuite(({ I }) => {
  // Add mock routes (this doesn't apply them yet)
  I.addMockRoute('GET', 'http://localhost:8080/todos', mockTodos);
  I.addMockRoute('POST', 'http://localhost:8080/todos', {
    text: 'foo',
    id: 4,
    isCompleted: false,
  });
  I.addMockRoute('DELETE', 'http://localhost:8080/todos/1', {});
  I.addMockRoute('PATCH', 'http://localhost:8080/todos/1', {
    text: 'foo',
    id: 1,
    isCompleted: false,
  });
});

// Apply mocks before each test
Before(async ({ I }) => {
  await I.amOnPage('/');
  await I.applyMocks();
});

// Clear mocks after each test
After(async ({ I }) => {
  await I.clearMocks();
});

// Your test scenarios remain the same
Scenario('Visits the initial project page', ({ I }) => {
  I.see('todos');
});

Scenario('renders 3 todos', ({ I }) => {
  I.seeNumberOfElements('[data-cy="todo"]', 3);

  // Check todo labels
  within({ css: '[data-cy="todoLabel"]' }, () => {
    I.see('first todo', { at: 0 });
    I.see('second todo', { at: 1 });
    I.see('third todo', { at: 2 });
  });

  // Check first checkbox is checked
  I.seeCheckboxIsChecked({ css: '[data-cy="todoCheckbox"]' }, { at: 0 });
});

Scenario('renders footer', ({ I }) => {
  I.see('2 items left', '[data-cy="todoCount"]');

  within({ css: '[data-cy="filterLink"]' }, () => {
    I.see('All', { at: 0 });
    I.seeElement('.selected', { at: 0 });
    I.see('Active', { at: 1 });
    I.see('Completed', { at: 2 });
  });
});

Scenario('can change filter', ({ I }) => {
  I.click({ css: '[data-cy="filterLink"]' }, { at: 1 });
  I.seeElement('[data-cy="filterLink"].selected', { at: 1 });
});

Scenario('can add todo', ({ I }) => {
  I.fillField('[data-cy="newTodoInput"]', 'foo');
  I.pressKey('Enter');
  I.see('3 items left', '[data-cy="todoCount"]');
  I.see('foo', { css: '[data-cy="todoLabel"]', at: 3 });
});

Scenario('can remove todo', ({ I }) => {
  I.click({ css: '[data-cy="destroy"]' }, { at: 0 });
  I.seeNumberOfElements('[data-cy="todo"]', 2);
});

Scenario('can toggle a todo', ({ I }) => {
  I.click({ css: '[data-cy="todoCheckbox"]' }, { at: 0 });
  I.dontSeeCheckboxIsChecked({ css: '[data-cy="todoCheckbox"]' }, { at: 0 });
});

Scenario('can toggle all todo', async ({ I }) => {
  // Mock PATCH responses for all todos
  I.mockEndpoint('PATCH', 'http://localhost:8080/todos/*', {
    text: 'foo',
    id: 1,
    isCompleted: true,
  });

  I.click('[data-cy="toggleAll"]');

  // Verify all checkboxes are checked
  for (let i = 0; i < 3; i++) {
    I.seeCheckboxIsChecked({ css: '[data-cy="todoCheckbox"]' }, { at: i });
  }
});

Scenario('should update a todo', ({ I }) => {
  // Mock PATCH response for updating todo
  I.mockEndpoint('PATCH', 'http://localhost:8080/todos/1', {
    text: 'bar',
    id: 1,
    isCompleted: false,
  });

  // Double click to edit
  I.doubleClick({ css: '[data-cy="todoLabel"]' }, { at: 0 });
  I.fillField('[data-cy="todoEdit"]', 'bar');
  I.pressKey('Enter');

  // Verify update
  I.see('bar', { css: '[data-cy="todoLabel"]', at: 0 });
});
