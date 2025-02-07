import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: '<div data-testid="message-container">{{message}}</div>',
})
export class ErrorMessageComponent {
  @Input() message: string = "Something went wrong";
}
