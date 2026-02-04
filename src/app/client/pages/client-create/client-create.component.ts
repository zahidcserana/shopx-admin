import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ClientFormComponent],
  template: `<app-client-form></app-client-form>`
})
export class ClientCreateComponent {}
